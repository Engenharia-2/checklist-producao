import React from 'react';
import { View, Text } from 'react-native';
import { CustomInput } from '../../components/ui/Input/CustomInput';
import { CustomDropdown } from '../../components/ui/Select/CustomDropdown';
import { CustomCheckbox } from '../../components/ui/Checkbox/CustomCheckbox';
import ImageAttachment from '../../components/Image/ImageAttachment';
import { useImageManager } from '../../hooks/useImageManager';
import { CameraModal } from '../../components/Camera';
import { styles } from '../../pages/Checklist/styles';

const DynamicImageField = ({ field, sessionId }: { field: any, sessionId: string }) => {
    const {
        images,
        isCameraVisible,
        pickImage,
        handleDeleteImage,
        handleTakePicture,
        closeCamera,
        processImage
    } = useImageManager(sessionId, field.id);

    const attachedImages = images.map(uri => ({ uri }));

    return (
        <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.label}</Text>
            <ImageAttachment
                attachedImages={attachedImages}
                onPickImage={pickImage}
                onTakePicture={handleTakePicture}
                onDeleteImage={(img) => handleDeleteImage(img.uri)}
            />
            <CameraModal
                isVisible={isCameraVisible}
                onClose={closeCamera}
                onPictureTaken={(photo) => processImage(photo.uri)}
            />
        </View>
    );
};

interface ComponentFactoryProps {
    field: any;
    value: any;
    sessionId: string;
    onFieldChange: (fieldId: string, value: any) => void;
}

export const ComponentFactory: React.FC<ComponentFactoryProps> = ({ 
    field, 
    value, 
    sessionId, 
    onFieldChange 
}) => {
    switch (field.type) {
        case 'title':
            return (
                <Text key={field.id} style={styles.titleText}>
                    {field.label}
                </Text>
            );

        case 'input':
            return (
                <View key={field.id} style={styles.fieldContainer}>
                    <Text style={styles.label}>{field.label}</Text>
                    <CustomInput
                        placeholder={field.placeholder || ''}
                        value={value || ''}
                        onChangeText={(text) => onFieldChange(field.id, text)}
                        label={field.label}
                    />
                </View>
            );

        case 'dropdown':
            const optionsArray = field.options 
                ? field.options.split(',').map((o: string) => {
                    const name = o.trim();
                    return { id: name, name };
                }) 
                : [];
            
            return (
                <View key={field.id} style={styles.fieldContainer}>
                    <CustomDropdown
                        label={field.label}
                        value={value || ''}
                        placeholder={field.placeholder || 'Selecione uma opção'}
                        options={optionsArray} 
                        onSelect={(_, name) => onFieldChange(field.id, name)}
                    />
                </View>
            );

        case 'checkbox':
            return (
                <CustomCheckbox
                    key={field.id}
                    label={field.label}
                    value={!!value}
                    onValueChange={(newValue) => onFieldChange(field.id, newValue)}
                    explanation={field.explanation}
                />
            );

        case 'image':
            return <DynamicImageField key={field.id} field={field} sessionId={sessionId} />;

        default:
            return (
                <Text key={field.id} style={{ color: 'red' }}>
                    Componente {field.type} não suportado.
                </Text>
            );
    }
};
