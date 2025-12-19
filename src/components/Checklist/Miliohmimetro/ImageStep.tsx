import React from 'react';
import { ScrollView } from 'react-native';
import { useImageManager } from '../../../hooks/useImageManager';
import { CameraModal } from '../../Camera/';
import { ImageAttachment } from '../../Image/ImageAttachment';
import { CustomTitle } from '../../ui/Title/CustomTitle';
import { styles } from '../styles';

interface ImageStepProps {
    sessionId: string;
}

export const ImageStep: React.FC<ImageStepProps> = ({ sessionId }) => {
    const {
        images,
        isCameraVisible,
        pickImage,
        processImage,
        handleDeleteImage,
        handleTakePicture,
        closeCamera,
    } = useImageManager(sessionId, 'images');

    return (
        <ScrollView style={styles.container}>
            <CustomTitle title="Anexo de Imagens" />
            <ImageAttachment
                attachedImages={images}
                onPickImage={pickImage}
                onTakePicture={handleTakePicture}
                onDeleteImage={handleDeleteImage}
            />
            <CameraModal
                isVisible={isCameraVisible}
                onClose={closeCamera}
                onPictureTaken={(photo) => {
                    processImage(photo.uri);
                    closeCamera();
                }}
            />
        </ScrollView>
    );
};
