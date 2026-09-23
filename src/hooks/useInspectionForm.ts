import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { apiService } from '@/src/services/apiService';
import { CreateSessionData } from '@/src/types/session';

interface UseInspectionFormProps {
    visible: boolean;
    initialData?: CreateSessionData;
    onSubmit: (data: CreateSessionData) => Promise<void>;
    onClose: () => void;
}

export const useInspectionForm = ({
    visible,
    initialData,
    onSubmit,
    onClose,
}: UseInspectionFormProps) => {
    const [osNumber, setOsNumber] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [equipmentName, setEquipmentName] = useState('');
    const [formId, setFormId] = useState('');
    
    const [products, setProducts] = useState<any[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (visible) {
            setOsNumber(initialData?.osNumber || '');
            setSerialNumber(initialData?.serialNumber || '');
            setEquipmentName(initialData?.formName || '');
            setFormId(initialData?.formId || '');
            
            const fetchProducts = async () => {
                setIsLoadingProducts(true);
                const data = await apiService.getFormDefinitions();
                setProducts(data);
                setIsLoadingProducts(false);
            };
            fetchProducts();
        }
    }, [visible, initialData]);

    const handleSelectProduct = (selectedFormId: string, selectedFormName: string) => {
        setFormId(selectedFormId);
        setEquipmentName(selectedFormName);
    };

    const handleConfirm = async () => {
        if (!osNumber.trim() || !serialNumber.trim() || !formId) {
            Alert.alert('Atenção', 'Preencha todos os campos e selecione um equipamento.');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                osNumber: osNumber.trim(),
                serialNumber: serialNumber.trim(),
                formName: equipmentName,
                formId,
            });
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            Alert.alert('Erro', 'Não foi possível salvar os dados. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQrScanSuccess = (rawData: string, onError?: (msg: string) => void) => {
        const parts = rawData.split('-');
        if (parts.length === 3) {
            setSerialNumber(rawData);
            setOsNumber(parts[1]);
        } else {
            if (onError) {
                onError('O QR Code lido não segue o padrão esperado (ex: 260615-3893-00001).');
            }
        }
    };

    return {
        osNumber,
        setOsNumber,
        serialNumber,
        setSerialNumber,
        equipmentName,
        formId,
        products,
        isLoadingProducts,
        isSubmitting,
        handleSelectProduct,
        handleConfirm,
        handleQrScanSuccess,
    };
};
