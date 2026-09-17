import React, { FC, useState } from 'react';
import { Alert, FlatList, Image, Text, TouchableOpacity, View, ActivityIndicator, useWindowDimensions, Modal } from 'react-native';
import PagerView from 'react-native-pager-view';
import { styles } from './style';
import { colors } from '../../../../theme/colors';
import { AttachedImage } from '../../../report/types';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

type ImageAttachmentProps = { 
  attachedImages: AttachedImage[];
  onPickImage: () => void;
  onTakePicture: () => void;
  onDeleteImage: (image: AttachedImage) => void;
  editable?: boolean;
};

const ImageAttachment: FC<ImageAttachmentProps> = ({ attachedImages, onPickImage, onTakePicture, onDeleteImage, editable = true }) => {
  const { width } = useWindowDimensions();
  const numColumns = width > 600 ? 3 : 2;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);

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

  const renderImageItem = ({ item, index }: { item: AttachedImage, index: number }) => {
    const isDeleting = item.status === 'deleting';
    const isUploading = item.status === 'uploading';
    const isUploaded = item.status === 'uploaded';
    const isError = item.status === 'error';

    return (
      <View key={item.id?.toString() || item.uri} style={[styles.imageItemContainer, isDeleting ? { opacity: 0.5 } : {}]}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => { setSelectedIndex(index); setCurrentPage(index + 1); }} disabled={isDeleting || isUploading}>
          <Image source={{ uri: item.uri }} style={styles.selectedImage} />
        </TouchableOpacity>
        
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

        {editable && (
          <TouchableOpacity 
            onPress={() => handleRemoveImage(item)} 
            style={styles.removeImageButton}
            disabled={isDeleting || isUploading}
          >
            <Text style={[styles.buttonText, styles.buttonTextRemove]}>X</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <>
      {editable && (
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
      )}
      {attachedImages.length > 0 ? (
        <View style={styles.imagePreviewContainer}>
          <Text style={styles.labelText}>Imagens Anexadas:</Text>
          <FlatList
            key={`grid-${numColumns}`}
            data={attachedImages}
            renderItem={renderImageItem}
            keyExtractor={(item) => `${item.id || item.uri}`}
            horizontal={false} 
            numColumns={numColumns} 
            scrollEnabled={false} // FlatList nested in ScrollView
            contentContainerStyle={styles.flatListContent}
          />
        </View>
      ) : null}

      <Modal visible={selectedIndex !== null} transparent={true} onRequestClose={() => setSelectedIndex(null)} animationType="fade">
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.closeModalButton} onPress={() => setSelectedIndex(null)}>
            <Ionicons name="close-circle" size={40} color="#fff" />
          </TouchableOpacity>
          {selectedIndex !== null && (
            <>
              <Text style={styles.pageIndicator}>
                {currentPage} / {attachedImages.length}
              </Text>
              <PagerView 
                style={styles.pagerView} 
                initialPage={selectedIndex}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position + 1)}
              >
                {attachedImages.map((img, i) => (
                  <View key={i.toString()} style={styles.page}>
                    <Image source={{ uri: img.uri }} style={styles.fullScreenImage} resizeMode="contain" />
                  </View>
                ))}
              </PagerView>
            </>
          )}
        </View>
      </Modal>
    </>
  );
};

export default ImageAttachment;
