import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        width: '100%',
        marginTop: 16, // theme.spacing.md
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 32, // theme.spacing.xl
        fontSize: 16, // theme.typography.sizes.md
        color: '#666', // theme.colors.textSecondary
    },
});
