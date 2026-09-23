import { Session, SessionStatus } from '../types/session';

export type StepStatus = 'pending' | 'in_progress' | 'complete';

export const isFieldAnswerComplete = (field: any, value: any): boolean => {
    if (field.type === 'image') return Array.isArray(value) && value.length > 0;
    if (field.type === 'checkbox') return value === true;
    if (field.type === 'qr_verification') return value?.isValid === true;
    return value !== undefined && value !== null && value !== '';
};

export const getStepStatus = (step: any, answers: Record<string, any>): StepStatus => {
    if (!step.fields || step.fields.length === 0) return 'complete';

    // Filtra campos puramente visuais como títulos e textos informativos
    const inputFields = step.fields.filter((field: any) => field.type !== 'title' && field.type !== 'text');
    if (inputFields.length === 0) return 'complete';

    const filledFieldsCount = inputFields.filter((field: any) => {
        const value = answers[field.id];
        return isFieldAnswerComplete(field, value);
    }).length;

    if (filledFieldsCount === 0) return 'pending';
    if (filledFieldsCount === inputFields.length) return 'complete';
    return 'in_progress';
};

export const calculateSessionStatus = (
    session: Session,
    newAnswers: Record<string, any>
): SessionStatus => {
    // Usamos any para formDefinition por enquanto, pois o tipo Session puro pode não ter essa tipagem na estrutura atual
    const steps = (session as any)?.formDefinition?.schema?.steps || [];
    if (steps.length === 0) return 'aberta';

    const stepStatuses = steps.map((step: any) => getStepStatus(step, newAnswers));
    const allStepsComplete = stepStatuses.every((status: StepStatus) => status === 'complete');

    if (allStepsComplete) return 'finalizada';

    // Formulários com uma única etapa não passam pelo estoque.
    if (steps.length === 1) return 'aberta';

    const previousStepsComplete = stepStatuses
        .slice(0, -1)
        .every((status: StepStatus) => status === 'complete');

    return previousStepsComplete ? 'estoque' : 'aberta';
};
