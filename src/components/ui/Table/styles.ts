import { StyleSheet } from 'react-native';

export const localStyles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        marginBottom: 5,
    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        color: '#666',
        textAlign: 'center',
    },
    deleteIconSpace: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    inputWrapper: {
        flex: 1,
        paddingHorizontal: 1,
    },
    deleteBtn: {
        backgroundColor: '#ff4d4f',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    actions: {
        marginTop: 10,
        alignItems: 'flex-start',
    },
    addButtonWrapper: {
        width: 100,
    },
    resultsContainer: {
        marginTop: 15,
        padding: 15,
        backgroundColor: '#e6f7ff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#91d5ff',
    },
    resultText: {
        fontSize: 16,
        color: '#0050b3',
        marginBottom: 5,
    },
    bold: {
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ff4d4f',
        fontSize: 14,
        fontStyle: 'italic',
    },
    chartContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
