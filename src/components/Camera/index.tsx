import { CameraView } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './style';

interface CameraModalProps {
    isVisible: boolean;
    onClose: () => void;
    onPictureTaken: (photo: { uri: string }) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isVisible, onClose, onPictureTaken }) => {
    const cameraRef = useRef<CameraView>(null);
    const [isTakingPicture, setIsTakingPicture] = useState(false);

    const handleTakePicture = async () => {
        if (isTakingPicture || !cameraRef.current) return;

        setIsTakingPicture(true);
        try {
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
            if (photo?.uri) {
                onPictureTaken(photo);
            } else {
                Alert.alert('Erro', 'Não foi possível capturar a foto.');
            }
        } catch (error) {
            console.error('CameraModal: Erro ao tirar foto:', error);
            Alert.alert('Erro', 'Não foi possível tirar a foto. Tente novamente.');
        } finally {
            setIsTakingPicture(false);
            onClose(); // Close modal regardless of outcome
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <CameraView style={styles.camera} facing="back" ref={cameraRef} />
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
                <View style={styles.controlsContainer}>
                    <TouchableOpacity
                        style={[styles.captureButton, isTakingPicture && styles.captureButtonDisabled]}
                        onPress={handleTakePicture}
                        disabled={isTakingPicture}
                    >
                        <View style={styles.captureButtonInner} />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
