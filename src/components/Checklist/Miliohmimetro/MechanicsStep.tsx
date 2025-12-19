import React from 'react';
import { ScrollView } from 'react-native';
import { useSessionStore } from '../../../store/sessionStore';
import CustomTitle from '../../ui/Title/CustomTitle'; // Correct import now
import { ChecklistItem } from '../ChecklistItem';
import { styles } from '../styles';
import { useChecklistItem } from '../../../hooks/useChecklistItem';

interface StepProps {
    sessionId: string;
}

export const MechanicsStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const { handleChange } = useChecklistItem(sessionId);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomTitle title="Montagem (Mecânica)" />

            <ChecklistItem
                id="mech_screws_tight"
                label="Verificar se todos os parafusos da mecânica estão apertados"
                isChecked={checklist['mech_screws_tight'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mech_grounding_screw"
                label="Verificar se o parafuso do aterramento esta apertado"
                isChecked={checklist['mech_grounding_screw'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mech_membrane_check"
                label="Verificar membrana na maleta interna, externa e na tela"
                isChecked={checklist['mech_membrane_check'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mech_cable_organization"
                label="Verificar organização interna dos cabos com abraçadeiras ou Termo-encolhíveis"
                isChecked={checklist['mech_cable_organization'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mech_glue_connectors"
                label="Passar cola quente em todos os cabos com conexão KK, nos parafusos da placa e parafusos das entradas de medição."
                isChecked={checklist['mech_glue_connectors'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mech_foam_sides"
                label="Colar espuma nas laterais da maleta (10mm de altura)"
                isChecked={checklist['mech_foam_sides'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
        </ScrollView>
    );
};
