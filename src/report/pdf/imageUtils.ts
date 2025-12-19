import { Asset } from 'expo-asset';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const MAX_IMAGE_DIMENSION = 600;
const IMAGE_COMPRESSION_QUALITY = 0.7;

/**
 * Converts a local image URI to a Base64 string.
 * Resizes and compresses the image to optimize PDF size.
 * @param uri The local image file URI.
 * @returns The Base64 string of the image, or null on error.
 */
export const convertImageToBase64 = async (uri: string): Promise<string | null> => {
    if (!uri) {
        return null;
    }
    try {
        const manipulatedImage = await manipulateAsync(
            uri,
            [{ resize: { width: MAX_IMAGE_DIMENSION } }],
            {
                compress: IMAGE_COMPRESSION_QUALITY,
                format: SaveFormat.JPEG, // Force JPEG for consistency
                base64: true,
            }
        );

        if (!manipulatedImage.base64) {
            return null;
        }

        return `data:image/jpeg;base64,${manipulatedImage.base64}`;
    } catch (error) {
        console.error('ImageUtils: Error converting image to Base64:', error);
        return null;
    }
};

/**
 * Converts the app logo to a Base64 string.
 * @returns The Base64 string of the logo, or null on error.
 */
export const convertLogoToBase64 = async (): Promise<string | null> => {
    try {
        const asset = Asset.fromModule(require('../../../assets/images/logoCianoLHF.png'));
        await asset.downloadAsync(); // Ensure the asset is downloaded locally

        const manipulatedImage = await manipulateAsync(
            asset.localUri!,
            [], // No operations needed, just convert
            {
                compress: 1, // No compression for logo
                format: SaveFormat.PNG, // Keep PNG format for logo quality
                base64: true,
            }
        );

        if (!manipulatedImage.base64) {
            return null;
        }

        return `data:image/png;base64,${manipulatedImage.base64}`;
    } catch (error) {
        console.error('Error converting logo to base64:', error);
        return null;
    }
};
