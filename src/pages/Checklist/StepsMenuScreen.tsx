import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSessionStore } from '@/src/store/sessionStore';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '@/src/components/ui/Button';

type RootStackParamList = {
    Home: undefined;
    Entry: { id: string };
    StepsMenu: { id: string; formId: string };
    DynamicForm: { id: string; formId: string; stepId: string };
};

type StepsMenuRouteProp = RouteProp<RootStackParamList, 'StepsMenu'>;
type StepsMenuNavigationProp = StackNavigationProp<RootStackParamList, 'StepsMenu'>;

export default function StepsMenuScreen() {
    const route = useRoute<StepsMenuRouteProp>();
    const navigation = useNavigation<StepsMenuNavigationProp>();
    const { id: sessionId } = route.params;

    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const answers = (session as any)?.answers || {};
    
    // Supondo que o schema do formulário já venha no objeto session se carregado, 
    // ou precisamos de um pequeno hook para garantir o schema.
    // Por simplicidade aqui, vamos assumir que o schema está acessível ou buscado.
    const steps = (session as any)?.formDefinition?.schema?.steps || [];

    const isStepComplete = (step: any) => {
        if (!step.fields || step.fields.length === 0) return true;
        // Verifica se todos os campos daquela etapa possuem resposta
        return step.fields.every((field: any) => {
            const val = answers[field.id];
            if (field.type === 'image') return Array.isArray(val) && val.length > 0;
            if (field.type === 'checkbox') return val === true; // Checkbox geralmente precisa estar marcado para "completo"
            return val !== undefined && val !== null && val !== '';
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>Etapas da Inspeção</Text>
            <Text style={styles.subtitle}>{session?.formName}</Text>

            <View style={styles.stepsList}>
                {steps.map((step: any, index: number) => {
                    const complete = isStepComplete(step);
                    return (
                        <TouchableOpacity 
                            key={step.id} 
                            style={styles.stepCard}
                            onPress={() => navigation.navigate('DynamicForm', { 
                                id: sessionId, 
                                formId: (session as any).formId,
                                stepId: step.id 
                            })}
                        >
                            <View style={styles.stepInfo}>
                                <Text style={styles.stepNumber}>{index + 1}</Text>
                                <Text style={styles.stepTitle}>{step.title}</Text>
                            </View>
                            {complete && (
                                <Ionicons name="checkmark-circle" size={28} color="#21ce49" />
                            )}
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={styles.footer}>
                <CustomButton 
                    title="Voltar para Home" 
                    onPress={() => navigation.navigate('Home')}
                    variant="secondary"
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    stepsList: {
        marginTop: 10,
    },
    stepCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    stepInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    stepNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1890ff',
        marginRight: 15,
        width: 25,
    },
    stepTitle: {
        fontSize: 18,
        color: '#444',
        fontWeight: '500',
    },
    footer: {
        marginTop: 30,
    }
});
