import { Session } from "../../types/session";

export type ReportData = Session;

export interface AttachedImage {
    id?: string | number;
    uri: string;
    status?: 'uploading' | 'uploaded' | 'error' | 'deleting';
}
