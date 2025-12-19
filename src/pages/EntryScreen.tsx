import { CustomButton } from '@/src/components/ui/Button';
import { ProductSelect } from '@/src/components/ui/Select/ProductSelect';
import { generatePdf } from '@/src/report/pdf/reportGenerator';
import { useSessionStore } from '@/src/store/sessionStore';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import styled from 'styled-components/native';

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

const Container = styled.ScrollView.attrs({
    contentContainerStyle: {
        flexGrow: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
    }
})`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const MainContent = styled.View`
    flex: 1;
`;

const Footer = styled.View`
    padding-top: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const InputGroup = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.Text`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: bold;
`;

const Input = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text};
`;

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

        if (!productModel) { // Using productModel as selectedProduct
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

        // Navigate to specific checklist based on selection
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
            <Container>
                <ActivityIndicator size="large" color="#000" />
            </Container>
        );
    }

    return (
        <Container>
            <MainContent>
                <Title>Configuração da Inspeção</Title>

                <InputGroup>
                    <Label>Número da OP</Label>
                    <Input
                        value={osNumber}
                        onChangeText={setOsNumber}
                        placeholder="Ex: 12345"
                        keyboardType="numeric"
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Número de Série</Label>
                    <Input
                        value={serialNumber}
                        onChangeText={setSerialNumber}
                        placeholder="Ex: SN-9999"
                    />
                </InputGroup>

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
            </MainContent>

            <Footer>
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
            </Footer>
        </Container>
    );
}
