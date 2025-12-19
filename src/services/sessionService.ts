import { getDBConnection } from '../database';
import { Session } from '../types/session';

export const sessionService = {
    createSession: async (session: Session) => {
        const db = await getDBConnection();
        await db.runAsync(
            `INSERT INTO sessions (id, name, clientName, osNumber, status, startDate) VALUES (?, ?, ?, ?, ?, ?);`,
            session.id, session.name, session.clientName, session.osNumber, session.status, session.startDate
        );
    },

    getSessions: async (): Promise<Session[]> => {
        const db = await getDBConnection();
        const result = await db.getAllAsync<any>('SELECT * FROM sessions ORDER BY startDate DESC;');
        return result.map(row => ({
            ...row,
            checklist: row.checklist ? JSON.parse(row.checklist) : {}
        }));
    },

    updateSession: async (id: string, updates: Partial<Session>) => {
        const db = await getDBConnection();

        // Handle JSON serialization for checklist
        const safeUpdates = { ...updates };
        if (safeUpdates.checklist) {
            (safeUpdates as any).checklist = JSON.stringify(safeUpdates.checklist);
        }

        // Construct dynamic update query
        const fields = Object.keys(safeUpdates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(safeUpdates).map(v => v === undefined ? null : v);

        if (fields.length === 0) return;

        const sql = `UPDATE sessions SET ${fields} WHERE id = ?;`;
        const params = [...values, id];

        console.log('[updateSession] SQL:', sql);
        console.log('[updateSession] Params:', params);

        await db.runAsync(sql, ...params);
    },

    deleteSession: async (id: string) => {
        const db = await getDBConnection();
        await db.runAsync('DELETE FROM sessions WHERE id = ?;', id);
    }
};
