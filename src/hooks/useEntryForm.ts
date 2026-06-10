import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useSessionStore } from '@/src/store/sessionStore';
import { apiService } from '@/src/services/apiService';

type RootStackParamList = {
    Home: undefined;
    Entry: { id: string };
    DynamicForm: { id: string; formId: string };
};

type EntryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Entry'>;

export const useEntryForm = (id: string) => {
    const navigation = useNavigation<EntryScreenNavigationProp>();
    const { sessions, updateSession } = useSessionStore();
    const session = sessions.find(s => s.id === id);

    const [osNumber, setOsNumber] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [productModel, setProductModel] = useState('');
    const [formId, setFormId] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    useEffect(() => {
        if (session) {
            setOsNumber(session.osNumber || '');
            setSerialNumber(session.serialNumber || '');
            setProductModel(session.productModel || '');
            setFormId((session as any).formId || '');
        }
    }, [session]);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoadingProducts(true);
            const data = await apiService.getFormDefinitions();
            setProducts(data);
            setIsLoadingProducts(false);
        };
        fetchProducts();
    }, []);

    const handleSelectProduct = (selectedFormId: string, selectedFormName: string) => {
        setFormId(selectedFormId);
        setProductModel(selectedFormName);
    };

    const handleSaveAndNavigate = async () => {
        if (!session) return;

        if (!productModel || !formId) {
            Alert.alert('Atenção', 'Selecione um equipamento para continuar.');
            return;
        }

        setIsSaving(true);
        await updateSession(session.id, {
            osNumber,
            serialNumber,
            productModel,
            name: `OS ${osNumber} - ${session.clientName || 'Cliente'}`,
            ...({ formId } as any) // Storing formId in session
        });
        setIsSaving(false);

        // All new checklists will go through the DynamicForm interpreter
        navigation.navigate('DynamicForm', { id, formId });
    };

    return {
        session,
        osNumber,
        setOsNumber,
        serialNumber,
        setSerialNumber,
        productModel,
        formId,
        products,
        isLoadingProducts,
        handleSelectProduct,
        isSaving,
        handleSaveAndNavigate,
    };
};

