import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { Session } from '../../../types/session';
import { SessionCard } from '../SessionCard';
import { styles } from './style';

interface SessionListProps {
    sessions: Session[];
    onSelectSession: (id: string) => void;
    onDeleteSession: (id: string) => void;
}

export const SessionList: React.FC<SessionListProps> = ({ sessions, onSelectSession, onDeleteSession }) => {
    if (sessions.length === 0) {
        return (
            <View style={styles.listContainer}>
                <Text style={styles.emptyText}>Nenhuma inspeção encontrada.</Text>
            </View>
        );
    }

    return (
        <View style={styles.listContainer}>
            <FlatList
                data={sessions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <SessionCard
                        session={item}
                        onPress={onSelectSession}
                        onDelete={onDeleteSession}
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};
