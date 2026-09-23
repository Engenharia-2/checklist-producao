import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { CustomButton } from '@/src/components/ui/Button';
import { ComponentFactory } from '@/src/components/Checklist/ComponentFactory';
import { useDynamicForm } from '@/src/hooks/useDynamicForm';
import { PasswordModal } from '@/src/components/ui/Modal/PasswordModal';
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
        activeFields,
        isLoading, 
        answers, 
        session, 
        handleFieldChange 
    } = useDynamicForm(sessionId, formId, stepId);

    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const sessionStatus = session?.status;
    const isFinished = sessionStatus === 'finalizada';
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        setIsUnlocked(sessionStatus !== undefined && sessionStatus !== 'finalizada');
    }, [sessionId, sessionStatus]);

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
            {isFinished && !isUnlocked && (
                <View style={styles.lockedBanner}>
                    <Text style={styles.lockedText}>OP Finalizada (Modo de Leitura).</Text>
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
                description="Digite a senha para permitir edições nesta OP finalizada."
            />
        </ScrollView>
    );
}
