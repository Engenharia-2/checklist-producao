import React, { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { styles } from './style';

interface QrScannerModalProps {
    isVisible: boolean;
    onClose: () => void;
    onScan: (data: string) => boolean | void;
    closeOnScan?: boolean;
    completedScans?: number;
    totalScans?: number;
    instructionText?: string;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
    isVisible,
    onClose,
    onScan,
    closeOnScan = true,
    completedScans = 0,
    totalScans = 1,
    instructionText = 'Posicione o QR Code dentro do quadrado acima.',
}) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [isScanPaused, setIsScanPaused] = useState(false);
    const [lastScanAccepted, setLastScanAccepted] = useState(true);

    useEffect(() => {
        if (isVisible) {
            setIsScanPaused(false);
            setLastScanAccepted(true);
        }
    }, [isVisible]);

    useEffect(() => {
        const shouldResumeMultiScan = !closeOnScan && completedScans < totalScans;
        const shouldRetrySingleScan = closeOnScan && !lastScanAccepted;

        if (!isScanPaused || (!shouldResumeMultiScan && !shouldRetrySingleScan)) return;

        const resumeTimer = setTimeout(() => {
            setIsScanPaused(false);
        }, 1000);

        return () => clearTimeout(resumeTimer);
    }, [closeOnScan, completedScans, isScanPaused, lastScanAccepted, totalScans]);

    const handleBarcodeScanned = (data: string) => {
        if (!data || isScanPaused) return;

        const accepted = onScan(data) !== false;
        setLastScanAccepted(accepted);

        if (closeOnScan && accepted) {
            onClose();
            return;
        }

        setIsScanPaused(true);
    };

    // Se estiver invisível, nem renderiza
    if (!isVisible) return null;

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={isVisible}
                onRequestClose={onClose}
            >
                <View style={styles.permissionContainer}>
                    <Text style={styles.permissionText}>
                        Precisamos de permissão para acessar a câmera e ler o QR Code da OP/Número de Série.
                    </Text>
                    <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                        <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                    }}
                    onBarcodeScanned={isScanPaused ? undefined : ({ data }) => handleBarcodeScanned(data)}
                />
                
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>

                <View style={styles.overlayContainer} pointerEvents="box-none">
                    <View style={styles.scanArea} />
                    <Text style={styles.instructionText}>
                        {instructionText}
                    </Text>
                </View>

                {totalScans > 1 && (
                    <View style={styles.scanProgressContainer}>
                        <View style={styles.scanProgressRow}>
                            {Array.from({ length: totalScans }, (_, index) => {
                                const isComplete = index < completedScans;
                                return (
                                    <View
                                        key={index}
                                        style={[styles.scanProgressCircle, isComplete && styles.scanProgressCircleComplete]}
                                    >
                                        {isComplete && <Text style={styles.scanProgressCheck}>✓</Text>}
                                    </View>
                                );
                            })}
                        </View>

                        {!closeOnScan && isScanPaused && completedScans < totalScans && (
                            <View style={styles.nextScanMessage}>
                                <Text style={styles.nextScanMessageText}>
                                    {lastScanAccepted
                                        ? 'Posicione o próximo QR Code...'
                                        : 'Nova tentativa em 1 segundo...'}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </Modal>
    );
};

export default QrScannerModal;
