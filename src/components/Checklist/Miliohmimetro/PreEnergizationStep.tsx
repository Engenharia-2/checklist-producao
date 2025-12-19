import React from 'react';
import { ScrollView } from 'react-native';
import { useSessionStore } from '../../../store/sessionStore';
import CustomTitle from '../../ui/Title/CustomTitle';
import { ChecklistItem } from '../ChecklistItem';
import { styles } from '../styles';
import { useChecklistItem } from '../../../hooks/useChecklistItem';

interface StepProps {
    sessionId: string;
}

export const PreEnergizationStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const { handleChange } = useChecklistItem(sessionId);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomTitle title="Pré-Energização" />

            <ChecklistItem
                id="pre_verify_connections"
                label="Verificar conexões das fontes e da placa, desconectar USB's da placa e cabo fita, conectar apenas depois de energizar a primeira vez"
                isChecked={checklist['pre_verify_connections'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="pre_attach_serial"
                label="Anexar número de série do produto ao número de série da placa na planilha de assistência de placa"
                isChecked={checklist['pre_attach_serial'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
        </ScrollView>
    );
};
