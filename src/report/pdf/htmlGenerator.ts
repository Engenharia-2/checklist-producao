import { Session } from "../../types/session";
import { AttachedImage } from "../types";

// --- Helper Functions ---

const generateCheckbox = (label: string, checked: boolean) => {
    // Simple checkmark icon
    const checkmark = checked ? '&#10003;' : '';
    return `
      <div class="checkbox-container ${checked ? 'checked' : ''}">
        <span class="checkbox-symbol">${checkmark}</span>
        <span class="checkbox-label">${label}</span>
      </div>
    `;
};

const generateField = (label: string, value: string | undefined | null) => {
    return `
      <div class="field">
        <strong>${label}:</strong>
        <span>${value || 'Não informado'}</span>
      </div>
    `;
};

const generateImageSection = (title: string, images: AttachedImage[]) => {
    if (!images || images.length === 0) return '';
    let imageHtml = `
      <div class="image-group-section">
        <h3 class="section-title">${title}</h3>
        <div class="image-grid">
    `;
    images.forEach(img => {
        imageHtml += `
        <div class="image-block">
          <img src="${img.uri}" class="report-image"/>
        </div>
      `;
    });
    imageHtml += `</div></div>`;
    return imageHtml;
};

// --- Checklist Specific Renderers ---

const renderMiliohmimetroHtml = (checklist: Record<string, any>): string => {
    // Helper to generate a section of checklist items
    const generateChecklistSection = (title: string, items: { id: string, label: string }[]) => {
        let sectionHtml = `<div class="section"><h3 class="section-title">${title}</h3>`;
        items.forEach(item => {
            sectionHtml += generateCheckbox(item.label, checklist[item.id] || false);
        });
        sectionHtml += `</div>`;
        return sectionHtml;
    };

    let html = '';

    // Análise Inicial
    html += `
        <div class="section">
            <h3 class="section-title">Análise Inicial</h3>
            ${generateField('Modelo do equipamento (bancada, maleta)?', checklist.initial_equip_model)}
            ${generateField('Modelo/tipo do computador', checklist.initial_pc_model)}
            ${generateField('Modelo da tela', checklist.initial_screen_model)}
            ${generateField('Versão do software', checklist.initial_software_version)}
            ${generateField('Data da calibração', checklist.initial_calib_date)}
            ${generateField('Validade da Calibração', checklist.initial_calib_validity)}
            ${generateCheckbox('Revisão da placa de circuito impresso', checklist.initial_pcb_revision)}
        </div>`;

    // Montagem (Mecânica)
    html += generateChecklistSection('Montagem (Mecânica)', [
        { id: 'mech_screws_tight', label: 'Verificar se todos os parafusos da mecânica estão apertados' },
        { id: 'mech_grounding_screw', label: 'Verificar se o parafuso do aterramento esta apertado' },
        { id: 'mech_membrane_check', label: 'Verificar membrana na maleta interna, externa e na tela' },
        { id: 'mech_cable_organization', label: 'Verificar organização interna dos cabos com abraçadeiras ou Termo-encolhíveis' },
        { id: 'mech_glue_connectors', label: 'Passar cola quente em todos os cabos com conexão KK, nos parafusos da placa e parafusos das entradas de medição.' },
        { id: 'mech_foam_sides', label: 'Colar espuma nas laterais da maleta (10mm de altura)' },
    ]);

    // Pré-Energização
    html += generateChecklistSection('Pré-Energização', [
        { id: 'pre_verify_connections', label: "Verificar conexões das fontes e da placa, desconectar USB's da placa e cabo fita, conectar apenas depois de energizar a primeira vez" },
        { id: 'pre_attach_serial', label: 'Anexar número de série do produto ao número de série da placa na planilha de assistência de placa' },
    ]);

    // Energização
    html += generateChecklistSection('Energização', [
        { id: 'energ_verify_voltage', label: 'Verificar a tensão da fonte 5V ANTES DE CALIBRAR, ajustar em 4.95V' },
        { id: 'energ_test_touch', label: 'Testar touch screen da tela' },
        { id: 'energ_test_usb_ethernet', label: 'Testar USB e Ethernet' },
        { id: 'energ_test_start_btn', label: 'Testar botão físico de “iniciar teste”' },
    ]);

    // Software
    html += generateChecklistSection('Software', [
        { id: 'soft_update', label: 'Atualizar o software para a versão mais recente' },
        { id: 'soft_test_wifi', label: 'Testar a conexão do Wi-Fi' },
        { id: 'soft_verify_repeatability', label: 'Verificar repetibilidade das medições em todas as faixas' },
        { id: 'soft_exec_calibration', label: 'Executar calibração em todas as faixas de medição' },
        { id: 'soft_copy_files', label: "Colocar os arquivos do pendrive na pasta 'mohm-lhf/data', após a calibração" },
        { id: 'soft_test_pdf', label: 'Testar a geração de relatório PDF para pendrive' },
        { id: 'soft_default_config', label: 'Deixar valores de configuração no padrão (temperatura de referência 25, numero aquisições 5, tempo estabilização 1)' },
        { id: 'soft_insert_serial', label: "Inserir número de série do produto na interface gráfica (menu 'configuração')" },
        { id: 'soft_compile_path', label: 'Compilar o software e apontar seu caminho para inicializar junto ao miliohmímetro' },
        { id: 'soft_config_sd', label: 'Colocar/configurar o micro SD para somente leitura' },
    ]);

    // Calibração Interna
    html += generateChecklistSection('Calibração Interna', [
        { id: 'calib_all_scales', label: 'Calibrar todas as escalas visando identificar possíveis falhas de medição' },
        { id: 'calib_battery', label: 'Realizar calibração da bateria' },
        { id: 'calib_temperature_kappo', label: 'Realizar calibração da temperatura com utilização do KAPPO (utilizar o gráfico abaixo).' },
    ]);
    // TODO: Add table for KAPPO calibration

    // Finalização
    html += generateChecklistSection('Finalização', [
        { id: 'final_glue_usb', label: "Após todos os testes, passar cola quente nas entradas USB's e HDMI" },
        { id: 'final_serial_manual', label: 'Colar número de série no manual' },
        { id: 'final_foam_walls', label: 'Colar espuma nas paredes da maleta' },
        { id: 'final_vibration_test', label: 'Executar teste de vibração de 1Hz até 10Hz durante 10 minutos' },
        { id: 'final_test_scales_post_vib', label: 'Testar todas as escalas após a vibração' },
        { id: 'final_copy_calibration', label: 'Copiar os valores da calibração para um pendrive atráves do botão "Salvar" na tela de "Valores Calibrados", e salvar esse arquivo na pasta de "Gestão de qualidade"' },
        { id: 'final_copy_alldata', label: 'Copiar o arquivo ALLDATA do pendrive para a pasta de GESTÃO DA QUALIDADE do equipamento.' },
    ]);

    // Identificação
    html += `
        <div class="section">
            <h3 class="section-title">Identificação</h3>
            ${generateField('Número do Certificado de calibração', checklist.final_cert_number)}
            ${generateCheckbox('Verificar contato das garras, medir resistência e avaliar variação da resistência, deve ser menor que 5%', checklist.final_verify_claws)}
            ${generateCheckbox('Enviar manual impresso, certificado de calibração, cabos com garras e cabo de alimentação', checklist.final_send_manual)}
            ${generateField('Montador (nome)', checklist.final_montador)}
            ${generateField('Testador (nome)', checklist.final_testador)}
            ${generateField('Observações finais', checklist.final_obs)}
        </div>`;

    // Imagens
    if (checklist.images && checklist.images.length > 0) {
        // This assumes images are already base64 encoded. The reportGenerator should handle this.
        const imageItems: AttachedImage[] = checklist.images.map((uri: string) => ({ uri }));
        html += generateImageSection('Imagens Anexadas', imageItems);
    }

    return html;
}

