import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        paddingTop: 16,
        marginBottom: 16,
        color: '#555',
        fontSize: 24,
        fontWeight: 'bold',
    },
    pendingText: {
        marginBottom: 16,
        color: '#666',
        fontSize: 15,
        textAlign: 'center',
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderRadius: 8,
    },
    statusCardSuccess: {
        borderColor: '#b7eb8f',
        backgroundColor: '#f6ffed',
    },
    statusCardError: {
        borderColor: '#ffa39e',
        backgroundColor: '#fff1f0',
    },
    statusTextContainer: {
        flex: 1,
    },
    successText: {
        flex: 1,
        color: '#237804',
        fontSize: 15,
        fontWeight: 'bold',
    },
    errorTitle: {
        marginBottom: 4,
        color: '#cf1322',
        fontSize: 15,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#a8071a',
        fontSize: 14,
        lineHeight: 20,
    },
});
