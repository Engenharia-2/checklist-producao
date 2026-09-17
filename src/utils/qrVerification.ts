export type QRCodeKind = 'nfe_op_pv' | 'serial_op';

export interface ParsedQRCode {
    raw: string;
    type: QRCodeKind;
    op: string;
    nfe?: string;
    salesOrder?: string;
    serialNumber?: string;
}

export interface QRVerificationValue {
    version: 1;
    scans: ParsedQRCode[];
    isValid: boolean;
    opMatches: boolean;
    nfeMatches: boolean;
    errors: string[];
}

const normalizeQRCode = (value: string) => value.trim().replace(/\s+/g, ' ').toUpperCase();

export const parseQRCode = (rawValue: string): ParsedQRCode | null => {
    const normalized = normalizeQRCode(rawValue);

    const nfeMatch = normalized.match(/^(\d+)\s+OP\s*(\d+)\s+PV\s*(\d+)$/i);
    if (nfeMatch) {
        return {
            raw: rawValue.trim(),
            type: 'nfe_op_pv',
            nfe: nfeMatch[1],
            op: nfeMatch[2],
            salesOrder: nfeMatch[3],
        };
    }

    const serialMatch = normalized.match(/^([A-Z0-9]+(?:-[A-Z0-9]+){2,})\s+OP\s*(\d+)$/i);
    if (serialMatch) {
        return {
            raw: rawValue.trim(),
            type: 'serial_op',
            serialNumber: serialMatch[1],
            op: serialMatch[2],
        };
    }

    return null;
};

export const buildQRVerificationValue = (scans: ParsedQRCode[]): QRVerificationValue => {
    const limitedScans = scans.slice(0, 3);
    const errors: string[] = [];
    const opValues = limitedScans.map(scan => scan.op);
    const nfeValues = limitedScans
        .filter(scan => scan.nfe !== undefined)
        .map(scan => scan.nfe as string);
    const serialScans = limitedScans.filter(scan => scan.type === 'serial_op');

    const opMatches = limitedScans.length === 3 && new Set(opValues).size === 1;
    const nfeMatches = nfeValues.length >= 2 && new Set(nfeValues).size === 1;

    if (limitedScans.length < 3) {
        errors.push(`Leia os ${3 - limitedScans.length} QR Code(s) restante(s).`);
    } else {
        if (!opMatches) {
            errors.push('Os números de OP não correspondem entre os QR Codes.');
        }
        if (nfeValues.length < 2) {
            errors.push('Não há duas etiquetas com NF-e para realizar a comparação.');
        } else if (!nfeMatches) {
            errors.push('Os números de NF-e não correspondem entre os QR Codes.');
        }
        if (serialScans.length === 0) {
            errors.push('O QR Code com número de série não foi identificado.');
        }
    }

    return {
        version: 1,
        scans: limitedScans,
        isValid: limitedScans.length === 3 && opMatches && nfeMatches && serialScans.length > 0,
        opMatches,
        nfeMatches,
        errors,
    };
};
