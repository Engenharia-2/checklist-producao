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

    createSession: async () => {
        try {
            const response = await fetch(`${BASE_URL}/sessions`, { method: 'POST' });
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

            if (!response.ok) throw new Error('Falha no upload da imagem');
            const data = await response.json();
            return `${BASE_URL}${data.url}`;
        } catch (error) {
            console.error('[apiService] Error uploading image:', error);
            return null;
        }
    }
};
