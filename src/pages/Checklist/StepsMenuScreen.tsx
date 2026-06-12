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
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.subtitle}>{session?.formName}</Text>

                <View style={styles.stepsList}>
                    {steps.map((step: any) => {
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
                                {complete && (
                                    <Ionicons name="checkmark-circle" size={24} color="#21ce49" style={styles.checkIcon} />
                                )}
                                
                                <Text style={styles.stepTitle}>{step.title}</Text>
                                
                                <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.chevronIcon} />
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
        flexGrow: 1,
    },
    title: {
        display: 'none', // Removido conforme solicitado
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        paddingTop: 30,
        marginBottom: 30,
    },
    stepsList: {
        flex: 1,
    },
    stepCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        flex: 1,
        minHeight: 100,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        position: 'relative',
    },
    stepTitle: {
        fontSize: 20,
        color: '#333',
        fontWeight: '600',
        textAlign: 'center',
        paddingHorizontal: 30,
    },
    checkIcon: {
        position: 'absolute',
        left: 20,
    },
    chevronIcon: {
        position: 'absolute',
        right: 20,
    },
    footer: {
        marginTop: 'auto',
        paddingTop: 20,
    }
});
