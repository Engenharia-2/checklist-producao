import { useState } from 'react';
import { Alert } from 'react-native';
import { useSessionStore } from '../store/sessionStore';
import { useImagePicker } from './useImagePicker';
import { usePermissions } from './usePermissions';
import { apiService } from '../services/apiService';
import { AttachedImage } from '../report/types';
import { withRetry, runWithConcurrency } from '../utils/promiseUtils';

export const useImageManager = (sessionId: string, imageKey: string) => {
    const { sessions, updateChecklistItem } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const answers = (session as any)?.answers || {};
    const images: string[] = answers[imageKey] || [];

    const [isCameraVisible, setIsCameraVisible] = useState(false);
    const [uploadingQueue, setUploadingQueue] = useState<AttachedImage[]>([]);
    const { requestCameraPermission } = usePermissions();

    const handleImagesOutput = async (uris: string[]) => {
        const newUploads: AttachedImage[] = uris.map(uri => ({
            id: Math.random().toString(),
            uri,
            status: 'uploading'
        }));

        setUploadingQueue(prev => [...prev, ...newUploads]);

        const tasks = newUploads.map((uploadItem) => async () => {
            try {
                return await withRetry(async () => {
                    const remoteUrl = await apiService.uploadImage(uploadItem.uri);
                    if (!remoteUrl) {
                        throw new Error('Falha ao subir imagem para o servidor (retornou nulo)');
                    }
                    // Remove do progresso em caso de sucesso
                    setUploadingQueue(prev => prev.filter(item => item.id !== uploadItem.id));
                    return remoteUrl;
                }, 3, 1000);
            } catch (error) {
                // Marca com erro na fila se falhar todas as vezes
                setUploadingQueue(prev =>
                    prev.map(item => item.id === uploadItem.id ? { ...item, status: 'error' } : item)
                );
                return null;
            }
        });

        const uploadResults = await runWithConcurrency(tasks, 2);

        const successfulUrls = uploadResults.filter((url): url is string => url !== null);
        const failedCount = uploadResults.filter(url => url === null).length;

        if (failedCount > 0) {
            Alert.alert(
                "Falha no Upload",
                `Não foi possível enviar ${failedCount} imagem(ns) após várias tentativas de conexão. Por favor, tente anexá-las novamente.`,
                [{ text: "OK" }]
            );
        }

        if (successfulUrls.length > 0) {
            const latestSession = useSessionStore.getState().sessions.find(s => s.id === sessionId);
            const latestAnswers = (latestSession as any)?.answers || {};
            const currentImagesList: string[] = latestAnswers[imageKey] || [];
            const newImagesList = [...currentImagesList, ...successfulUrls];
            await updateChecklistItem(sessionId, { [imageKey]: newImagesList });
        }
    };

    const { pickImage, processImages } = useImagePicker(handleImagesOutput);

    const handleDeleteImage = (uriToDelete: string) => {
        setUploadingQueue(prev => prev.filter(item => item.uri !== uriToDelete));
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

    const savedAttachedImages: AttachedImage[] = images.map(uri => ({
        uri,
        status: 'uploaded'
    }));

    const attachedImages = [...savedAttachedImages, ...uploadingQueue];

    return {
        attachedImages,
        isCameraVisible,
        pickImage,
        processImages,
        handleDeleteImage,
        handleTakePicture,
        closeCamera,
    };
};
