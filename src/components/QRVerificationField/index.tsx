import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QrScannerModal } from '../Camera';
import { CustomButton } from '../ui/Button';
import {
    buildQRVerificationValue,
    parseQRCode,
    ParsedQRCode,
    QR_SCAN_ORDER,
    QRVerificationValue,
} from '../../utils/qrVerification';
import { styles } from './styles';

interface QRVerificationFieldProps {
    field: any;
    value: QRVerificationValue | null | undefined;
    onFieldChange: (fieldId: string, value: QRVerificationValue) => void;
    editable?: boolean;
}

const showScanAlert = (title: string, message: string): Promise<false> => (
    new Promise(resolve => {
        let wasResolved = false;
        const resolveAfterDismiss = () => {
            if (wasResolved) return;
            wasResolved = true;
            resolve(false);
        };

        Alert.alert(
            title,
            message,
            [{ text: 'OK', onPress: resolveAfterDismiss }],
            { cancelable: true, onDismiss: resolveAfterDismiss }
        );
    })
);

export const QRVerificationField: React.FC<QRVerificationFieldProps> = ({
    field,
    value,
    onFieldChange,
    editable = true,
}) => {
    const savedScans = useMemo(
        () => Array.isArray(value?.scans) ? value.scans : [],
        [value]
    );
    const [scannerVisible, setScannerVisible] = useState(false);
    const [workingScans, setWorkingScans] = useState<ParsedQRCode[]>(savedScans);
    const verification = buildQRVerificationValue(workingScans);

    useEffect(() => {
        if (!scannerVisible) {
            setWorkingScans(savedScans);
        }
    }, [savedScans, scannerVisible]);

    const openScanner = () => {
        if (!editable) return;

        if (workingScans.length >= 3) {
            setWorkingScans([]);
        }

        setScannerVisible(true);
    };

    const handleScan = async (rawValue: string): Promise<boolean> => {
        const parsed = parseQRCode(rawValue);

        if (!parsed) {
            return showScanAlert(
                'QR Code não reconhecido',
                'O conteúdo lido não corresponde aos formatos esperados para NF-e/OP/PV ou número de série/OP.'
            );
        }

        if (workingScans.length >= 3) return false;

        const expectedType = QR_SCAN_ORDER[workingScans.length];
        if (parsed.type !== expectedType) {
            const expectedLabel = expectedType === 'serial_op'
                ? 'a etiqueta com número de série e OP'
                : 'uma etiqueta com NF-e, OP e Pedido de Venda';

            return showScanAlert(
                'Etiqueta fora da ordem',
                `Nesta etapa, leia ${expectedLabel}.`
            );
        }

        const nextScans = [...workingScans, parsed];
        const nextValue = buildQRVerificationValue(nextScans);
        setWorkingScans(nextScans);

        if (nextScans.length === 3) {
            onFieldChange(field.id, nextValue);
            setScannerVisible(false);
        }

        return true;
    };

    const buttonTitle = workingScans.length === 0
        ? 'Ler QR Codes'
        : workingScans.length < 3
            ? 'Continuar leitura'
            : 'Ler novamente';

    const scanInstructions = [
        'Leia a primeira etiqueta com NF-e, OP e Pedido de Venda.',
        'Leia a etiqueta com número de série e OP.',
        'Leia a segunda etiqueta com NF-e, OP e Pedido de Venda.',
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{field.label || 'Verificação de QR Codes'}</Text>

            {verification.isValid ? (
                <View style={[styles.statusCard, styles.statusCardSuccess]}>
                    <Ionicons name="checkmark-circle" size={24} color="#237804" />
                    <Text style={styles.successText}>QR Codes lidos e validados com sucesso.</Text>
                </View>
            ) : workingScans.length === 3 ? (
                <View style={[styles.statusCard, styles.statusCardError]}>
                    <Ionicons name="alert-circle" size={24} color="#cf1322" />
                    <View style={styles.statusTextContainer}>
                        <Text style={styles.errorTitle}>Divergência encontrada</Text>
                        {verification.errors.map(error => (
                            <Text key={error} style={styles.errorText}>• {error}</Text>
                        ))}
                    </View>
                </View>
            ) : (
                <Text style={styles.pendingText}>{workingScans.length}/3 QR Codes lidos</Text>
            )}

            {editable && <CustomButton title={buttonTitle} onPress={openScanner} />}

            <QrScannerModal
                isVisible={scannerVisible}
                onClose={() => setScannerVisible(false)}
                onScan={handleScan}
                closeOnScan={false}
                completedScans={workingScans.length}
                totalScans={3}
                instructionText={scanInstructions[workingScans.length] || scanInstructions[2]}
            />
        </View>
    );
};

export default QRVerificationField;
