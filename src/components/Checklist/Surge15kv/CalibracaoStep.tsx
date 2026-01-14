import React from 'react';
import { ScrollView } from 'react-native';
import { useSessionStore } from '../../../store/sessionStore';
import CustomInput from '../../ui/Input/CustomInput';
import CustomTitle from '../../ui/Title/CustomTitle';
import { ChecklistItem } from '../ChecklistItem';
import { styles } from '../styles';
import { useChecklistItem } from '../../../hooks/useChecklistItem';

interface StepProps {
    sessionId: string;
}

export const CalibracaoStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const { handleChange } = useChecklistItem(sessionId);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomTitle title="Calibração" />
            <CustomInput
                label="Número da calibração (fornecido pelo laboratório)"
                value={checklist['surge15kv_calib_num_calibracao'] || ''}
                onChangeText={(text) => handleChange('surge15kv_calib_num_calibracao', text)}
            />
            <ChecklistItem
                id="surge15kv_calib_hantek"
                label="Abrir software da HANTEK e realizar a calibração do CH1. Essa calibração é responsável para deixar a linha do gráfico mais próximo o possível do ponto zero."
                isChecked={checklist['surge15kv_calib_hantek'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge15kv_calib_dc"
                label="Executar calibração da tensão DC de saída (com ax=1 e b=0 no software). NÃO RECALIBRAR se for conserto."
                isChecked={checklist['surge15kv_calib_dc'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            </ScrollView>
    );
};
