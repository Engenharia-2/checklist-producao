import { CustomButton } from '@/src/components/ui/Button';
import { CustomDropdown } from '@/src/components/ui/Select/CustomDropdown';
import { useReportGenerator } from '@/src/hooks/useReportGenerator';
import { useEntryForm } from '@/src/hooks/useEntryForm';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View, Text, TextInput, ScrollView } from 'react-native';
import { styles } from './styles';

type RootStackParamList = {
    Home: undefined;
    Entry: { id: string };
    DynamicForm: { id: string; formId: string };
};

type EntryScreenRouteProp = RouteProp<RootStackParamList, 'Entry'>;

export default function EntryScreen() {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<EntryScreenRouteProp>();
    const { id } = route.params;

    const {
        session,
        osNumber,
        setOsNumber,
        serialNumber,
        setSerialNumber,
        productModel,
        products,
        isLoadingProducts,
        handleSelectProduct,
        isSaving,
        handleSaveAndNavigate,
    } = useEntryForm(id);

    const { isGenerating: isGeneratingReport, generateReport } = useReportGenerator();

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

                <CustomDropdown
                    label="Modelo do Equipamento"
                    value={productModel}
                    placeholder="Selecione um equipamento"
                    options={products}
                    isLoading={isLoadingProducts}
                    onSelect={handleSelectProduct}
                    emptyMessage="Nenhum formulário encontrado no servidor."
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
                    onPress={() => generateReport(session)}
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
