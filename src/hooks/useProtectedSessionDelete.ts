import { useState } from 'react';
import { Alert } from 'react-native';

import { Session } from '@/src/types/session';

interface UseProtectedSessionDeleteParams {
    sessions: Session[];
    deleteSession: (id: string) => Promise<void>;
}

export const useProtectedSessionDelete = ({
    sessions,
    deleteSession,
}: UseProtectedSessionDeleteParams) => {
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const confirmDelete = () => {
        if (!pendingDeleteId) {
            return;
        }

        deleteSession(pendingDeleteId);
        setPendingDeleteId(null);
    };

    const cancelDelete = () => {
        setPasswordModalVisible(false);
        setPendingDeleteId(null);
    };

    const requestDelete = (id: string) => {
        const session = sessions.find((item) => item.id === id);
        const requiresPassword = session?.status === 'estoque'
            || session?.status === 'finalizada';

        if (requiresPassword) {
            setPendingDeleteId(id);
            setPasswordModalVisible(true);
            return;
        }

        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza que deseja deletar esta sessão? Esta ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar',
                    onPress: () => deleteSession(id),
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    return {
        passwordModalVisible,
        requestDelete,
        confirmDelete,
        cancelDelete,
    };
};
