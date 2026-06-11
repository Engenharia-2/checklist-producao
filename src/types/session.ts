export type SessionStatus = 'aberta' | 'finalizada';

export interface Session {
    id: string;
    formName: string;
    osNumber: string;
    startDate: string; // ISO string
    endDate?: string; // ISO string
    serialNumber?: string;
    formId?: string;
    status: SessionStatus;
    items: any[]; // To be defined later
    checklist: Record<string, any>; // Stores step data
}
