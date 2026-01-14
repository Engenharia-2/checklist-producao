import React from 'react';
import { ScrollView } from 'react-native';
import { useSessionStore } from '../../../store/sessionStore';
import CustomInput from '../../ui/Input/CustomInput';
import CustomTitle from '../../ui/Title/CustomTitle';
import { styles } from '../styles';
import { useChecklistItem } from '../../../hooks/useChecklistItem';

interface StepProps {
    sessionId: string;
}

export const IdentificacaoStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const { handleChange } = useChecklistItem(sessionId);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomTitle title="Identificação Final" />

            <CustomInput
                label="Montador (nome)"
                value={checklist['surge4kv_ident_montador'] || ''}
                onChangeText={(text) => handleChange('surge4kv_ident_montador', text)}
                placeholder="Nome do montador"
            />
            <CustomInput
                label="Testador (nome)"
                value={checklist['surge4kv_ident_testador'] || ''}
                onChangeText={(text) => handleChange('surge4kv_ident_testador', text)}
                placeholder="Nome do testador"
            />
            <CustomInput
                label="Embalador/Finalizador (nome)"
                value={checklist['surge4kv_ident_embalador'] || ''}
                onChangeText={(text) => handleChange('surge4kv_ident_embalador', text)}
                placeholder="Nome do embalador/finalizador"
            />
            <CustomInput
                label="Observações finais relevantes"
                value={checklist['surge4kv_ident_obs'] || ''}
                onChangeText={(text) => handleChange('surge4kv_ident_obs', text)}
                placeholder="Observações..."
                multiline
                numberOfLines={3}
            />
        </ScrollView>
    );
};
