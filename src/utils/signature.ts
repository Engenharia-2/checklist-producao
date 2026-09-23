const LEGACY_SIGNATURE_LABELS = new Set([
    'Novo signature',
    'Nova Assinatura',
]);

export const normalizeSignatureLabel = (label?: string | null): string => {
    if (!label || LEGACY_SIGNATURE_LABELS.has(label)) {
        return 'Assinatura';
    }

    return label;
};
