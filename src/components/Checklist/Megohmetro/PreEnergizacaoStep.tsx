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

export const PreEnergizacaoStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const { handleChange } = useChecklistItem(sessionId);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomTitle title="Pré-Energização" />

            <CustomInput
                label="Número de série da placa principal"
                value={checklist['mega_pre_serial_placa_principal'] || ''}
                onChangeText={(text) => handleChange('mega_pre_serial_placa_principal', text)}
                placeholder="Número de série"
            />
            <CustomInput
                label="Número de série da placa Painel frontal"
                value={checklist['mega_pre_serial_placa_frontal'] || ''}
                onChangeText={(text) => handleChange('mega_pre_serial_placa_frontal', text)}
                placeholder="Número de série"
            />

            <ChecklistItem
                id="mega_pre_conexoes_fonte"
                label="Verificar conexões da fonte e da placa"
                isChecked={checklist['mega_pre_conexoes_fonte'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mega_pre_contato_garras"
                label="Verificar contato das garras, medir resistência e avaliar variação Da resistência, deve ser menor que 5%"
                isChecked={checklist['mega_pre_contato_garras'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
        </ScrollView>
    );
};