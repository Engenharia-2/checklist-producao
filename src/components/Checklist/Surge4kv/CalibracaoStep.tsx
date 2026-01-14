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

            <ChecklistItem
                id="surge4kv_calib_hantek"
                label="Abrir software da HANTEK e realizar a calibração do CH1. Essa calibração é responsável para deixar a linha do gráfico mais Próximo o possível do ponto zero."
                isChecked={checklist['surge4kv_calib_hantek'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_calib_dc"
                label="Executar calibração da tensão DC de saída (com ax=1 e b=0 no Software). NÃO RECALIBRAR se for conserto."
                isChecked={checklist['surge4kv_calib_dc'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />

            <CustomInput
                label="Número da calibração (fornecido pelo laboratório)"
                value={checklist['surge4kv_calib_num_calibracao'] || ''}
                onChangeText={(text) => handleChange('surge4kv_calib_num_calibracao', text)}
            />

            <ChecklistItem
                id="surge4kv_calib_bobina"
                label="Finalizar calibração com bobina/surto: multiplicador de surto e zeramento de 400, 800, 1600, 3900V"
                isChecked={checklist['surge4kv_calib_bobina'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_calib_reles"
                label="Testar funcionalidade de todos os 12 relês (contra todos). Realizar com apenas 2 cabos (1 bobina) conectados por vez."
                isChecked={checklist['surge4kv_calib_reles'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_calib_testes"
                label="Fazer testes 1-2, 2-3, 3-1 e 1-4, 2-5, 3-6"
                isChecked={checklist['surge4kv_calib_testes'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_calib_profile"
                label="Copiar arquivo padrão de cadastros (profile.3DB) para a pasta do Surge. Testar com bobina 6 cabos, motor 3 cabos, etc. NÃO MEXER se for conserto."
                isChecked={checklist['surge4kv_calib_profile'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
        </ScrollView>
    );
};
