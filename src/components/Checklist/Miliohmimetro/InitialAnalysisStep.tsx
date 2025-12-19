import React from 'react';
import { ScrollView } from 'react-native';
import { useSessionStore } from '../../../store/sessionStore';
import CustomInput from '../../ui/Input/CustomInput';
import { ChecklistItem } from '../ChecklistItem';
import { styles } from '../styles';
import { useChecklistItem } from '../../../hooks/useChecklistItem';

interface StepProps {
    sessionId: string;
}

export const InitialAnalysisStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const { handleChange } = useChecklistItem(sessionId);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* ANÁLISE INICIAL (MILIOHMÍMETRO) */}
            <CustomInput
                label="Modelo do equipamento (bancada, maleta)?"
                value={checklist['initial_equip_model'] || ''}
                onChangeText={(text) => handleChange('initial_equip_model', text)}
                placeholder="Ex: Bancada"
            />
            <CustomInput
                label="Modelo/tipo do computador"
                value={checklist['initial_pc_model'] || ''}
                onChangeText={(text) => handleChange('initial_pc_model', text)}
                placeholder="Ex: Dell Optiplex"
            />
            <CustomInput
                label="Modelo da tela"
                value={checklist['initial_screen_model'] || ''}
                onChangeText={(text) => handleChange('initial_screen_model', text)}
                placeholder="Ex: Samsung 24"
            />
            <CustomInput
                label="Versão do software"
                value={checklist['initial_software_version'] || ''}
                onChangeText={(text) => handleChange('initial_software_version', text)}
                placeholder="Ex: 1.0.0"
            />
            <CustomInput
                label="Data da calibração"
                value={checklist['initial_calib_date'] || ''}
                onChangeText={(text) => handleChange('initial_calib_date', text)}
                placeholder="DD/MM/AAAA"
            />
            <CustomInput
                label="Validade da Calibração"
                value={checklist['initial_calib_validity'] || ''}
                onChangeText={(text) => handleChange('initial_calib_validity', text)}
                placeholder="DD/MM/AAAA"
            />
             <ChecklistItem
                id="initial_pcb_revision"
                label="Revisão da placa de circuito impresso"
                isChecked={checklist['initial_pcb_revision'] || false}
                onToggle={handleChange}
            />
        </ScrollView>
    );
};