const renderMegohmetroHtml = (checklist: Record<string, any>): string => {
    const generateChecklistSection = (title: string, items: { id: string, label: string }[]) => {
        let sectionHtml = `<div class="section"><h3 class="section-title">${title}</h3>`;
        items.forEach(item => {
            sectionHtml += generateCheckbox(item.label, checklist[item.id] || false);
        });
        sectionHtml += `</div>`;
        return sectionHtml;
    };

    let html = '';

    // Montagem
    html += generateChecklistSection('Montagem', [
        { id: 'mega_montagem_parafusos', label: 'Verificar se todos os parafusos da mecânica estão apertados' },
        { id: 'mega_montagem_parafuso_terra', label: 'Verificar se o parafuso do aterramento esta apertado' },
        { id: 'mega_montagem_membrana', label: 'Verificar membrana na maleta interna, externa e na tela' },
        { id: 'mega_montagem_organizacao_cabos', label: 'Verificar organização interna dos cabos com abraçadeiras ou Termo-encolhíveis' },
        { id: 'mega_montagem_cola_quente', label: 'Passar cola quente em todos os cabos com conexão KK, nos parafusos da placa e parafusos das entradas de medição.' },
        { id: 'mega_montagem_espuma', label: 'Colar espuma nas laterais da maleta (10mm de altura)' },
    ]);

    // Pré-Energização
    html += `
        <div class="section">
            <h3 class="section-title">Pré-Energização</h3>
            ${generateField('Número de série da placa principal', checklist.mega_pre_serial_placa_principal)}
            ${generateField('Número de série da placa Painel frontal', checklist.mega_pre_serial_placa_frontal)}
            ${generateCheckbox('Verificar conexões da fonte e da placa', checklist.mega_pre_conexoes_fonte)}
            ${generateCheckbox('Verificar contato das garras, medir resistência e avaliar variação Da resistência, deve ser menor que 5%', checklist.mega_pre_contato_garras)}
        </div>`;


    // Energização
    html += generateChecklistSection('Energização', [
        { id: 'mega_energ_touch', label: 'Testar touch screen da tela' },
        { id: 'mega_energ_botoes', label: 'Testar botão físico de "iniciar teste" e "parar"' },
    ]);

    // Software e Calibração
    html += `
        <div class="section">
            <h3 class="section-title">Software e Calibração</h3>
            ${generateCheckbox('Atualizar o software para a versão mais recente', checklist.mega_software_atualizar)}
            ${generateCheckbox('Verificar repetibilidade das medições em todas as faixas', checklist.mega_software_repetibilidade)}
        </div>`;
    // TODO: Add calibration table

    // Finalização
    html += generateChecklistSection('Finalização', [
        { id: 'mega_final_testes_proc', label: 'Executar testes conforme procedimento' },
        { id: 'mega_final_cola_quente', label: 'Após todos os testes, passar cola quente nos pontos necessários' },
        { id: 'mega_final_num_serie', label: 'Colar número de série no manual e maleta e bolsa dos cabos' },
        { id: 'mega_final_enviar_manual', label: 'Enviar manual impresso, certificado de calibração, cabos com Garras e cabo de alimentação' },
        { id: 'mega_final_teste_vibracao', label: 'Executar teste de vibração de 1Hz até 10Hz durante 10 minutos' },
        { id: 'mega_final_teste_30min_5k', label: 'Após a vibração executar teste de 30min em 5K' },
        { id: 'mega_final_conexao_software', label: 'Fazer teste de conexão com o Software e gerar o relatório de Dados.' },
        { id: 'mega_final_lacre_foto', label: 'Fazer o lacre internamente, tirar foto e salvar na pasta do Megôhmetro' },
        { id: 'mega_final_calibracao_externa', label: 'Enviado para a calibração externa' },
    ]);

    // Identificação Final
    html += `
        <div class="section">
            <h3 class="section-title">Identificação Final</h3>
            ${generateField('Número do Certificado de calibração', checklist.mega_ident_cert_calibracao)}
            ${generateField('Montador (nome)', checklist.mega_ident_montador)}
            ${generateField('Testador (nome)', checklist.mega_ident_testador)}
            ${generateField('Embalador/Finalizador (nome)', checklist.mega_ident_embalador)}
            ${generateField('Observações finais relevantes', checklist.mega_ident_obs)}
        </div>`;

    return html;
}

