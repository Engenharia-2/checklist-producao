import React from 'react';
import { ScrollView } from 'react-native';
import { useChecklistItem } from '../../../hooks/useChecklistItem';
import { useSessionStore } from '../../../store/sessionStore';
import CustomInput from '../../ui/Input/CustomInput';
import CustomTitle from '../../ui/Title/CustomTitle';
import { ChecklistItem } from '../ChecklistItem';
import { styles } from '../styles';

interface StepProps {
    sessionId: string;
}

export const IdentificationStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const { handleChange } = useChecklistItem(sessionId);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomTitle title="Identificação" />

            <CustomInput
                label="Número do Certificado de calibração"
                value={checklist['final_cert_number'] || ''}
                onChangeText={(text) => handleChange('final_cert_number', text)}
                placeholder="Número ou código"
            />

            <CustomInput
                label="Montador (nome)"
                value={checklist['final_montador'] || ''}
                onChangeText={(text) => handleChange('final_montador', text)}
                placeholder="Nome do montador"
            />
            <CustomInput
                label="Testador (nome)"
                value={checklist['final_testador'] || ''}
                onChangeText={(text) => handleChange('final_testador', text)}
                placeholder="Nome do testador"
            />
            <CustomInput
                label="Observações finais"
                value={checklist['final_obs'] || ''}
                onChangeText={(text) => handleChange('final_obs', text)}
                placeholder="Observações..."
                multiline
                numberOfLines={3}
            />

            <ChecklistItem
                id="final_verify_claws"
                label="Verificar contato das garras, medir resistência e avaliar variação da resistência, deve ser menor que 5%"
                isChecked={checklist['final_verify_claws'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="final_send_manual"
                label="Enviar manual impresso, certificado de calibração, cabos com garras e cabo de alimentação"
                isChecked={checklist['final_send_manual'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />

        </ScrollView>
    );
};
