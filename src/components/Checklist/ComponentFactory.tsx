import React from 'react';
import { View, Text } from 'react-native';
import { CustomInput } from '../../components/ui/Input/CustomInput';
import { CustomDropdown } from '../../components/ui/Dropdown';
import { CustomCheckbox } from '../../components/ui/Checkbox';
import ImageAttachment from '../../components/Image/ImageAttachment';
import { useImageManager } from '../../hooks/useImageManager';
import { CameraModal } from '../../components/Camera';
import { styles } from '../../pages/Checklist/styles';
import { CalibrationTableField } from '../../components/ui/Table';
import { SignatureField } from '../SignatureField';
import { QRVerificationField } from '../QRVerificationField';

const DynamicImageField = ({ 
    field, 
    sessionId, 
    editable = true 
}: { 
    field: any; 
    sessionId: string; 
    editable?: boolean; 
}) => {
    const {
        attachedImages,
        isCameraVisible,
        pickImage,
        handleDeleteImage,
        handleTakePicture,
        closeCamera,
        processImages
    } = useImageManager(sessionId, field.id);

    return (
        <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.label}</Text>
            <ImageAttachment
                attachedImages={attachedImages}
                onPickImage={pickImage}
                onTakePicture={handleTakePicture}
                onDeleteImage={(img) => handleDeleteImage(img.uri)}
                editable={editable}
            />
            <CameraModal
                isVisible={isCameraVisible}
                onClose={closeCamera}
                onPictureTaken={(photo) => processImages([photo.uri])}
            />
        </View>
    );
};

interface ComponentFactoryProps {
    field: any;
    value: any;
    sessionId: string;
    onFieldChange: (fieldId: string, value: any) => void;
    editable?: boolean;
}

export const ComponentFactory: React.FC<ComponentFactoryProps> = ({ 
    field, 
    value, 
    sessionId, 
    onFieldChange,
    editable = true
}) => {
    switch (field.type) {
        case 'title':
            return (
                <Text key={field.id} style={styles.titleText}>
                    {field.label}
                </Text>
            );

        case 'text':
            return (
                <Text key={field.id} style={styles.bodyText}>
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
                        editable={editable}
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
                        disabled={!editable}
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
                    disabled={!editable}
                />
            );

        case 'image':
            return (
                <DynamicImageField 
                    key={field.id} 
                    field={field} 
                    sessionId={sessionId} 
                    editable={editable} 
                />
            );

        case 'calibration_table':
            return (
                <CalibrationTableField 
                    key={field.id} 
                    field={field} 
                    value={value} 
                    onFieldChange={onFieldChange} 
                    editable={editable}
                />
            );

        case 'signature':
            return (
                <SignatureField
                    key={field.id}
                    field={field}
                    value={value || null}
                    onFieldChange={onFieldChange}
                    editable={editable}
                />
            );

        case 'qr_verification':
            return (
                <QRVerificationField
                    key={field.id}
                    field={field}
                    value={value || null}
                    onFieldChange={onFieldChange}
                    editable={editable}
                />
            );

        default:
            return (
                <Text key={field.id} style={{ color: 'red' }}>
                    Componente {field.type} não suportado.
                </Text>
            );
    }
};

export default ComponentFactory;
