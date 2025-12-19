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

export const SoftwareStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const { handleChange } = useChecklistItem(sessionId);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomTitle title="Software" />

            <ChecklistItem
                id="soft_update"
                label="Atualizar o software para a versão mais recente"
                isChecked={checklist['soft_update'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="soft_test_wifi"
                label="Testar a conexão do Wi-Fi"
                isChecked={checklist['soft_test_wifi'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="soft_verify_repeatability"
                label="Verificar repetibilidade das medições em todas as faixas"
                isChecked={checklist['soft_verify_repeatability'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="soft_exec_calibration"
                label="Executar calibração em todas as faixas de medição"
                isChecked={checklist['soft_exec_calibration'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="soft_copy_files"
                label="Colocar os arquivos do pendrive na pasta 'mohm-lhf/data', após a calibração"
                isChecked={checklist['soft_copy_files'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="soft_test_pdf"
                label="Testar a geração de relatório PDF para pendrive"
                isChecked={checklist['soft_test_pdf'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="soft_default_config"
                label="Deixar valores de configuração no padrão (temperatura de referência 25, numero aquisições 5, tempo estabilização 1)"
                isChecked={checklist['soft_default_config'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="soft_insert_serial"
                label="Inserir número de série do produto na interface gráfica (menu 'configuração')"
                isChecked={checklist['soft_insert_serial'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="soft_compile_path"
                label="Compilar o software e apontar seu caminho para inicializar junto ao miliohmímetro"
                isChecked={checklist['soft_compile_path'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="soft_config_sd"
                label="Colocar/configurar o micro SD para somente leitura"
                isChecked={checklist['soft_config_sd'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
        </ScrollView>
    );
};