const renderSurge4kvHtml = (checklist: Record<string, any>): string => {
    const generateChecklistSection = (title: string, items: { id: string, label: string }[]) => {
        let sectionHtml = `<div class="section"><h3 class="section-title">${title}</h3>`;
        items.forEach(item => {
            sectionHtml += generateCheckbox(item.label, checklist[item.id] || false);
        });
        sectionHtml += `</div>`;
        return sectionHtml;
    };

    let html = '';

    // Análise Inicial
    html += `
        <div class="section">
            <h3 class="section-title">Análise Inicial</h3>
            ${generateField('Modelo do equipamento: bancada ou maleta?', checklist.surge4kv_analise_modelo_equip)}
            ${generateField('Modelo/tipo do computador', checklist.surge4kv_analise_modelo_pc)}
            ${generateField('Modelo do osciloscópio', checklist.surge4kv_analise_modelo_osc)}
            ${generateField('Modelo da tela', checklist.surge4kv_analise_modelo_tela)}
            ${generateField('Número do computador (ao abrir o software)', checklist.surge4kv_analise_num_pc)}
            ${generateField('Nome da versão de software do surge', checklist.surge4kv_analise_versao_software)}
            ${generateField('Data da versão de software do surge', checklist.surge4kv_analise_data_software)}
            ${generateField('Licenciar Windows. Número', checklist.surge4kv_analise_licenca_num)}
            ${generateField('Licenciar Windows. Versão (HOME/PRO)', checklist.surge4kv_analise_licenca_versao)}
        </div>`;

    // Análise Inicial - Hardware
    html += `
        <div class="section">
            <h3 class="section-title">Análise Inicial - Hardware</h3>
            ${generateCheckbox('Verificar pontos de aterramento da carcaça e componentes. Negativo das fontes deve ser aterrado. Negativos das saídas (garras pretas) deve ser aterrado.', checklist.surge4kv_hw_aterramento)}
            ${generateCheckbox('Posição de conectores USB, RJ45 – conforme impresso na Membrana', checklist.surge4kv_hw_conectores)}
            ${generateCheckbox('Arruelas de pressão em todos os parafusos', checklist.surge4kv_hw_arruelas)}
            ${generateCheckbox('Verificar aperto do parafuso TERRA do equipamento', checklist.surge4kv_hw_parafuso_terra)}
            ${generateField('Numero de série placa principal', checklist.surge4kv_hw_serial_principal)}
            ${generateField('Numero de série placa de disparo', checklist.surge4kv_hw_serial_disparo)}
            ${generateField('Numero de série fonte', checklist.surge4kv_hw_serial_fonte)}
            ${generateField('Numero de série placa de relés', checklist.surge4kv_hw_serial_reles)}
        </div>`;

    // Energização
    html += generateChecklistSection('Energização', [
        { id: 'surge4kv_energ_bios', label: 'Entrar na BIOS e configurar conforme descritivo.' },
        { id: 'surge4kv_energ_windows', label: 'Utilizando o PENDRIVE padrão de imagem para o Windows, conforme procedimento adicionar a imagem do Windows 10 no equipamento e configurar a placa ETHERNET conforme Procedimento.' },
        { id: 'surge4kv_energ_brilho', label: 'Aumentar o brilho da tela ao máximo' },
        { id: 'surge4kv_energ_usb_eth', label: "Testar funcionamento das USB's e Ethernet" },
        { id: 'surge4kv_energ_touch', label: 'Testar touch-screen da tela' },
        { id: 'surge4kv_energ_teste_placas', label: 'Teste de placas - executar teste de tensão e aplicar ganho no Software do surge' },
        { id: 'surge4kv_energ_buzzer', label: 'Verificar se buzzer está audível (funcionando)' },
        { id: 'surge4kv_energ_versao_software', label: 'Verificar se a ultima versão do software esta atualizada no surge' },
        { id: 'surge4kv_energ_startup', label: 'Programa surge iniciar automaticamente (shell:startup)' },
        { id: 'surge4kv_energ_config_energia', label: 'Configurar o Windows para não desligar nem suspender (nunca). Configurar o botão de energia para "Desligar" e o botão de Suspensão para "nada a fazer".' },
        { id: 'surge4kv_energ_led', label: 'Verificar o funcionamento do LED RGB na face do produto. Deve Acender em branco ao iniciar o software.' },
        { id: 'surge4kv_energ_wifi', label: 'Testar funcionamento do Wi-Fi' },
        { id: 'surge4kv_energ_instalar_softwares', label: 'Instalar softwares necessários (conforme descritivo). PRINCIPALMENTE “Team Viewer 12” e software do Osciloscópio Hantek.' },
    ]);

    // Calibração
    html += `
        <div class="section">
            <h3 class="section-title">Calibração</h3>
            ${generateCheckbox('Abrir software da HANTEK e realizar a calibração do CH1. Essa calibração é responsável para deixar a linha do gráfico mais Próximo o possível do ponto zero.', checklist.surge4kv_calib_hantek)}
            ${generateCheckbox('Executar calibração da tensão DC de saída (com ax=1 e b=0 no Software). NÃO RECALIBRAR se for conserto.', checklist.surge4kv_calib_dc)}
            ${generateField('Número da calibração (fornecido pelo laboratório)', checklist.surge4kv_calib_num_calibracao)}
            ${generateCheckbox('Finalizar calibração com bobina/surto: multiplicador de surto e zeramento de 400, 800, 1600, 3900V', checklist.surge4kv_calib_bobina)}
            ${generateCheckbox('Testar funcionalidade de todos os 12 relês (contra todos). Realizar com apenas 2 cabos (1 bobina) conectados por vez.', checklist.surge4kv_calib_reles)}
            ${generateCheckbox('Fazer testes 1-2, 2-3, 3-1 e 1-4, 2-5, 3-6', checklist.surge4kv_calib_testes)}
            ${generateCheckbox('Copiar arquivo padrão de cadastros (profile.3DB) para a pasta do Surge. Testar com bobina 6 cabos, motor 3 cabos, etc. NÃO MEXER se for conserto.', checklist.surge4kv_calib_profile)}
        </div>`;

    // Finalização
    html += generateChecklistSection('Finalização', [
        { id: 'surge4kv_final_logo', label: 'Inserir Logomarca do cliente' },
        { id: 'surge4kv_final_apagar_padroes', label: 'Apagar demais padrões de testes (eventualmente criados durante Testes na LHF). NÃO APAGAR se for conserto.' },
        { id: 'surge4kv_final_tela_nao_desligar', label: 'Ajustar parâmetro para a tela não desligar nunca.' },
        { id: 'surge4kv_final_testes_repetitivos', label: 'Executar testes repetitivos em toda a faixa de tensões de saída, Principalmente na tensão máxima' },
        { id: 'surge4kv_final_alimentar_110', label: 'Alimentar com 110-127Vca e testar se tensão de saída chega na Máxima' },
        { id: 'surge4kv_final_testar_relatorios', label: 'Testar Relatórios de testes (PDF e .CSV)' },
        { id: 'surge4kv_final_inspecao_mecanica', label: 'Inspeção mecânica/visual final: parafusos, encaixes, colas, riscos, Sujeira, cabos, suporte da tela.' },
        { id: 'surge4kv_final_limpar_ar', label: 'Limpar com ar comprimido' },
        { id: 'surge4kv_final_etiqueta_licenca', label: 'Etiqueta com a licença do Windows no surge' },
        { id: 'surge4kv_final_etiqueta_serie', label: 'Etiqueta com numero de série na tampa da maleta. Etiquetas de número de série, de entrada de energia e de calibração dentro Da maleta.' },
        { id: 'surge4kv_final_manuais_desktop', label: 'Disponibilizar manuais no desktop (utilização e calibração)' },
        { id: 'surge4kv_final_manual_fisico', label: 'Incluir manual do usuário/operação – cópia física' },
        { id: 'surge4kv_final_garras', label: 'Garras vermelhas: 1, 2 e 3. Pretas: 4' },
        { id: 'surge4kv_final_cabo_alimentacao', label: 'Incluir cabo de alimentação' },
        { id: 'surge4kv_final_teste_rapido', label: 'Cadastrar FT e FE no teste rápido' },
        { id: 'surge4kv_final_recadastro_bobina', label: '3 cabos bobina e motor refazer o cadastro com teste inverso e Mudar para 2k.' },
        { id: 'surge4kv_final_config_matriz', label: 'configurar opção de matriz de relés na aba de opções /hardware' },
        { id: 'surge4kv_final_ajustar_logo', label: 'Ajustar logomarca LHF no desktop, configurar como "ajustado"' },
        { id: 'surge4kv_final_verificar_botoes', label: 'Verificar botoes e LED’s: apertar bem!' },
        { id: 'surge4kv_final_abracadeira', label: 'Abraçadeira nos cabos: não deixar com pontas' },
        { id: 'surge4kv_final_prensa_cabos', label: 'Apertar prensa-cabos' },
        { id: 'surge4kv_final_cola_quente', label: 'Cola-quente em todos os conectores e componentes que não Tenham trava ou arruela de pressão' },
        { id: 'surge4kv_final_teste_vibracao', label: 'Realizar teste de vibração na plataforma vibratória FAIXA DE 1Hz À 10HZ CERCA DE 10 MIN.' },
        { id: 'surge4kv_final_testes_repetitivos_pos_vib', label: 'Executar testes repetitivos em toda a faixa de tensões de saída, Principalmente na tensão máxima após a vibração.' },
        { id: 'surge4kv_final_limpar_report', label: 'Limpar resultados da pasta report (deletar o arquivo report.3DB) Antes de enviar. NÃO DELETAR se for conserto. Refazer o Teste padrão' },
        { id: 'surge4kv_final_backup_rede', label: 'Fazer backup da pasta do software do surge para a rede (em “LHF\\PROJETOS\\Surge Teste - Sinapse\\SURGE TESTE - GESTÃO DA QUALIDADE”)' },
        { id: 'surge4kv_final_print_calibracao', label: 'Tirar print dos valores de calibração após o equipamento ser calibrado pela calibração externa e salvar nos campos abaixo' },
    ]);

    // Identificação Final
    html += `
        <div class="section">
            <h3 class="section-title">Identificação Final</h3>
            ${generateField('Montador (nome)', checklist.surge4kv_ident_montador)}
            ${generateField('Testador (nome)', checklist.surge4kv_ident_testador)}
            ${generateField('Embalador/Finalizador (nome)', checklist.surge4kv_ident_embalador)}
            ${generateField('Observações finais relevantes', checklist.surge4kv_ident_obs)}
        </div>`;

    // Imagens
    if (checklist.surge4kv_ident_prints && checklist.surge4kv_ident_prints.length > 0) {
        const imageItems: AttachedImage[] = checklist.surge4kv_ident_prints.map((uri: string) => ({ uri }));
        html += generateImageSection('Imagens Anexadas', imageItems);
    }

    return html;
}

