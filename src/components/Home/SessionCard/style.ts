import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
        padding: 0,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    clientName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333', // Assuming a default text color
    },
    dateText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
        borderRadius: 20,
        width: 33,
        height: 33,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    deleteButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
