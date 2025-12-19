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

export const EnergizationStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const { handleChange } = useChecklistItem(sessionId);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomTitle title="Energização" />

            <ChecklistItem
                id="energ_verify_voltage"
                label="Verificar a tensão da fonte 5V ANTES DE CALIBRAR, ajustar em 4.95V"
                isChecked={checklist['energ_verify_voltage'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="energ_test_touch"
                label="Testar touch screen da tela"
                isChecked={checklist['energ_test_touch'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="energ_test_usb_ethernet"
                label="Testar USB e Ethernet"
                isChecked={checklist['energ_test_usb_ethernet'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="energ_test_start_btn"
                label="Testar botão físico de “iniciar teste”"
                isChecked={checklist['energ_test_start_btn'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
        </ScrollView>
    );
};
