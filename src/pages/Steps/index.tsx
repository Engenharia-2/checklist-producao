import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSessionStore } from '@/src/store/sessionStore';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '@/src/components/ui/Button';
import { useReportGenerator } from '@/src/hooks/useReportGenerator';
import { InspectionCreateModal } from '@/src/components/Home/InspectionCreateModal';
import { styles } from './styles';

type RootStackParamList = {
    Home: undefined;
    StepsMenu: { id: string; formId: string };
    DynamicForm: { id: string; formId: string; stepId: string };
};

type StepsMenuRouteProp = RouteProp<RootStackParamList, 'StepsMenu'>;
type StepsMenuNavigationProp = StackNavigationProp<RootStackParamList, 'StepsMenu'>;

export default function StepsMenuScreen() {
    const route = useRoute<StepsMenuRouteProp>();
    const navigation = useNavigation<StepsMenuNavigationProp>();
    const { id: sessionId } = route.params;

    const [editModalVisible, setEditModalVisible] = useState(false);

    const { sessions, updateSession } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const answers = (session as any)?.answers || {};
    
    const steps = (session as any)?.formDefinition?.schema?.steps || [];
    
    const { isGenerating: isGeneratingReport, generateReport } = useReportGenerator();

    const getStepStatus = (step: any) => {
        if (!step.fields || step.fields.length === 0) return 'complete';

        // Filtra campos puramente visuais como títulos
        const inputFields = step.fields.filter((field: any) => field.type !== 'title');
        if (inputFields.length === 0) return 'complete';

        const filledFieldsCount = inputFields.filter((field: any) => {
            const val = answers[field.id];
            if (field.type === 'image') return Array.isArray(val) && val.length > 0;
            if (field.type === 'checkbox') return val === true;
            return val !== undefined && val !== null && val !== '';
        }).length;

        if (filledFieldsCount === 0) return 'pending';
        if (filledFieldsCount === inputFields.length) return 'complete';
        return 'in_progress';
    };

    const handleUpdateSession = async (data: { osNumber: string; serialNumber: string; formName: string; formId: string }) => {
        if (session) {
            await updateSession(session.id, data);
        }
    };

    const initialModalData = session ? {
        osNumber: session.osNumber || '',
        serialNumber: session.serialNumber || '',
        formName: session.formName || '',
        formId: session.formId || '',
    } : undefined;

    const totalSteps = steps.length;
    const completedSteps = steps.filter((step: any) => getStepStatus(step) === 'complete').length;
    const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    const getStatusColor = (status: 'pending' | 'in_progress' | 'complete') => {
        switch (status) {
            case 'complete': return '#21ce49';
            case 'in_progress': return '#ffa500';
            case 'pending': default: return '#ccc';
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.subtitle}>{session?.formName}</Text>

                {totalSteps > 0 && (
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                        {completedSteps}/{totalSteps} etapas concluídas ({Math.round(progressPercent)}%)
                        </Text>
                        <View style={styles.progressBarBackground}>
                            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                        </View>
                    </View>
                )}

                <View style={styles.stepsList}>
                    {steps.map((step: any) => {
                        const status = getStepStatus(step);
                        return (
                            <TouchableOpacity 
                                key={step.id} 
                                style={[
                                    styles.stepCard, 
                                    { borderLeftWidth: 6, borderLeftColor: getStatusColor(status) }
                                ]}
                                onPress={() => navigation.navigate('DynamicForm', { 
                                    id: sessionId, 
                                    formId: (session as any).formId,
                                    stepId: step.id 
                                })}
                            >
                                {status === 'complete' && (
                                    <Ionicons name="checkmark-circle" size={24} color="#21ce49" style={styles.statusIcon} />
                                )}
                                {status === 'in_progress' && (
                                    <Ionicons name="time" size={24} color="#ffa500" style={styles.statusIcon} />
                                )}
                                {status === 'pending' && (
                                    <Ionicons name="radio-button-off" size={24} color="#ccc" style={styles.statusIcon} />
                                )}
                                
                                <Text style={styles.stepTitle}>{step.title}</Text>
                                
                                <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.chevronIcon} />
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.footer}>
                    <CustomButton 
                        title={isGeneratingReport ? "Gerando Relatório..." : "Gerar Relatório"} 
                        onPress={() => generateReport(session)}
                        isLoading={isGeneratingReport}
                        disabled={isGeneratingReport || totalSteps === 0 || completedSteps < totalSteps}
                    />
                    <View style={{ height: 12 }} />
                    <CustomButton 
                        title="Editar OP" 
                        onPress={() => setEditModalVisible(true)}
                        variant="secondary"
                    />
                    <View style={{ height: 12 }} />
                    <CustomButton 
                        title="Voltar para inicio" 
                        onPress={() => navigation.navigate('Home')}
                        variant="secondary"
                    />
                    <View style={{ height: 12 }} />
                </View>
            </ScrollView>

            <InspectionCreateModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                onSubmit={handleUpdateSession}
                initialData={initialModalData}
                title="Editar OP / Inspeção"
                submitText="Salvar Alterações"
            />
        </View>
    );
}
