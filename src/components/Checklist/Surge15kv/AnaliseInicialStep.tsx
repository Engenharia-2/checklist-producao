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

export const AnaliseInicialStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const { handleChange } = useChecklistItem(sessionId);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomTitle title="Análise Inicial" />

            <CustomInput
                label="Modelo do equipamento: 4kV ou 15kV?"
                value={checklist['surge15kv_analise_modelo_kv'] || ''}
                onChangeText={(text) => handleChange('surge15kv_analise_modelo_kv', text)}
            />
            <CustomInput
                label="Modelo do equipamento: bancada ou maleta?"
                value={checklist['surge15kv_analise_modelo_tipo'] || ''}
                onChangeText={(text) => handleChange('surge15kv_analise_modelo_tipo', text)}
            />
            <CustomInput
                label="Modelo/tipo do computador"
                value={checklist['surge15kv_analise_modelo_pc'] || ''}
                onChangeText={(text) => handleChange('surge15kv_analise_modelo_pc', text)}
            />
            <CustomInput
                label="Modelo do osciloscópio"
                value={checklist['surge15kv_analise_modelo_osc'] || ''}
                onChangeText={(text) => handleChange('surge15kv_analise_modelo_osc', text)}
            />
            <CustomInput
                label="Modelo da tela"
                value={checklist['surge15kv_analise_modelo_tela'] || ''}
                onChangeText={(text) => handleChange('surge15kv_analise_modelo_tela', text)}
            />
            <CustomInput
                label="Número do computador (ao abrir o software)"
                value={checklist['surge15kv_analise_num_pc'] || ''}
                onChangeText={(text) => handleChange('surge15kv_analise_num_pc', text)}
            />
            <CustomInput
                label="Nome da versão de software do surge"
                value={checklist['surge15kv_analise_versao_software'] || ''}
                onChangeText={(text) => handleChange('surge15kv_analise_versao_software', text)}
            />
            <CustomInput
                label="Data da versão de software do surge"
                value={checklist['surge15kv_analise_data_software'] || ''}
                onChangeText={(text) => handleChange('surge15kv_analise_data_software', text)}
                placeholder="DD/MM/AAAA"
            />
            <CustomInput
                label="Licenciar Windows. Número"
                value={checklist['surge15kv_analise_licenca_num'] || ''}
                onChangeText={(text) => handleChange('surge15kv_analise_licenca_num', text)}
            />
            <CustomInput
                label="Licenciar Windows. Versão (HOME/PRO)"
                value={checklist['surge15kv_analise_licenca_versao'] || ''}
                onChangeText={(text) => handleChange('surge15kv_analise_licenca_versao', text)}
            />
        </ScrollView>
    );
};