import { CustomButton } from '@/src/components/ui/Button';
import { ProductSelect } from '@/src/components/ui/Select/ProductSelect';
import { generatePdf } from '@/src/report/pdf/reportGenerator';
import { useSessionStore } from '@/src/store/sessionStore';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, TextInput, ScrollView } from 'react-native';
import { styles } from './styles';

type RootStackParamList = {
    Home: undefined;
    Entry: { id: string };
    Miliohmimetro: { id: string };
    Megohmetro: { id: string };
    Surge4kv: { id: string };
    Surge15kv: { id: string };
};

type EntryScreenRouteProp = RouteProp<RootStackParamList, 'Entry'>;
type EntryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Entry'>;

export default function EntryScreen() {
    const navigation = useNavigation<EntryScreenNavigationProp>();
    const route = useRoute<EntryScreenRouteProp>();
    const { id } = route.params;

    const { sessions, updateSession } = useSessionStore();
    const session = sessions.find(s => s.id === id);

    const [osNumber, setOsNumber] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [productModel, setProductModel] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    useEffect(() => {
        if (session) {
            setOsNumber(session.osNumber || '');
            setSerialNumber(session.serialNumber || '');
            setProductModel(session.productModel || '');
        }
    }, [session]);

    const handleSaveAndNavigate = async () => {
        if (!session) return;

        if (!productModel) {
            Alert.alert('Atenção', 'Selecione um produto para continuar.');
            return;
        }

        setIsSaving(true);
        await updateSession(session.id, {
            osNumber,
            serialNumber,
            productModel,
            name: `OS ${osNumber} - ${session.clientName || 'Cliente'}`
        });
        setIsSaving(false);

        if (productModel === 'Miliohmimetro') {
            navigation.navigate('Miliohmimetro', { id });
        } else if (productModel === 'Megohmetro') {
            navigation.navigate('Megohmetro', { id });
        } else if (productModel === 'Surge test 4kv') {
            navigation.navigate('Surge4kv', { id });
        } else if (productModel === 'Surge Test 15kv') {
            navigation.navigate('Surge15kv', { id });
        } else {
            Alert.alert('Atenção', 'Checklist para este produto ainda não implementado.');
        }
    };

    const handleGenerateReport = async () => {
        if (!session) {
            Alert.alert('Erro', 'Sessão não encontrada.');
            return;
        }
        setIsGeneratingReport(true);
        try {
            await generatePdf(session);
        } catch (error) {
            console.error('Failed to generate report:', error);
            Alert.alert('Erro', 'Não foi possível gerar o relatório. Tente novamente.');
        } finally {
            setIsGeneratingReport(false);
        }
    }

    if (!session) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.mainContent}>
                <Text style={styles.title}>Configuração da Inspeção</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Número da OP</Text>
                    <TextInput
                        style={styles.input}
                        value={osNumber}
                        onChangeText={setOsNumber}
                        placeholder="Ex: 12345"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Número de Série</Text>
                    <TextInput
                        style={styles.input}
                        value={serialNumber}
                        onChangeText={setSerialNumber}
                        placeholder="Ex: SN-9999"
                    />
                </View>

                <ProductSelect
                    label="Modelo do Equipamento"
                    value={productModel}
                    onSelect={setProductModel}
                />

                <CustomButton
                    title={isSaving ? "Salvando..." : "Ir para o Checklist"}
                    onPress={handleSaveAndNavigate}
                    isLoading={isSaving}
                    disabled={!osNumber || !serialNumber || !productModel || isGeneratingReport}
                />
            </View>

            <View style={styles.footer}>
                <CustomButton
                    title={isGeneratingReport ? "Gerando Relatório..." : "Gerar Relatório"}
                    onPress={handleGenerateReport}
                    isLoading={isGeneratingReport}
                    disabled={isGeneratingReport}
                />
                <View style={{ height: 16 }} />
                <CustomButton
                    title="Voltar para Home"
                    onPress={() => navigation.navigate('Home')}
                />
            </View>
        </ScrollView>
    );
}
