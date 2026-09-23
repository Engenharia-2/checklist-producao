import { convertImageToBase64, convertSignatureToBase64 } from './imageUtils';

/**
 * ReportImageProcessor
 * 
 * Responsável por percorrer as respostas de um formulário dinâmico,
 * identificar campos de imagem e assinatura baseados no schema e converter seus URIs para Base64.
 */
export const ReportImageProcessor = {
    /**
     * Processa todas as imagens e assinaturas das respostas de uma sessão.
     * @param schema O schema do formulário (contendo os campos e tipos)
     * @param answers O objeto de respostas da sessão
     * @returns Uma cópia das respostas com URIs substituídos por Base64
     */
    processAnswersImages: async (schema: any, answers: Record<string, any>) => {
        if (!schema || !schema.steps || !answers) {
            return answers;
        }

        // Deep copy para não afetar o estado original da aplicação
        const processedAnswers = JSON.parse(JSON.stringify(answers));
        
        // Identifica todos os IDs de campos de imagem e assinatura no schema
        const imageFieldIds: string[] = [];
        const signatureFieldIds: string[] = [];
        schema.steps.forEach((step: any) => {
            if (step.fields) {
                step.fields.forEach((field: any) => {
                    if (field.type === 'image') {
                        imageFieldIds.push(field.id);
                    } else if (field.type === 'signature') {
                        signatureFieldIds.push(field.id);
                    }
                });
            }
        });

        // Para cada campo de imagem identificado, converte os URIs em Base64
        for (const fieldId of imageFieldIds) {
            const uris = processedAnswers[fieldId];
            
            if (uris && Array.isArray(uris) && uris.length > 0) {
                console.log(`[ReportImageProcessor] Convertendo ${uris.length} imagens para o campo: ${fieldId}`);
                
                const base64Images = await Promise.all(
                    uris.map(async (uri: any) => {
                        // Verifica se já não é base64 (prevenção)
                        if (typeof uri === 'string' && uri.startsWith('data:image')) {
                            return uri;
                        }
                        return await convertImageToBase64(uri);
                    })
                );

                // Filtra possíveis nulos em caso de erro na conversão
                processedAnswers[fieldId] = base64Images.filter(img => img !== null);
            }
        }

        // A assinatura possui um único URI e preserva o formato PNG para manter a transparência
        for (const fieldId of signatureFieldIds) {
            const signatureUri = processedAnswers[fieldId];

            if (typeof signatureUri !== 'string' || !signatureUri.trim() || signatureUri.startsWith('data:image')) {
                continue;
            }

            console.log(`[ReportImageProcessor] Convertendo assinatura para o campo: ${fieldId}`);
            const base64Signature = await convertSignatureToBase64(signatureUri);

            // Mantém o URI original como fallback caso a conversão falhe
            if (base64Signature) {
                processedAnswers[fieldId] = base64Signature;
            }
        }

        return processedAnswers;
    }
};
