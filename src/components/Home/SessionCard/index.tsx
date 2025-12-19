import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Session } from '../../../types/session';
import { styles } from './style';

interface SessionCardProps {
    session: Session;
    onPress: (id: string) => void;
    onDelete: (id: string) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onPress, onDelete }) => {
    const formattedDate = new Date(session.startDate).toLocaleString('pt-BR');

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(session.id)}>
            <View style={styles.content}>
                <Text style={styles.clientName}>{session.osNumber || 'Inspeção sem OP'}</Text>
                <Text style={styles.dateText}>Iniciada em: {formattedDate}</Text>
                {session.endDate && (
                    <Text style={styles.dateText}>Finalizada em: {new Date(session.endDate).toLocaleString('pt-BR')}</Text>
                )}
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(session.id)}>
                <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};
