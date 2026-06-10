import { useState } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { useImagePicker } from './useImagePicker';
import { usePermissions } from './usePermissions';
import { apiService } from '../services/apiService';

export const useImageManager = (sessionId: string, imageKey: string) => {
    const { sessions, updateChecklistItem } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const answers = (session as any)?.answers || {};
    const images: string[] = answers[imageKey] || [];

    const [isCameraVisible, setIsCameraVisible] = useState(false);
    const { requestCameraPermission } = usePermissions();

    const handleImageOutput = async (uri: string) => {
        try {
            const remoteUrl = await apiService.uploadImage(uri);
            if (remoteUrl) {
                const newImages = [...images, remoteUrl];
                updateChecklistItem(sessionId, { [imageKey]: newImages });
            }
        } catch (error) {
            console.error('Error in handleImageOutput:', error);
        }
    };

    const { pickImage, processImage } = useImagePicker(handleImageOutput);

    const handleDeleteImage = (uriToDelete: string) => {
        const newImages = images.filter(uri => uri !== uriToDelete);
        updateChecklistItem(sessionId, { [imageKey]: newImages });
    };

    const handleTakePicture = async () => {
        const hasPermission = await requestCameraPermission();
        if (hasPermission) {
            setIsCameraVisible(true);
        }
    };

    const closeCamera = () => {
        setIsCameraVisible(false);
    };

    return {
        images,
        isCameraVisible,
        pickImage,
        processImage,
        handleDeleteImage,
        handleTakePicture,
        closeCamera,
    };
};
