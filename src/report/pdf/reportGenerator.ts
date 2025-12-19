import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { Session } from '../../types/session';
import { createPdfContent } from './htmlGenerator';
import { convertImageToBase64, convertLogoToBase64 } from './imageUtils';

export const generatePdf = async (session: Session) => {
    if (!session) {
        Alert.alert('Erro', 'Sessão não encontrada para gerar o relatório.');
        return;
    }

    try {
        // Create a deep copy of the session to avoid mutating the original state
        const processedSession = JSON.parse(JSON.stringify(session));
        
        // Define the keys that hold image URI arrays
        const imageKeys = ['images', 'surge4kv_ident_prints', 'surge15kv_ident_prints'];

        // Process all image arrays in parallel
        for (const key of imageKeys) {
            if (processedSession.checklist[key] && Array.isArray(processedSession.checklist[key])) {
                const uris: string[] = processedSession.checklist[key];
                const base64Images = await Promise.all(
                    uris.map(uri => convertImageToBase64(uri))
                );
                // Replace the array of URIs with an array of base64 strings, filtering out any nulls
                processedSession.checklist[key] = base64Images.filter(b64 => b64 !== null);
            }
        }

        const logoBase64 = await convertLogoToBase64();
        const html = createPdfContent(processedSession, logoBase64);

        const { uri } = await Print.printToFileAsync({ html });

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
