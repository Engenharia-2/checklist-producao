import React from 'react';
import { Modal, View, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { CustomButton } from '@/src/components/ui/Button';
import { CustomDropdown } from '@/src/components/ui/Dropdown';
import { useInspectionForm } from '@/src/hooks/useInspectionForm';
import { styles } from './styles';

interface InspectionCreateModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: { osNumber: string; serialNumber: string; formName: string; formId: string }) => Promise<void>;
    initialData?: { osNumber: string; serialNumber: string; formName: string; formId: string };
    title?: string;
    submitText?: string;
}

export const InspectionCreateModal: React.FC<InspectionCreateModalProps> = ({
    visible,
    onClose,
    onSubmit,
    initialData,
    title = 'Nova OP / Inspeção',
    submitText = 'Criar e Iniciar'
}) => {
    const {
        osNumber,
        setOsNumber,
        serialNumber,
        setSerialNumber,
        equipmentName,
        formId,
        products,
        isLoadingProducts,
        isSubmitting,
        handleSelectProduct,
        handleConfirm,
    } = useInspectionForm({ visible, initialData, onSubmit, onClose });

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>{title}</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Número da OP</Text>
                            <TextInput
                                style={styles.input}
                                value={osNumber}
                                onChangeText={setOsNumber}
                                placeholder="Ex: 12345"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Número de Série</Text>
                            <TextInput
                                style={styles.input}
                                value={serialNumber}
                                onChangeText={setSerialNumber}
                                placeholder="Ex: 9999"
                                keyboardType="numeric"
                            />
                        </View>

                        <CustomDropdown
                            label="Modelo do Equipamento"
                            value={equipmentName}
                            placeholder="Selecione um equipamento"
                            options={products}
                            isLoading={isLoadingProducts}
                            onSelect={handleSelectProduct}
                            emptyMessage="Nenhum formulário encontrado no servidor."
                        />

                        <View style={styles.buttonContainer}>
                            <View style={styles.buttonWrapper}>
                                <CustomButton
                                    title="Cancelar"
                                    onPress={onClose}
                                    variant="secondary"
                                />
                            </View>
                            <View style={styles.buttonWrapper}>
                                <CustomButton
                                    title={isSubmitting ? "Enviando..." : submitText}
                                    onPress={handleConfirm}
                                    isLoading={isSubmitting}
                                    disabled={!osNumber || !serialNumber || !formId || isSubmitting}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
