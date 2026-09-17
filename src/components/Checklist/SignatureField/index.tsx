import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import { File, Directory, Paths } from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../../../services/apiService';
import { styles } from './styles';

interface SignatureFieldProps {
    field: any;
    value: string | null;
    onFieldChange: (fieldId: string, value: string | null) => void;
    editable?: boolean;
}

export const SignatureField: React.FC<SignatureFieldProps> = ({
    field,
    value,
    onFieldChange,
    editable = true,
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const signRef = useRef<any>(null);
    const { height: screenHeight } = useWindowDimensions();
    const label = !field.label || field.label === 'Nova Assinatura' ? 'Assinatura' : field.label;

    const handleOK = async (signature: string) => {
        console.log('[SignatureField] handleOK acionado. Preparando base64...');
        const base64Data = signature.replace('data:image/png;base64,', '');
        const filename = `signature_${Date.now()}.png`;

        setIsUploading(true);
        try {
            console.log('[SignatureField] Resolvendo cacheDir e arquivo...');
            const cacheDir = new Directory(Paths.cache);
            const tempFile = new File(cacheDir, filename);
            
            console.log(`[SignatureField] Gravando arquivo temporário: ${tempFile.uri}`);
            await tempFile.write(base64Data, { encoding: 'base64' });

            console.log(`[SignatureField] Arquivo gravado. Aguardando 300ms para sync do File System...`);
            await new Promise(resolve => setTimeout(resolve, 300));

            console.log('[SignatureField] Iniciando upload via apiService...');
            const remoteUrl = await apiService.uploadImage(tempFile.uri);
            if (remoteUrl) {
                console.log(`[SignatureField] Upload finalizado com sucesso. Retorno da API: ${remoteUrl}`);
                onFieldChange(field.id, remoteUrl);
            } else {
                Alert.alert("Erro", "Não foi possível enviar a assinatura para o servidor.");
            }
        } catch (e) {
            console.error(e);
            Alert.alert("Erro", "Falha ao processar assinatura.");
        } finally {
            setIsUploading(false);
            setModalVisible(false);
        }
    };

    const handleClear = () => {
        if (!editable) return;
        Alert.alert(
            "Limpar Assinatura",
            "Tem certeza que deseja apagar esta assinatura?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Limpar",
                    style: "destructive",
                    onPress: async () => {
                        const oldUrl = value;
                        onFieldChange(field.id, null);
                        if (oldUrl) {
                            try {
                                await apiService.deleteImage(oldUrl);
                            } catch (e) {
                                console.error("Erro ao apagar arquivo remoto da assinatura", e);
                            }
                        }
                    }
                }
            ]
        );
    };

    // Oculta o rodapé interno do HTML5
    const webStyle = `.m-signature-pad--footer { display: none !important; } body,html { width: 100%; height: 100%; }`;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            {value ? (
                <View style={styles.previewContainer}>
                    <View style={styles.imageWrapper}>
                        <Image source={{ uri: value }} style={styles.signatureImage} resizeMode="contain" />
                    </View>
                    {editable && (
                        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                            <Ionicons name="trash-outline" size={16} color="#fff" />
                            <Text style={styles.clearButtonText}>Limpar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <View style={styles.fullWidth}>
                    {editable ? (
                        <TouchableOpacity 
                            style={styles.collectButton} 
                            onPress={() => setModalVisible(true)}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="create-outline" size={24} color="#fff" />
                                    <Text style={styles.collectButtonText}>Coletar Assinatura</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.noSignatureText}>Sem assinatura cadastrada</Text>
                    )}
                </View>
            )}

            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{label}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalButton}>
                            <Ionicons name="close" size={28} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.canvasArea}>
                        <View style={[styles.canvasWrapper, { height: screenHeight / 3 }]}>
                            <SignatureScreen
                                ref={signRef}
                                onOK={handleOK}
                                webStyle={webStyle}
                                trimWhitespace
                                autoClear={false} // Evita que limpe sozinho antes da hora
                            />
                        </View>
                    </View>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={[styles.modalButton, styles.modalButtonSecondary]} 
                            onPress={() => signRef.current?.clearSignature()}
                            disabled={isUploading}
                        >
                            <Text style={styles.modalButtonTextSecondary}>Limpar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.modalButton, styles.modalButtonPrimary, isUploading && { opacity: 0.7 }]} 
                            onPress={() => signRef.current?.readSignature()}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.modalButtonTextPrimary}>Salvar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