const renderSurge15kvHtml = (checklist: Record<string, any>): string => {
    const generateChecklistSection = (title: string, items: { id: string, label: string }[]) => {
        let sectionHtml = `<div class="section"><h3 class="section-title">${title}</h3>`;
        items.forEach(item => {
            sectionHtml += generateCheckbox(item.label, checklist[item.id] || false);
        });
        sectionHtml += `</div>`;
        return sectionHtml;
    };

    let html = '';

    // Análise Inicial
    html += `
        <div class="section">
            <h3 class="section-title">Análise Inicial</h3>
            ${generateField('Modelo do equipamento: 4kV ou 15kV?', checklist.surge15kv_analise_modelo_kv)}
            ${generateField('Modelo do equipamento: bancada ou maleta?', checklist.surge15kv_analise_modelo_tipo)}
            ${generateField('Modelo/tipo do computador', checklist.surge15kv_analise_modelo_pc)}
            ${generateField('Modelo do osciloscópio', checklist.surge15kv_analise_modelo_osc)}
            ${generateField('Modelo da tela', checklist.surge15kv_analise_modelo_tela)}
            ${generateField('Número do computador (ao abrir o software)', checklist.surge15kv_analise_num_pc)}
            ${generateField('Nome da versão de software do surge', checklist.surge15kv_analise_versao_software)}
            ${generateField('Data da versão de software do surge', checklist.surge15kv_analise_data_software)}
            ${generateField('Licenciar Windows. Número', checklist.surge15kv_analise_licenca_num)}
            ${generateField('Licenciar Windows. Versão (HOME/PRO)', checklist.surge15kv_analise_licenca_versao)}
        </div>`;

    // Análise Inicial - Hardware
    html += `
        <div class="section">
            <h3 class="section-title">Análise Inicial - Hardware</h3>
            ${generateCheckbox('Verificar pontos de aterramento da carcaça e componentes. Negativo das fontes deve ser aterrado. Negativos das saídas (garras pretas) deve ser aterrado', checklist.surge15kv_hw_aterramento)}
            ${generateCheckbox('Posição de conectores USB, RJ45 – conforme impresso na membrana', checklist.surge15kv_hw_conectores)}
            ${generateCheckbox('Arruelas de pressão em todos os parafusos', checklist.surge15kv_hw_arruelas)}
            ${generateField('Numero de série placa principal', checklist.surge15kv_hw_serial_principal)}
            ${generateField('Numero de série placa de disparo', checklist.surge15kv_hw_serial_disparo)}
            ${generateField('Numero de série placa controle do disparo', checklist.surge15kv_hw_serial_controle_disparo)}
            ${generateField('Numero de série fonte', checklist.surge15kv_hw_serial_fonte)}
            ${generateField('Numero de série placa de leitura', checklist.surge15kv_hw_serial_leitura)}
        </div>`;

    // Energização
    html += generateChecklistSection('Energização', [
        { id: 'surge15kv_energ_bios', label: 'Entrar na BIOS e configurar conforme descritivo.' },
        { id: 'surge15kv_energ_brilho', label: 'Aumentar o brilho da tela ao máximo' },
        { id: 'surge15kv_energ_usb_eth', label: "Testar funcionamento das USB's e Ethernet" },
        { id: 'surge15kv_energ_touch', label: 'Testar touch-screen da tela' },
        { id: 'surge15kv_energ_teste_placas', label: 'Teste de placas - executar teste de tensão e aplicar ganho no software do surge' },
        { id: 'surge15kv_energ_buzzer', label: 'Verificar se buzzer está audível (funcionando)' },
        { id: 'surge15kv_energ_versao_software', label: 'Verificar se a ultima versão do software esta atualizada no surge' },
        { id: 'surge15kv_energ_startup', label: 'Programa surge iniciar automaticamente (shell:startup)' },
        { id: 'surge15kv_energ_config_energia', label: 'Configurar o Windows para não desligar nem suspender (nunca). Configurar o botão de energia para "Desligar" e o botão de suspensão para "nada a fazer".' },
        { id: 'surge15kv_energ_led', label: 'Verificar o funcionamento do LED RGB na face do produto. Deve acender em branco ao iniciar o software.' },
        { id: 'surge15kv_energ_wifi', label: 'Testar funcionamento do Wi-Fi' },
        { id: 'surge15kv_energ_instalar_softwares', label: 'Instalar softwares necessários (conforme descritivo). PRINCIPALMENTE “Team Viewer 12” e software do Osciloscópio Hantek.' },
    ]);

    // Calibração
    html += `
        <div class="section">
            <h3 class="section-title">Calibração</h3>
            ${generateCheckbox('Abrir software da HANTEK e realizar a calibração do CH1. Essa calibração é responsável para deixar a linha do gráfico mais próximo o possível do ponto zero.', checklist.surge15kv_calib_hantek)}
            ${generateCheckbox('Executar calibração da tensão DC de saída (com ax=1 e b=0 no software). NÃO RECALIBRAR se for conserto.', checklist.surge15kv_calib_dc)}
            ${generateField('Número da calibração (fornecido pelo laboratório)', checklist.surge15kv_calib_num_calibracao)}
        </div>`;

    // Finalização
    html += generateChecklistSection('Finalização', [
        { id: 'surge15kv_final_logo', label: 'Inserir Logomarca do cliente' },
        { id: 'surge15kv_final_apagar_padroes', label: 'Apagar demais padrões de testes (eventualmente criados durante testes na LHF). NÃO APAGAR se for conserto.' },
        { id: 'surge15kv_final_tela_nao_desligar', label: 'Ajustar parâmetro para a tela não desligar nunca.' },
        { id: 'surge15kv_final_testes_repetitivos', label: 'Executar testes repetitivos em toda a faixa de tensões de saída, principalmente na tensão máxima' },
        { id: 'surge15kv_final_alimentar_110_invertida', label: 'Alimentar com 110-127Vca e testar tomada com fase invertida.' },
        { id: 'surge15kv_final_alimentar_110_max', label: 'Alimentar com 110-127Vca e testar se tensão de saída chega na máxima' },
        { id: 'surge15kv_final_testar_relatorios', label: 'Testar Relatórios de testes (PDF e .CSV)' },
        { id: 'surge15kv_final_inspecao_mecanica', label: 'Inspeção mecânica/visual final: parafusos, encaixes, colas, riscos, sujeira, cabos, suporte da tela.' },
        { id: 'surge15kv_final_limpar_ar', label: 'Limpar com ar comprimido' },
        { id: 'surge15kv_final_etiqueta_licenca', label: 'Etiqueta com a licença do Windows no surge' },
        { id: 'surge15kv_final_etiqueta_serie', label: 'Etiqueta com numero de série na tampa da maleta. Etiquetas de número de série, de entrada de energia e de calibração dentro da maleta.' },
        { id: 'surge15kv_final_manuais_desktop', label: 'Disponibilizar manuais no desktop (utilização e calibração)' },
        { id: 'surge15kv_final_manual_fisico', label: 'Incluir manual do usuário/operação – cópia física' },
        { id: 'surge15kv_final_garras', label: 'Garras vermelhas: 1. Pretas: 2 e 3' },
        { id: 'surge15kv_final_cabo_alimentacao', label: 'Incluir cabo de alimentação' },
        { id: 'surge15kv_final_teste_rapido', label: 'Cadastrar FT e FE no teste rápido' },
        { id: 'surge15kv_final_recadastro_bobina', label: '3 cabos bobina e motor refazer o cadastro com teste inverso e mudar para 2k.' },
        { id: 'surge15kv_final_ajustar_logo', label: 'Ajustar logomarca LHF no Desktop, configurar como "ajustado"' },
        { id: 'surge15kv_final_verificar_botoes', label: 'Verificar botoes e LED’s: apertar bem!' },
        { id: 'surge15kv_final_abracadeira', label: 'Abraçadeira nos cabos: não deixar com pontas' },
        { id: 'surge15kv_final_prensa_cabos', label: 'Apertar Prensa-cabos' },
        { id: 'surge15kv_final_cola_quente', label: 'Cola-quente em todos os conectores e componentes que não tenham trava ou arruela de pressão' },
        { id: 'surge15kv_final_teste_vibracao', label: 'Realizar teste de vibração na plataforma vibratória FAIXA DE 1HZ À 10HZ CERCA DE 10 MIN' },
        { id: 'surge15kv_final_testes_repetitivos_pos_vib', label: 'Executar testes repetitivos em toda a faixa de tensões de saída, principalmente na tensão máxima após a vibração' },
        { id: 'surge15kv_final_limpar_report', label: 'Limpar resultados da pasta report (deletar o arquivo report.3DB) antes de enviar. NÃO DELETAR se for conserto. Refazer o teste padrão' },
        { id: 'surge15kv_final_backup_rede', label: 'Fazer backup da pasta do software do surge para a rede (em “LHF\\PROJETOS\\Surge Teste - Sinapse\\SURGE TESTE - GESTÃO DA QUALIDADE”)' },
        { id: 'surge15kv_final_print_calibracao', label: 'Tirar print dos valores de calibração após o equipamento ser calibrado pela calibração externa e salvar nos campos abaixo' },
    ]);

    // Identificação Final
    html += `
        <div class="section">
            <h3 class="section-title">Identificação Final</h3>
            ${generateField('Montador (nome)', checklist.surge15kv_ident_montador)}
            ${generateField('Testador (nome)', checklist.surge15kv_ident_testador)}
            ${generateField('Embalador/Finalizador (nome)', checklist.surge15kv_ident_embalador)}
            ${generateField('Observações finais relevantes', checklist.surge15kv_ident_obs)}
        </div>`;

    // Imagens
    if (checklist.surge15kv_ident_prints && checklist.surge15kv_ident_prints.length > 0) {
        const imageItems: AttachedImage[] = checklist.surge15kv_ident_prints.map((uri: string) => ({ uri }));
        html += generateImageSection('Imagens Anexadas', imageItems);
    }

    return html;
}


