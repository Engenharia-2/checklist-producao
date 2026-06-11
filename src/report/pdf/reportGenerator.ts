import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { Session } from '../../types/session';
import { createPdfContent } from './htmlGenerator';
import { convertLogoToBase64 } from './imageUtils';
import { ReportImageProcessor } from './ReportImageProcessor';

export const generatePdf = async (session: Session) => {
    if (!session) {
        Alert.alert('Erro', 'Sessão não encontrada para gerar o relatório.');
        return;
    }

    try {
        // 1. Prepara uma cópia profunda para não sujar o estado da aplicação
        const processedSession = JSON.parse(JSON.stringify(session));
        
        // 2. Processa imagens dinamicamente baseando-se no schema do formulário
        const schema = (processedSession as any).formDefinition?.schema;
        const answers = (processedSession as any).answers || {};

        if (schema) {
            console.log('[reportGenerator] Iniciando processamento dinâmico de imagens...');
            const processedAnswers = await ReportImageProcessor.processAnswersImages(schema, answers);
            // Substitui as respostas originais (com URIs) pelas processadas (com Base64)
            (processedSession as any).answers = processedAnswers;
        } else {
            console.warn('[reportGenerator] Schema não encontrado. O relatório pode não conter imagens.');
        }

        // 3. Converte o logo da empresa
        const logoBase64 = await convertLogoToBase64();

        // 4. Gera o HTML dinâmico
        const html = createPdfContent(processedSession, logoBase64);

        // 5. Converte HTML para arquivo PDF
        const { uri } = await Print.printToFileAsync({ html });

        // 6. Compartilha o arquivo gerado
        if (!(await Sharing.isAvailableAsync())) {
            Alert.alert('Erro', 'O compartilhamento não está disponível neste dispositivo.');
            return;
        }

        await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Compartilhar Relatório de Produção',
            UTI: 'com.adobe.pdf',
        });

    } catch (error) {
        console.error('ReportGenerator: Error generating or sharing PDF:', error);
        Alert.alert('Erro', 'Não foi possível gerar o relatório PDF. Tente novamente.');
    }
};
