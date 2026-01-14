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
                id="surge4kv_final_logo" 
                label="Inserir Logomarca do cliente" 
                isChecked={checklist['surge4kv_final_logo'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
             />
            <ChecklistItem 
                id="surge4kv_final_apagar_padroes" 
                label="Apagar demais padrões de testes (eventualmente criados durante Testes na LHF). NÃO APAGAR se for conserto." 
                isChecked={checklist['surge4kv_final_apagar_padroes'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_tela_nao_desligar" 
                label="Ajustar parâmetro para a tela não desligar nunca." 
                isChecked={checklist['surge4kv_final_tela_nao_desligar'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_testes_repetitivos" 
                label="Executar testes repetitivos em toda a faixa de tensões de saída, Principalmente na tensão máxima" 
                isChecked={checklist['surge4kv_final_testes_repetitivos'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_alimentar_110" 
                label="Alimentar com 110-127Vca e testar se tensão de saída chega na Máxima" 
                isChecked={checklist['surge4kv_final_alimentar_110'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_testar_relatorios" 
                label="Testar Relatórios de testes (PDF e .CSV)" 
                isChecked={checklist['surge4kv_final_testar_relatorios'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_inspecao_mecanica" 
                label="Inspeção mecânica/visual final: parafusos, encaixes, colas, riscos, Sujeira, cabos, suporte da tela." 
                isChecked={checklist['surge4kv_final_inspecao_mecanica'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_limpar_ar" 
                label="Limpar com ar comprimido" 
                isChecked={checklist['surge4kv_final_limpar_ar'] || false} 
                onToggle={(id, val) => handleChange(id, val)}
             />
            <ChecklistItem 
                id="surge4kv_final_etiqueta_licenca" 
                label="Etiqueta com a licença do Windows no surge" 
                isChecked={checklist['surge4kv_final_etiqueta_licenca'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_etiqueta_serie" 
                label="Etiqueta com numero de série na tampa da maleta. Etiquetas de número de série, de entrada de energia e de calibração dentro Da maleta." 
                isChecked={checklist['surge4kv_final_etiqueta_serie'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_manuais_desktop" 
                label="Disponibilizar manuais no desktop (utilização e calibração)" 
                isChecked={checklist['surge4kv_final_manuais_desktop'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_manual_fisico" 
                label="Incluir manual do usuário/operação – cópia física" 
                isChecked={checklist['surge4kv_final_manual_fisico'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_garras" 
                label="Garras vermelhas: 1, 2 e 3. Pretas: 4" 
                isChecked={checklist['surge4kv_final_garras'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_cabo_alimentacao" 
                label="Incluir cabo de alimentação" 
                isChecked={checklist['surge4kv_final_cabo_alimentacao'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_teste_rapido" 
                label="Cadastrar FT e FE no teste rápido" 
                isChecked={checklist['surge4kv_final_teste_rapido'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_recadastro_bobina" 
                label="3 cabos bobina e motor refazer o cadastro com teste inverso e Mudar para 2k." 
                isChecked={checklist['surge4kv_final_recadastro_bobina'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_config_matriz" 
                label="configurar opção de matriz de relés na aba de opções /hardware" 
                isChecked={checklist['surge4kv_final_config_matriz'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_ajustar_logo" 
                label='Ajustar logomarca LHF no desktop, configurar como "ajustado"' 
                isChecked={checklist['surge4kv_final_ajustar_logo'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_verificar_botoes" 
                label="Verificar botoes e LED’s: apertar bem!" 
                isChecked={checklist['surge4kv_final_verificar_botoes'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_abracadeira" 
                label="Abraçadeira nos cabos: não deixar com pontas" 
                isChecked={checklist['surge4kv_final_abracadeira'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_prensa_cabos" 
                label="Apertar prensa-cabos" 
                isChecked={checklist['surge4kv_final_prensa_cabos'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_cola_quente" 
                label="Cola-quente em todos os conectores e componentes que não Tenham trava ou arruela de pressão" 
                isChecked={checklist['surge4kv_final_cola_quente'] || false} 
                onToggle={(id, val) => handleChange(id, val)} 
            />
            <ChecklistItem 
                id="surge4kv_final_teste_vibracao" 
                label="Realizar teste de vibração na plataforma vibratória FAIXA DE 1Hz À 10HZ CERCA DE 10 MIN." 
                isChecked={checklist['surge4kv_final_teste_vibracao'] || false} 
                onToggle={(id, val) => handleChange(id, val)}
             />
            <ChecklistItem 
                id="surge4kv_final_testes_repetitivos_pos_vib" 
                label="Executar testes repetitivos em toda a faixa de tensões de saída, Principalmente na tensão máxima após a vibração." 
                isChecked={checklist['surge4kv_final_testes_repetitivos_pos_vib'] || false} 
                onToggle={(id, val) => handleChange(id, val)}
             />
            <ChecklistItem 
                id="surge4kv_final_limpar_report" 
                label="Limpar resultados da pasta report (deletar o arquivo report.3DB) Antes de enviar. NÃO DELETAR se for conserto. Refazer o Teste padrão" 
                isChecked={checklist['surge4kv_final_limpar_report'] || false} 
                onToggle={(id, val) => handleChange(id, val)}
             />
            <ChecklistItem 
                id="surge4kv_final_backup_rede" 
                label="Fazer backup da pasta do software do surge para a rede (em “LHF\PROJETOS\Surge Teste - Sinapse\SURGE TESTE - GESTÃO DA QUALIDADE”)" 
                isChecked={checklist['surge4kv_final_backup_rede'] || false} 
                onToggle={(id, val) => handleChange(id, val)}
             />
            <ChecklistItem 
                id="surge4kv_final_print_calibracao" 
                label="Tirar print dos valores de calibração após o equipamento ser calibrado pela calibração externa e salvar nos campos abaixo" 
                isChecked={checklist['surge4kv_final_print_calibracao'] || false} 
                onToggle={(id, val) => handleChange(id, val)}
             />

        </ScrollView>
    );
};
