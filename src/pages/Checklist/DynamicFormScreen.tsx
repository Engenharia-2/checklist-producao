import React from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { CustomButton } from '@/src/components/ui/Button';
import { ComponentFactory } from '@/src/components/Checklist/ComponentFactory';
import { useDynamicForm } from '@/src/hooks/useDynamicForm';
import { styles } from './styles';

type RootStackParamList = {
    Home: undefined;
    DynamicForm: { id: string; formId: string };
};

type DynamicFormRouteProp = RouteProp<RootStackParamList, 'DynamicForm'>;

export default function DynamicFormScreen() {
    const route = useRoute<DynamicFormRouteProp>();
    const navigation = useNavigation();
    const { id: sessionId, formId } = route.params;

    const { 
        schema, 
        isLoading, 
        answers, 
        session, 
        handleFieldChange 
    } = useDynamicForm(sessionId, formId);

    if (isLoading || !session) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#1890ff" />
                <Text style={{ marginTop: 10 }}>Carregando formulário dinâmico...</Text>
            </View>
        );
    }

    if (!schema || !schema.fields || schema.fields.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Este formulário não possui campos configurados.</Text>
                <CustomButton title="Voltar" onPress={() => navigation.goBack()} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {schema.fields.map((field: any) => (
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
                    title="Concluir e Salvar"
                    onPress={() => navigation.navigate('Home')}
                />
            </View>
        </ScrollView>
    );
}
