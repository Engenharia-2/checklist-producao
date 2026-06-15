import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSessionStore } from '@/src/store/sessionStore';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '@/src/components/ui/Button';
import { styles } from './styles';

type RootStackParamList = {
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
    
    const steps = (session as any)?.formDefinition?.schema?.steps || [];

    const isStepComplete = (step: any) => {
        if (!step.fields || step.fields.length === 0) return true;
        return step.fields.every((field: any) => {
            const val = answers[field.id];
            if (field.type === 'image') return Array.isArray(val) && val.length > 0;
            if (field.type === 'checkbox') return val === true;
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
                        title="Entrada" 
                        onPress={() => navigation.navigate('Entry', { id: sessionId })}
                    />
                    <View style={{ height: 12 }} />
                </View>
            </ScrollView>
        </View>
    );
}
