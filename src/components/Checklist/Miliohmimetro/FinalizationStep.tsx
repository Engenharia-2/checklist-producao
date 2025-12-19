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

export const FinalizationStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const { handleChange } = useChecklistItem(sessionId);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomTitle title="Finalização" />

            <ChecklistItem
                id="final_glue_usb"
                label="Após todos os testes, passar cola quente nas entradas USB's e HDMI"
                isChecked={checklist['final_glue_usb'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="final_serial_manual"
                label="Colar número de série no manual"
                isChecked={checklist['final_serial_manual'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="final_foam_walls"
                label="Colar espuma nas paredes da maleta"
                isChecked={checklist['final_foam_walls'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="final_vibration_test"
                label="Executar teste de vibração de 1Hz até 10Hz durante 10 minutos"
                isChecked={checklist['final_vibration_test'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="final_test_scales_post_vib"
                label="Testar todas as escalas após a vibração"
                isChecked={checklist['final_test_scales_post_vib'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />

            <ChecklistItem
                id="final_copy_calibration"
                label='Copiar os valores da calibração para um pendrive atráves do botão "Salvar" na tela de "Valores Calibrados", e salvar esse arquivo na pasta de "Gestão de qualidade"'
                isChecked={checklist['final_copy_calibration'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="final_copy_alldata"
                label="Copiar o arquivo ALLDATA do pendrive para a pasta de GESTÃO DA QUALIDADE do equipamento."
                isChecked={checklist['final_copy_alldata'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
        </ScrollView>
    );
};
