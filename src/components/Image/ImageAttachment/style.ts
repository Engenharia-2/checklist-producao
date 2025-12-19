import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    imgButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#ffffff',
        width: '48%',
        height: 100,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 15,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        gap: 8,
    },
    buttonText: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 16,
    },
    imagePreviewContainer: {
        width: '100%',
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: 4,
    },
    labelText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    imageItemContainer: {
        marginBottom: 16,
        alignItems: 'center',
        position: 'relative',
    },
    styledImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    removeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#ff4d4d',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        elevation: 5,
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    noImageTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noImageText: {
        color: '#999'
    }
});
