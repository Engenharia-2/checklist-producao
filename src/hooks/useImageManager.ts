import { useState } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { useImagePicker } from './useImagePicker';
import { usePermissions } from './usePermissions';

export const useImageManager = (sessionId: string, imageKey: string) => {
    const { sessions, updateChecklistItem } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const images: string[] = session?.checklist?.[imageKey] || [];

    const [isCameraVisible, setIsCameraVisible] = useState(false);
    const { requestCameraPermission } = usePermissions();

    const handleImageOutput = (uri: string) => {
        const newImages = [...images, uri];
        updateChecklistItem(sessionId, { [imageKey]: newImages });
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
