import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { CustomButton } from '../Button';

interface PasswordModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    title?: string;
    description?: string;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
    visible,
    onClose,
    onSuccess,
    title = 'Senha Requerida',
    description = 'Esta operação exige validação por senha.'
}) => {
    const [password, setPassword] = useState('');

    const handleConfirm = () => {
        // Senha padrão configurada como "1234"
        if (password === '7024') {
            setPassword('');
            onSuccess();
            onClose();
        } else {
            Alert.alert('Erro', 'Senha incorreta. Tente novamente.');
            setPassword('');
        }
    };

    const handleClose = () => {
        setPassword('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.description}>{description}</Text>

                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Digite a senha..."
                            secureTextEntry
                            autoFocus
                        />

                        <View style={styles.buttonContainer}>
                            <View style={styles.buttonWrapper}>
                                <CustomButton
                                    title="Cancelar"
                                    onPress={handleClose}
                                    variant="secondary"
                                />
                            </View>
                            <View style={styles.buttonWrapper}>
                                <CustomButton
                                    title="Confirmar"
                                    onPress={handleConfirm}
                                    disabled={!password}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: 320,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#000000',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    buttonWrapper: {
        flex: 1,
    },
});

export default PasswordModal;
