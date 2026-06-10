import { useState } from 'react';
import { Alert } from 'react-native';

import { Session } from '../types/session';
import { generatePdf } from '../report/pdf/reportGenerator';

export const useReportGenerator = () => {
    const [isGenerating, setIsGenerating] = useState(false);

    const generateReport = async (session: Session | undefined) => {
        if (!session) {
            Alert.alert('Erro', 'Sessão não encontrada para gerar o relatório.');
            return;
        }

        setIsGenerating(true);
        try {
            await generatePdf(session);
        } catch (error) {
            console.error('Failed to generate report:', error);
            Alert.alert('Erro', 'Não foi possível gerar o relatório. Tente novamente.');
        } finally {
            setIsGenerating(false);
        }
    };

    return { isGenerating, generateReport };
};
