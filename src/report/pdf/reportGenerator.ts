import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { Alert } from 'react-native';
import { Session } from '../../types/session';
import { createPdfContent } from './htmlGenerator';
import { convertLogoToBase64 } from './imageUtils';
import { ReportImageProcessor } from './ReportImageProcessor';
import { apiService } from '../../services/apiService';

export const generatePdf = async (session: Session) => {
    if (!session) {
        Alert.alert('Erro', 'Sessão não encontrada para gerar o relatório.');
        return;
    }

    try {
        // 1. Prepara uma cópia profunda para não sujar o estado da aplicação
        const processedSession = JSON.parse(JSON.stringify(session));
        
        // 2. Processa imagens e assinaturas dinamicamente com base no schema do formulário
        const schema = (processedSession as any).formDefinition?.schema;
        const answers = (processedSession as any).answers || {};

        if (schema) {
            console.log('[reportGenerator] Iniciando processamento dinâmico de imagens e assinaturas...');
            const processedAnswers = await ReportImageProcessor.processAnswersImages(schema, answers);
            // Substitui as respostas originais (com URIs) pelas processadas (com Base64)
            (processedSession as any).answers = processedAnswers;
        } else {
            console.warn('[reportGenerator] Schema não encontrado. O relatório pode não conter imagens e assinaturas.');
        }

        // 3. Converte o logo da empresa
        const logoBase64 = await convertLogoToBase64();

        // 4. Gera o HTML dinâmico
        const html = createPdfContent(processedSession, logoBase64);

        // 5. Converte HTML para arquivo PDF
        const { uri: tempUri } = await Print.printToFileAsync({ html });

        // 5.1. Extrai o número da OP e formata o nome do arquivo com hífen
        const opNumber = session.osNumber ? session.osNumber.replace(/[^a-zA-Z0-9]/g, '') : 'SemOP';
        const targetFilename = `OP-${opNumber}.pdf`;
        const targetUri = `${FileSystem.cacheDirectory}${targetFilename}`;

        // 5.2. Move o PDF temporário para o novo caminho com o nome desejado
        await FileSystem.moveAsync({
            from: tempUri,
            to: targetUri
        });

        // 5.3. Faz o upload para o servidor (silencioso - backup)
        try {
            console.log(`[reportGenerator] Enviando backup para o servidor: ${targetUri}`);
            const backupResult = await apiService.uploadPdf(
                targetUri,
                opNumber,
                session.formName,
                session.serialNumber
            );

            if (backupResult.status === 'completed') {
                console.log('[reportGenerator] Backup no servidor concluído com sucesso.');
            } else {
                console.warn('[reportGenerator] Backup pendente. A API realizará novas tentativas em segundo plano.');
            }
        } catch (uploadError) {
            console.error('[reportGenerator] Falha no upload para o servidor (apenas log):', uploadError);
            // Não bloqueamos o app pois o envio pelo WhatsApp (compartilhar) continua sendo o principal
        }

        // 6. Compartilha o arquivo gerado
        if (!(await Sharing.isAvailableAsync())) {
            Alert.alert('Erro', 'O compartilhamento não está disponível neste dispositivo.');
            return;
        }

        await Sharing.shareAsync(targetUri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Compartilhar Relatório de Produção',
            UTI: 'com.adobe.pdf',
        });

    } catch (error) {
        console.error('ReportGenerator: Error generating or sharing PDF:', error);
        Alert.alert('Erro', 'Não foi possível gerar o relatório PDF. Tente novamente.');
    }
};
