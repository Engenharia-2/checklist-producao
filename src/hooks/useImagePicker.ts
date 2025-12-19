import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';
import { Alert } from 'react-native';

export const useImagePicker = (onImageProcessed: (uri: string) => void) => {
    const processImage = useCallback(async (uri: string) => {
        try {
            const result = await manipulateAsync(
                uri,
                [{ resize: { width: 1200 } }],
                { compress: 0.7, format: SaveFormat.JPEG }
            );

            onImageProcessed(result.uri);
        } catch (error) {
            console.error('Error processing image:', error);
            Alert.alert('Erro', 'Não foi possível processar a imagem.');
        }
    }, [onImageProcessed]);

    const pickImage = useCallback(async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
            processImage(result.assets[0].uri);
        }
    }, [processImage]);

    return { pickImage, processImage };
};
