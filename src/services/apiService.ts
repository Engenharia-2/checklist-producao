// Checklist-Producao/src/services/apiService.ts

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiService = {
    getFormDefinitions: async () => {
        try {
            const response = await fetch(`${BASE_URL}/forms`);
            if (!response.ok) throw new Error('Falha ao buscar formulários');
            return await response.json();
        } catch (error) {
            console.error('[apiService] Error fetching forms:', error);
            return [];
        }
    },

    getFormById: async (id: string) => {
        try {
            const response = await fetch(`${BASE_URL}/forms/${id}`);
            // Se o formulário não existir (foi deletado), retornamos null silenciosamente
            if (response.status === 404) return null;
            
            if (!response.ok) throw new Error('Falha ao buscar detalhes do formulário');
            return await response.json();
        } catch (error) {
            console.error('[apiService] Error fetching form details:', error);
            return null;
        }
    },

    // Session Endpoints (Substituindo o SQLite local)
    getSessions: async () => {
        try {
            const response = await fetch(`${BASE_URL}/sessions`);
            if (!response.ok) throw new Error('Falha ao buscar sessões');
            return await response.json();
        } catch (error) {
            console.error('[apiService] Error fetching sessions:', error);
            return [];
        }
    },

    createSession: async (initialData?: { osNumber?: string; serialNumber?: string; formName?: string; formId?: string }) => {
        try {
            const response = await fetch(`${BASE_URL}/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: initialData ? JSON.stringify(initialData) : undefined,
            });
            if (!response.ok) throw new Error('Falha ao criar sessão');
            return await response.json();
        } catch (error) {
            console.error('[apiService] Error creating session:', error);
            return null;
        }
    },

    updateSession: async (id: string, updates: any) => {
        try {
            const response = await fetch(`${BASE_URL}/sessions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Falha ao atualizar sessão');
            return await response.json();
        } catch (error) {
            console.error('[apiService] Error updating session:', error);
            return null;
        }
    },

    deleteSession: async (id: string) => {
        try {
            const response = await fetch(`${BASE_URL}/sessions/${id}`, { method: 'DELETE' });
            return response.ok;
        } catch (error) {
            console.error('[apiService] Error deleting session:', error);
            return false;
        }
    },

    uploadImage: async (uri: string) => {
        try {
            const formData = new FormData();
            const filename = uri.split('/').pop() || 'image.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            // @ts-ignore
            formData.append('image', {
                uri,
                name: filename,
                type,
            });

            const response = await fetch(`${BASE_URL}/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    // Importante: NÃO definir 'Content-Type': 'multipart/form-data' manualmente.
                    // O 'fetch' do React Native precisa definir isso automaticamente para incluir o 'boundary'.
                },
            });

            if (!response.ok) {
                let errorBody = '';
                try {
                    errorBody = await response.text();
                } catch (e) {
                    errorBody = '(Não foi possível ler o corpo da resposta de erro)';
                }
                throw new Error(`Falha no upload da imagem. Status: ${response.status}. Detalhes: ${errorBody}`);
            }

            const data = await response.json();
            return `${BASE_URL}${data.url}`;
        } catch (error: any) {
            return null;
        }
    },

    uploadPdf: async (uri: string, opNumber: string, formName?: string, serialNumber?: string) => {
        try {
            const formData = new FormData();
            const filename = uri.split('/').pop() || `OP-${opNumber}.pdf`;

            // @ts-ignore
            formData.append('pdf', {
                uri,
                name: filename,
                type: 'application/pdf',
            });
            
            if (formName) formData.append('formName', formName);
            if (serialNumber) formData.append('serialNumber', serialNumber);

            // Envia para uma rota específica de PDFs na API
            const response = await fetch(`${BASE_URL}/upload-pdf`, {
                method: 'POST',
                body: formData,
                headers: {
                    // O React Native define o Content-Type multipart/form-data automaticamente
                },
            });

            if (!response.ok) {
                let errorBody = '';
                try {
                    errorBody = await response.text();
                } catch (e) {
                    errorBody = '(Sem detalhes)';
                }
                throw new Error(`Falha no upload do PDF. Status: ${response.status}. Detalhes: ${errorBody}`);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error('[apiService] Error uploading PDF:', error);
            return null;
        }
    },

    deleteImage: async (imageUrl: string) => {
        try {
            // Extrai o nome do arquivo da URL e limpa possíveis query parameters
            const cleanUrl = imageUrl.split('?')[0].split('#')[0];
            const filename = cleanUrl.split('/').pop();
            if (!filename) return false;

            const response = await fetch(`${BASE_URL}/upload/${filename}`, {
                method: 'DELETE',
            });

            return response.ok;
        } catch (error) {
            console.error('[apiService] Error deleting image:', error);
            return false;
        }
    }
};
