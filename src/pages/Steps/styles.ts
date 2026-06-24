import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
        flexGrow: 1,
    },
    title: {
        display: 'none',
    },
    subtitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        paddingTop: 30,
        marginBottom: 30,
    },
    stepsList: {
        flex: 1,
    },
    stepCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        flex: 1,
        minHeight: 50,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        position: 'relative',
    },
    stepTitle: {
        fontSize: 20,
        color: '#333',
        fontWeight: '600',
        textAlign: 'center',
        paddingHorizontal: 30,
    },
    checkIcon: {
        position: 'absolute',
        left: 20,
    },
    statusIcon: {
        position: 'absolute',
        left: 20,
    },
    chevronIcon: {
        position: 'absolute',
        right: 20,
    },
    progressContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    progressText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 8,
        textAlign: 'center',
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: '#eee',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#076DF2', // theme.colors.primary
        borderRadius: 4,
    },
    footer: {
        marginTop: 'auto',
        paddingTop: 20,
    }
});
