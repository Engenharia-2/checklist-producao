import React, { FC } from 'react';
import { Alert, FlatList, Image, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { styles } from './style';
import { colors } from '../../../../theme/colors';
import { AttachedImage } from '../../../report/types';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

type ImageAttachmentProps = { 
  attachedImages: AttachedImage[];
  onPickImage: () => void;
  onTakePicture: () => void;
  onDeleteImage: (image: AttachedImage) => void;
};

const ImageAttachment: FC<ImageAttachmentProps> = ({ attachedImages, onPickImage, onTakePicture, onDeleteImage }) => {

  const handleRemoveImage = (image: AttachedImage) => {
    Alert.alert(
      "Remover Imagem",
      "Tem certeza que deseja remover esta imagem?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", onPress: () => onDeleteImage(image), style: "destructive" },
      ]
    );
  };

  const renderImageItem = ({ item }: { item: AttachedImage }) => {
    const isDeleting = item.status === 'deleting';
    const isUploading = item.status === 'uploading';
    const isUploaded = item.status === 'uploaded';
    const isError = item.status === 'error';

    return (
      <View key={item.id?.toString() || item.uri} style={[styles.imageItemContainer, isDeleting ? { opacity: 0.5 } : {}]}>
        <Image source={{ uri: item.uri }} style={styles.selectedImage} />
        
        {isUploading && (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="small" color={colors.surface} />
          </View>
        )}

        {isUploaded && (
          <View style={styles.statusIndicator}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          </View>
        )}

        {isError && (
          <View style={styles.statusIndicator}>
            <Ionicons name="alert-circle" size={20} color={colors.error} />
          </View>
        )}

        <TouchableOpacity 
          onPress={() => handleRemoveImage(item)} 
          style={styles.removeImageButton}
          disabled={isDeleting || isUploading}
        >
          <Text style={[styles.buttonText, styles.buttonTextRemove]}>X</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <View style={styles.imgButtonsContainer}>
        <TouchableOpacity onPress={onPickImage} style={[styles.button, styles.buttonImg]}>
          <Text style={styles.buttonText}>Imagem</Text>
          <MaterialIcons name="photo-library" size={40} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onTakePicture} style={[styles.button, styles.buttonImg]}>
          <Text style={styles.buttonText}>Foto</Text>
          <MaterialIcons name="camera-alt" size={40} color={colors.textSecondary}/>
        </TouchableOpacity>
      </View>
      {attachedImages.length > 0 ? (
        <View style={styles.imagePreviewContainer}>
          <Text style={styles.labelText}>Imagens Anexadas:</Text>
          <FlatList
            data={attachedImages}
            renderItem={renderImageItem}
            keyExtractor={(item) => `${item.id || item.uri}`}
            horizontal={false} 
            numColumns={2} 
            scrollEnabled={false} // FlatList nested in ScrollView
            contentContainerStyle={styles.flatListContent}
          />
        </View>
      ) : null}
    </>
  );
};

export default ImageAttachment;
