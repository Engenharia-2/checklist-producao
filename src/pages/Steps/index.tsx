import React, { useState } from 'react';
import { Alert, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSessionStore } from '@/src/store/sessionStore';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '@/src/components/ui/Button';
import { useReportGenerator } from '@/src/hooks/useReportGenerator';
import { InspectionCreateModal } from '@/src/components/Home/InspectionCreateModal';
import { getStepStatus, StepStatus } from '@/src/utils/sessionUtils';
import { RootStackParamList } from '@/src/types/navigation';
import { CreateSessionData } from '@/src/types/session';
import { styles } from './styles';

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

    const handleUpdateSession = async (data: CreateSessionData) => {
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
    const stepStatuses: StepStatus[] = steps.map((step: any) => getStepStatus(step, answers));
    const completedSteps = stepStatuses.filter(status => status === 'complete').length;
    const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
    const previousStepsComplete = totalSteps > 1
        && stepStatuses.slice(0, -1).every(status => status === 'complete');

    const getStatusColor = (status: StepStatus) => {
        switch (status) {
            case 'complete': return '#21ce49';
            case 'in_progress': return '#ffa500';
            case 'pending': default: return '#ccc';
        }
    };

    const handleSelectStep = (stepId: string, isLastStepLocked: boolean) => {
        if (isLastStepLocked) {
            Alert.alert(
                'Etapa bloqueada',
                'Conclua todas as etapas anteriores antes de iniciar a etapa final de expedição.'
            );
            return;
        }

        navigation.navigate('DynamicForm', {
            id: sessionId,
            formId: (session as any).formId,
            stepId,
        });
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
                    {steps.map((step: any, index: number) => {
                        const status = stepStatuses[index];
                        const isLastStep = index === totalSteps - 1;
                        const isLastStepLocked = totalSteps > 1 && isLastStep && !previousStepsComplete;
                        return (
                            <TouchableOpacity 
                                key={step.id} 
                                style={[
                                    styles.stepCard, 
                                    isLastStepLocked && styles.lockedStepCard,
                                    { borderLeftWidth: 6, borderLeftColor: getStatusColor(status) }
                                ]}
                                onPress={() => handleSelectStep(step.id, isLastStepLocked)}
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
                                
                                <Text style={[styles.stepTitle, isLastStepLocked && styles.lockedStepTitle]}>
                                    {step.title}
                                </Text>
                                
                                <Ionicons
                                    name={isLastStepLocked ? 'lock-closed' : 'chevron-forward'}
                                    size={20}
                                    color={isLastStepLocked ? '#8c8c8c' : '#ccc'}
                                    style={styles.chevronIcon}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.footer}>
                    <CustomButton 
                        title={isGeneratingReport ? "Gerando Relatório..." : "Gerar Relatório"} 
                        onPress={() => generateReport(session)}
                        isLoading={isGeneratingReport}
                        disabled={isGeneratingReport || session?.status !== 'finalizada'}
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
