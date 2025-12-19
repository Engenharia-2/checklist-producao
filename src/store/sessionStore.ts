import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { initDatabase } from '../database';
import { sessionService } from '../services/sessionService';
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
            await initDatabase();
            const sessions = await sessionService.getSessions();
            set({ sessions });
        } catch (error) {
            console.error('Failed to init store:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    createSession: async (clientName: string, osNumber: string) => {
        set({ isCreating: true });

        const newId = uuidv4();
        const newSession: Session = {
            id: newId,
            name: `OS ${osNumber} - ${clientName}`,
            clientName,
            osNumber,
            startDate: new Date().toISOString(),
            status: 'aberta',
            items: [],
            checklist: {},
        };

        try {
            await sessionService.createSession(newSession);
            const sessions = await sessionService.getSessions(); // Refresh list
            set({ sessions });
            return newId;
        } catch (error) {
            console.error('Error creating session:', error);
            throw error;
        } finally {
            set({ isCreating: false });
        }
    },

    updateSession: async (id: string, updates: Partial<Session>) => {
        try {
            await sessionService.updateSession(id, updates);

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
            await sessionService.deleteSession(id);
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
            s.name.toLowerCase().includes(lowerQuery) ||
            s.osNumber.toLowerCase().includes(lowerQuery) ||
            s.clientName.toLowerCase().includes(lowerQuery)
        );
    },

    updateChecklistItem: async (sessionId: string, items: Record<string, any>) => {
        const { sessions } = get();
        const session = sessions.find(s => s.id === sessionId);
        if (!session) return;

        const currentChecklist = session.checklist || {};
        const newChecklist = { ...currentChecklist, ...items };

        // Optimistic update
        const updatedSessions = sessions.map(s =>
            s.id === sessionId ? { ...s, checklist: newChecklist } : s
        );
        set({ sessions: updatedSessions });

        // Persist
        await sessionService.updateSession(sessionId, { checklist: newChecklist });
    },
}));
