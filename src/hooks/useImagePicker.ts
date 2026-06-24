import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';
import { Alert } from 'react-native';

export const useImagePicker = (onImagesProcessed: (uris: string[]) => void) => {
    const processImages = useCallback(async (uris: string[]) => {
        try {
            const results = await Promise.all(
                uris.map(async (uri) => {
                    const manipContext = ImageManipulator.manipulate(uri);
                    manipContext.resize({ width: 1200 });
                    
                    const renderResult = await manipContext.renderAsync();
                    const savedResult = await renderResult.saveAsync({ 
                        compress: 0.7, 
                        format: SaveFormat.JPEG 
                    });
                    
                    return savedResult.uri;
                })
            );

            onImagesProcessed(results);
        } catch (error) {
            console.error('Error processing images:', error);
            Alert.alert('Erro', 'Não foi possível processar as imagens.');
        }
    }, [onImagesProcessed]);

    const pickImage = useCallback(async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uris = result.assets.map(asset => asset.uri);
            processImages(uris);
        }
    }, [processImages]);

    return { pickImage, processImages };
};
