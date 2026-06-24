import React from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { CustomButton } from '@/src/components/ui/Button';
import { ComponentFactory } from '@/src/components/Checklist/ComponentFactory';
import { useDynamicForm } from '@/src/hooks/useDynamicForm';
import { styles } from './styles';

type RootStackParamList = {
    Home: undefined;
    Entry: { id: string };
    StepsMenu: { id: string; formId: string };
    DynamicForm: { id: string; formId: string; stepId?: string };
};

type DynamicFormRouteProp = RouteProp<RootStackParamList, 'DynamicForm'>;

export default function DynamicFormScreen() {
    const route = useRoute<DynamicFormRouteProp>();
    const navigation = useNavigation();
    const { id: sessionId, formId, stepId } = route.params;

    const { 
        schema, 
        activeFields,
        stepTitle,
        isLoading, 
        answers, 
        session, 
        handleFieldChange 
    } = useDynamicForm(sessionId, formId, stepId);

    if (isLoading || !session) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#1890ff" />
                <Text style={{ marginTop: 10 }}>Carregando formulário dinâmico...</Text>
            </View>
        );
    }

    if (!activeFields || activeFields.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Esta etapa não possui campos configurados.</Text>
                <CustomButton title="Voltar" onPress={() => navigation.goBack()} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

            {activeFields.map((field: any) => (
                <ComponentFactory
                    key={field.id}
                    field={field}
                    value={answers[field.id]}
                    sessionId={sessionId}
                    onFieldChange={handleFieldChange}
                />
            ))}

            <View style={styles.footer}>
                <CustomButton
                    title="Salvar e Voltar"
                    onPress={() => navigation.goBack()}
                />
            </View>
        </ScrollView>
    );
}
