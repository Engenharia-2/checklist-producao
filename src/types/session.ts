export type SessionStatus = 'aberta' | 'finalizada';

export interface Session {
    id: string;
    name: string;
    clientName: string;
    osNumber: string;
    startDate: string; // ISO string
    endDate?: string; // ISO string
    serialNumber?: string;
    productModel?: string;
    status: SessionStatus;
    items: any[]; // To be defined later
    checklist: Record<string, any>; // Stores step data
}
