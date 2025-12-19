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

export const FinalizacaoStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const { handleChange } = useChecklistItem(sessionId);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomTitle title="Finalização" />

            <ChecklistItem
                id="mega_final_testes_proc"
                label="Executar testes conforme procedimento"
                isChecked={checklist['mega_final_testes_proc'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mega_final_cola_quente"
                label="Após todos os testes, passar cola quente nos pontos necessários"
                isChecked={checklist['mega_final_cola_quente'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mega_final_num_serie"
                label="Colar número de série no manual e maleta e bolsa dos cabos"
                isChecked={checklist['mega_final_num_serie'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mega_final_enviar_manual"
                label="Enviar manual impresso, certificado de calibração, cabos com Garras e cabo de alimentação"
                isChecked={checklist['mega_final_enviar_manual'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mega_final_teste_vibracao"
                label="Executar teste de vibração de 1Hz até 10Hz durante 10 minutos"
                isChecked={checklist['mega_final_teste_vibracao'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mega_final_teste_30min_5k"
                label="Após a vibração executar teste de 30min em 5K"
                isChecked={checklist['mega_final_teste_30min_5k'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mega_final_conexao_software"
                label="Fazer teste de conexão com o Software e gerar o relatório de Dados."
                isChecked={checklist['mega_final_conexao_software'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mega_final_lacre_foto"
                label="Fazer o lacre internamente, tirar foto e salvar na pasta do Megôhmetro"
                isChecked={checklist['mega_final_lacre_foto'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mega_final_calibracao_externa"
                label="Enviado para a calibração externa"
                isChecked={checklist['mega_final_calibracao_externa'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
        </ScrollView>
    );
};
