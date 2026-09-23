import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { CustomButton } from '@/src/components/ui/Button';
import { ComponentFactory } from '@/src/components/Checklist/ComponentFactory';
import { useDynamicForm } from '@/src/hooks/useDynamicForm';
import { PasswordModal } from '@/src/components/ui/Modal/PasswordModal';
import { getStepStatus } from '@/src/utils/sessionUtils';
import { RootStackParamList } from '@/src/types/navigation';
import { styles } from './styles';

type DynamicFormRouteProp = RouteProp<RootStackParamList, 'DynamicForm'>;

export default function DynamicFormScreen() {
    const route = useRoute<DynamicFormRouteProp>();
    const navigation = useNavigation();
    const { id: sessionId, formId, stepId } = route.params;

    const { 
        schema,
        activeFields,
        isLoading, 
        answers, 
        session, 
        handleFieldChange 
    } = useDynamicForm(sessionId, formId, stepId);

    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const sessionStatus = session?.status;
    const steps = schema?.steps || [];
    const currentStepIndex = steps.findIndex((step: any) => step.id === stepId);
    const isLastStep = steps.length > 0 && currentStepIndex === steps.length - 1;
    const previousStepsComplete = steps.length > 1
        && steps.slice(0, -1).every((step: any) => getStepStatus(step, answers) === 'complete');
    const isLastStepBlocked = steps.length > 1 && isLastStep && !previousStepsComplete;
    const isFinished = sessionStatus === 'finalizada';
    const isProtectedStockStep = sessionStatus === 'estoque' && !isLastStep;
    const isProtected = isFinished || isProtectedStockStep;
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        setIsUnlocked(sessionStatus !== undefined && !isProtected);
    }, [sessionId, stepId, sessionStatus, isProtected]);

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

    if (isLastStepBlocked) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>
                    Conclua todas as etapas anteriores antes de iniciar a etapa final de expedição.
                </Text>
                <CustomButton title="Voltar" onPress={() => navigation.goBack()} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {isProtected && !isUnlocked && (
                <View style={styles.lockedBanner}>
                    <Text style={styles.lockedText}>
                        {isFinished
                            ? 'OP Finalizada (Modo de Leitura).'
                            : 'Etapa de produção protegida (OP em Estoque).'}
                    </Text>
                    <TouchableOpacity onPress={() => setPasswordModalVisible(true)}>
                        <Text style={styles.unlockLink}>Desbloquear Edição</Text>
                    </TouchableOpacity>
                </View>
            )}

            {activeFields.map((field: any) => (
                <ComponentFactory
                    key={field.id}
                    field={field}
                    value={answers[field.id]}
                    sessionId={sessionId}
                    onFieldChange={handleFieldChange}
                    editable={isUnlocked}
                />
            ))}

            <View style={styles.footer}>
                <CustomButton
                    title="Salvar e Voltar"
                    onPress={() => navigation.goBack()}
                />
            </View>

            <PasswordModal
                visible={passwordModalVisible}
                onClose={() => setPasswordModalVisible(false)}
                onSuccess={() => setIsUnlocked(true)}
                title="Desbloquear Edição"
                description={isFinished
                    ? 'Digite a senha para permitir edições nesta OP finalizada.'
                    : 'Digite a senha para editar uma etapa de produção desta OP em estoque.'}
            />
        </ScrollView>
    );
}
