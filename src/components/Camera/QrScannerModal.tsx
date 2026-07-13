import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { styles } from './style';

interface QrScannerModalProps {
    isVisible: boolean;
    onClose: () => void;
    onScan: (data: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ isVisible, onClose, onScan }) => {
    const [permission, requestPermission] = useCameraPermissions();

    // Se estiver invisível, nem renderiza
    if (!isVisible) return null;

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={isVisible}
                onRequestClose={onClose}
            >
                <View style={styles.permissionContainer}>
                    <Text style={styles.permissionText}>
                        Precisamos de permissão para acessar a câmera e ler o QR Code da OP/Número de Série.
                    </Text>
                    <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                        <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                    }}
                    onBarcodeScanned={({ data }) => {
                        if (data) {
                            onScan(data);
                            onClose();
                        }
                    }}
                />
                
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>

                <View style={styles.overlayContainer}>
                    <View style={styles.scanArea} />
                    <Text style={styles.instructionText}>
                        Posicione o QR Code da OP dentro do quadrado acima.
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

export default QrScannerModal;
