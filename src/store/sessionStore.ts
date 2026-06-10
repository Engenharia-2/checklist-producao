import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { apiService } from '../services/apiService';
import { Session } from '../types/session';

interface SessionState {
    sessions: Session[];
    isCreating: boolean;
    isLoading: boolean;

    initializeStore: () => Promise<void>;
    createSession: (clientName: string, osNumber: string) => Promise<string>;
    deleteSession: (id: string) => Promise<void>;
    getFilteredSessions: (query: string) => Session[];
    updateSession: (id: string, updates: Partial<Session>) => Promise<void>;
    updateChecklistItem: (sessionId: string, items: Record<string, any>) => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
    sessions: [],
    isCreating: false,
    isLoading: false,

    initializeStore: async () => {
        set({ isLoading: true });
        try {
            // Busca diretamente da API central agora
            const sessions = await apiService.getSessions();
            set({ sessions });
        } catch (error) {
            console.error('Failed to init store:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    createSession: async (clientName: string, osNumber: string) => {
        set({ isCreating: true });

        try {
            // Cria a sessão na API Central
            const newSessionApi = await apiService.createSession();
            
            if (!newSessionApi) throw new Error("Falha ao criar na API");

            // Atualiza a sessão com os metadados iniciais
            const updates = {
                clientName,
                osNumber,
                name: `OS ${osNumber} - ${clientName}`
            };
            
            await apiService.updateSession(newSessionApi.id, updates);
            
            // Recarrega a lista do servidor
            await get().initializeStore();
            return newSessionApi.id;
        } catch (error) {
            console.error('Error creating session:', error);
            throw error;
        } finally {
            set({ isCreating: false });
        }
    },

    updateSession: async (id: string, updates: Partial<Session>) => {
        try {
            await apiService.updateSession(id, updates);

            set((state) => ({
                sessions: state.sessions.map((s) =>
                    s.id === id ? { ...s, ...updates } : s
                ),
            }));
        } catch (error) {
            console.error('Error updating session:', error);
        }
    },

    deleteSession: async (id: string) => {
        try {
            await apiService.deleteSession(id);
            set((state) => ({
                sessions: state.sessions.filter((s) => s.id !== id),
            }));
        } catch (error) {
            console.error('Error deleting session:', error);
        }
    },

    getFilteredSessions: (query: string) => {
        const { sessions } = get();
        if (!query) return sessions;

        const lowerQuery = query.toLowerCase();
        return sessions.filter((s) =>
            (s.name && s.name.toLowerCase().includes(lowerQuery)) ||
            (s.osNumber && s.osNumber.toLowerCase().includes(lowerQuery)) ||
            (s.clientName && s.clientName.toLowerCase().includes(lowerQuery))
        );
    },

    updateChecklistItem: async (sessionId: string, items: Record<string, any>) => {
        const { sessions } = get();
        const session = sessions.find(s => s.id === sessionId);
        if (!session) return;

        // O campo JSON agora é 'answers' de acordo com a API
        const currentAnswers = (session as any).answers || {};
        const newAnswers = { ...currentAnswers, ...items };

        // Optimistic update
        const updatedSessions = sessions.map(s =>
            s.id === sessionId ? { ...s, answers: newAnswers } : s
        );
        set({ sessions: updatedSessions });

        // Persist na API Central
        await apiService.updateSession(sessionId, { answers: newAnswers });
    },
}));
