import React from 'react';
import { ScrollView } from 'react-native';
import { useImageManager } from '../../../hooks/useImageManager';
import { CameraModal } from '../../Camera/';
import { ImageAttachment } from '../../Image/ImageAttachment';
import { styles } from '../styles';

interface StepProps {
    sessionId: string;
}

export const ImageStep: React.FC<StepProps> = ({ sessionId }) => {
    const {
        images,
        isCameraVisible,
        pickImage,
        processImage,
        handleDeleteImage,
        handleTakePicture,
        closeCamera,
    } = useImageManager(sessionId, 'surge4kv_ident_prints');

    return (
        <ScrollView style={styles.container}>
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
