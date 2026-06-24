import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    titleText: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 5,
    },
    fieldContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 8,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 5,
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    footer: {
        marginTop: 30,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    errorText: {
        fontSize: 16,
        color: '#ff4d4f',
        textAlign: 'center',
        marginBottom: 20,
    }
});