// --- Main PDF Content Creator ---

export const createPdfContent = (session: Session, logoBase64: string | null): string => {

    let checklistHtml = '';
    switch (session.productModel) {
        case 'Miliohmimetro':
            checklistHtml = renderMiliohmimetroHtml(session.checklist);
            break;
        case 'Megohmetro':
            checklistHtml = renderMegohmetroHtml(session.checklist);
            break;
        case 'Surge test 4kv':
            checklistHtml = renderSurge4kvHtml(session.checklist);
            break;
        case 'Surge Test 15kv':
            checklistHtml = renderSurge15kvHtml(session.checklist);
            break;
        default:
            checklistHtml = '<p>Checklist para este produto não encontrado.</p>';
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; padding: 1cm; }
        .header { display: flex; align-items: center; justify-content: center; padding-bottom: 0.5cm; border-bottom: 2px solid #005a9c; }
        .logo { height: 50px; width: 50px; margin-right: 15px; }
        .header-title { font-size: 18pt; font-weight: bold; color: #005a9c; }
        .section { margin-bottom: 25px; page-break-inside: avoid; }
        .section-title { font-size: 16pt; color: #005a9c; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; }
        .field { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; }
        .field strong { color: #005a9c; }
        .checkbox-container { display: flex; align-items: center; background: #f1f4fa; border-radius: 8px; padding: 5px 8px; margin: 4px 0; }
        .checkbox-container.checked { background-color: #005a9c; color: #fff; }
        .checkbox-symbol { margin-right: 8px; font-weight: bold; }
        .image-group-section { padding-top: 1cm; margin-top: 25px; page-break-before: auto; }
        .image-grid { display: flex; flex-wrap: wrap; gap: 1cm; justify-content: center; }
        .image-block { text-align: center; }
        .report-image { max-width: 8cm; height: auto; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
        .footer { position: fixed; bottom: 0; left: 0; right: 0; text-align: center; font-size: 9pt; color: #888; border-top: 1px solid #ccc; padding-top: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        ${logoBase64 ? `<img src="${logoBase64}" class="logo" />` : ''}
        <span class="header-title">Relatório de Produção</span>
      </div>

      <div class="main-content">
        <div class="section">
          <h2 class="section-title">Dados da Sessão</h2>
          ${generateField('Ordem de Produção (OP)', session.osNumber)}
          ${generateField('Cliente', session.clientName)}
          ${generateField('Número de Série', session.serialNumber)}
          ${generateField('Modelo do Produto', session.productModel)}
          ${generateField('Data de Início', new Date(session.startDate).toLocaleString('pt-BR'))}
          ${session.endDate ? generateField('Data de Fim', new Date(session.endDate).toLocaleString('pt-BR')) : ''}
        </div>

        ${checklistHtml}

      </div>

      <div class="footer">
        Gerado em: ${new Date().toLocaleString('pt-BR')} | LHF Sistemas
      </div>
    </body>
    </html>
  `;

    return htmlContent;
};
