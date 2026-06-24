import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { apiService } from '@/src/services/apiService';

interface UseInspectionFormProps {
    visible: boolean;
    initialData?: { osNumber: string; serialNumber: string; formName: string; formId: string };
    onSubmit: (data: { osNumber: string; serialNumber: string; formName: string; formId: string }) => Promise<void>;
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
    };
};
