import { Alert, Linking } from 'react-native';
import { Camera } from 'expo-camera';

export const usePermissions = () => {
  const requestCameraPermission = async (): Promise<boolean> => {
    const { status } = await Camera.getCameraPermissionsAsync();

    if (status === 'granted') {
      return true;
    }

    if (status === 'undetermined') {
      const { status: newStatus } = await Camera.requestCameraPermissionsAsync();
      if (newStatus === 'granted') {
        return true;
      }
    }

    // If status is 'denied' or request was denied
    Alert.alert(
      'Permissão Necessária',
      'O acesso à câmera foi negado. Para tirar fotos, por favor, habilite a permissão nas configurações do seu dispositivo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir Configurações', onPress: () => Linking.openSettings() },
      ]
    );
    return false;
  };

  return { requestCameraPermission };
};
