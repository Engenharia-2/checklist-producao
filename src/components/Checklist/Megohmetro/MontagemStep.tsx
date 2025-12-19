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

export const MontagemStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const { handleChange } = useChecklistItem(sessionId);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomTitle title="Montagem" />

            <ChecklistItem
                id="mega_montagem_parafusos"
                label="Verificar se todos os parafusos da mecânica estão apertados"
                isChecked={checklist['mega_montagem_parafusos'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mega_montagem_parafuso_terra"
                label="Verificar se o parafuso do aterramento esta apertado"
                isChecked={checklist['mega_montagem_parafuso_terra'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mega_montagem_membrana"
                label="Verificar membrana na maleta interna, externa e na tela"
                isChecked={checklist['mega_montagem_membrana'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mega_montagem_organizacao_cabos"
                label="Verificar organização interna dos cabos com abraçadeiras ou Termo-encolhíveis"
                isChecked={checklist['mega_montagem_organizacao_cabos'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mega_montagem_cola_quente"
                label="Passar cola quente em todos os cabos com conexão KK, nos parafusos da placa e parafusos das entradas de medição."
                isChecked={checklist['mega_montagem_cola_quente'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mega_montagem_espuma"
                label="Colar espuma nas laterais da maleta (10mm de altura)"
                isChecked={checklist['mega_montagem_espuma'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
        </ScrollView>
    );
};
