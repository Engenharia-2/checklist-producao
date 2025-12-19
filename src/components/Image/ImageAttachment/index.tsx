import { MaterialIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View, Image } from 'react-native';
import { styles } from './style';

interface ImageAttachmentProps {
    title?: string; // Optional title for the image section
    attachedImages: string[];
    onPickImage: () => void;
    onTakePicture: () => void;
    onDeleteImage: (uri: string) => void;
}

export const ImageAttachment: FC<ImageAttachmentProps> = ({
    title,
    attachedImages,
    onPickImage,
    onTakePicture,
    onDeleteImage
}) => {

    const handleRemoveImage = (uri: string) => {
        Alert.alert(
            "Remover Imagem",
            "Tem certeza que deseja remover esta imagem?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Remover", onPress: () => onDeleteImage(uri), style: "destructive" },
            ]
        );
    };

    const renderImageItem = ({ item }: { item: string }) => (
        <View style={styles.imageItemContainer}>
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveImage(item)}>
                <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
            <Image source={{ uri: item }} style={styles.styledImage} resizeMode="cover" />
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            {title && <Text style={styles.labelText}>{title}</Text>}

            <View style={styles.imgButtonsContainer}>
                <TouchableOpacity style={styles.button} onPress={onPickImage}>
                    <MaterialIcons name="photo-library" size={32} color="#333" />
                    <Text style={styles.buttonText}>Galeria</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onTakePicture}>
                    <MaterialIcons name="camera-alt" size={32} color="#333" />
                    <Text style={styles.buttonText}>Câmera</Text>
                </TouchableOpacity>
            </View>

            {attachedImages.length > 0 ? (
                <View style={styles.imagePreviewContainer}>
                    <Text style={styles.labelText}>Imagens Anexadas:</Text>
                    <FlatList
                        data={attachedImages}
                        renderItem={renderImageItem}
                        keyExtractor={(item) => item}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            ) : (
                <View style={styles.noImageTextContainer}>
                    <Text style={styles.noImageText}>Nenhuma imagem anexada</Text>
                </View>
            )}
        </View>
    );
};
