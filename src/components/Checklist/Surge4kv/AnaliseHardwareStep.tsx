import React from 'react';
import { ScrollView } from 'react-native';
import { useSessionStore } from '../../../store/sessionStore';
import CustomInput from '../../ui/Input/CustomInput';
import CustomTitle from '../../ui/Title/CustomTitle';
import { ChecklistItem } from '../ChecklistItem';
import { styles } from '../styles';

interface StepProps {
    sessionId: string;
}

export const AnaliseHardwareStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions, updateChecklistItem } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const handleChange = (key: string, value: boolean | string) => {
        updateChecklistItem(sessionId, { [key]: value });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomTitle title="Análise Inicial - Hardware" />

            <ChecklistItem
                id="surge4kv_hw_aterramento"
                label="Verificar pontos de aterramento da carcaça e componentes. Negativo das fontes deve ser aterrado. Negativos das saídas (garras pretas) deve ser aterrado."
                isChecked={checklist['surge4kv_hw_aterramento'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_hw_conectores"
                label="Posição de conectores USB, RJ45 – conforme impresso na Membrana"
                isChecked={checklist['surge4kv_hw_conectores'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_hw_arruelas"
                label="Arruelas de pressão em todos os parafusos"
                isChecked={checklist['surge4kv_hw_arruelas'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_hw_parafuso_terra"
                label="Verificar aperto do parafuso TERRA do equipamento"
                isChecked={checklist['surge4kv_hw_parafuso_terra'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />

            <CustomInput
                label="Numero de série placa principal"
                value={checklist['surge4kv_hw_serial_principal'] || ''}
                onChangeText={(text) => handleChange('surge4kv_hw_serial_principal', text)}
            />
            <CustomInput
                label="Numero de série placa de disparo"
                value={checklist['surge4kv_hw_serial_disparo'] || ''}
                onChangeText={(text) => handleChange('surge4kv_hw_serial_disparo', text)}
            />
            <CustomInput
                label="Numero de série fonte"
                value={checklist['surge4kv_hw_serial_fonte'] || ''}
                onChangeText={(text) => handleChange('surge4kv_hw_serial_fonte', text)}
            />
            <CustomInput
                label="Numero de série placa de relés"
                value={checklist['surge4kv_hw_serial_reles'] || ''}
                onChangeText={(text) => handleChange('surge4kv_hw_serial_reles', text)}
            />
        </ScrollView>
    );
};
