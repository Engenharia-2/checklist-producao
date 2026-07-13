import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Session } from '../../../types/session';
import { styles } from './style';

interface SessionCardProps {
    session: Session;
    onPress: (id: string) => void;
    onDelete: (id: string) => void;
}

const getLastFilledStep = (session: Session): string | null => {
    const steps = (session as any)?.formDefinition?.schema?.steps || [];
    const answers = (session as any)?.answers || {};
    
    let lastStepName: string | null = null;

    for (const step of steps) {
        const inputFields = step.fields?.filter((f: any) => f.type !== 'title') || [];
        
        // Se pelo menos um campo desta etapa tiver resposta
        const hasAnswers = inputFields.some((field: any) => {
            const val = answers[field.id];
            if (field.type === 'image') return Array.isArray(val) && val.length > 0;
            if (field.type === 'checkbox') return val === true;
            return val !== undefined && val !== null && val !== '';
        });

        if (hasAnswers) {
            lastStepName = step.title;
        }
    }

    return lastStepName;
};

export const SessionCard: React.FC<SessionCardProps> = ({ session, onPress, onDelete }) => {
    const formattedDate = new Date(session.startDate).toLocaleString('pt-BR');
    const lastFilledStep = getLastFilledStep(session);

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(session.id)}>
            <View style={styles.content}>
                <Text style={styles.clientName}>{session.osNumber || 'Inspeção sem OP'}</Text>
                <Text style={styles.dateText}>Iniciada em: {formattedDate}</Text>
                
                <Text style={styles.lastStepText}>
                    Etapa atual: {lastFilledStep || 'Nenhuma etapa iniciada'}
                </Text>

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

export default SessionCard;
