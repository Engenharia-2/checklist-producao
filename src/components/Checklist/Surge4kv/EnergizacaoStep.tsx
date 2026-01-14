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

export const EnergizacaoStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const { handleChange } = useChecklistItem(sessionId);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomTitle title="Energização" />

            <ChecklistItem
                id="surge4kv_energ_bios"
                label="Entrar na BIOS e configurar conforme descritivo."
                isChecked={checklist['surge4kv_energ_bios'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_energ_windows"
                label="Utilizando o PENDRIVE padrão de imagem para o Windows, conforme procedimento adicionar a imagem do Windows 10 no equipamento e configurar a placa ETHERNET conforme Procedimento."
                isChecked={checklist['surge4kv_energ_windows'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_energ_brilho"
                label="Aumentar o brilho da tela ao máximo"
                isChecked={checklist['surge4kv_energ_brilho'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_energ_usb_eth"
                label="Testar funcionamento das USB's e Ethernet"
                isChecked={checklist['surge4kv_energ_usb_eth'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_energ_touch"
                label="Testar touch-screen da tela"
                isChecked={checklist['surge4kv_energ_touch'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_energ_teste_placas"
                label="Teste de placas - executar teste de tensão e aplicar ganho no Software do surge"
                isChecked={checklist['surge4kv_energ_teste_placas'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_energ_buzzer"
                label="Verificar se buzzer está audível (funcionando)"
                isChecked={checklist['surge4kv_energ_buzzer'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_energ_versao_software"
                label="Verificar se a ultima versão do software esta atualizada no surge"
                isChecked={checklist['surge4kv_energ_versao_software'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_energ_startup"
                label="Programa surge iniciar automaticamente (shell:startup)"
                isChecked={checklist['surge4kv_energ_startup'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_energ_config_energia"
                label='Configurar o Windows para não desligar nem suspender (nunca). Configurar o botão de energia para "Desligar" e o botão de Suspensão para "nada a fazer".'
                isChecked={checklist['surge4kv_energ_config_energia'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_energ_led"
                label="Verificar o funcionamento do LED RGB na face do produto. Deve Acender em branco ao iniciar o software."
                isChecked={checklist['surge4kv_energ_led'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_energ_wifi"
                label="Testar funcionamento do Wi-Fi"
                isChecked={checklist['surge4kv_energ_wifi'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="surge4kv_energ_instalar_softwares"
                label='Instalar softwares necessários (conforme descritivo). PRINCIPALMENTE “Team Viewer 12” e software do Osciloscópio Hantek.'
                isChecked={checklist['surge4kv_energ_instalar_softwares'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
        </ScrollView>
    );
};
