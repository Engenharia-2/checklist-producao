import { Session } from '../types/session';

export const isFieldAnswerComplete = (field: any, value: any): boolean => {
    if (field.type === 'image') return Array.isArray(value) && value.length > 0;
    if (field.type === 'checkbox') return value === true;
    if (field.type === 'qr_verification') return value?.isValid === true;
    return value !== undefined && value !== null && value !== '';
};

export const calculateIsSessionComplete = (session: Session, newAnswers: Record<string, any>): boolean => {
    // Usamos any para formDefinition por enquanto, pois o tipo Session puro pode não ter essa tipagem na estrutura atual
    const steps = (session as any)?.formDefinition?.schema?.steps || [];
    if (steps.length === 0) return false;

    const getStepStatus = (step: any) => {
        if (!step.fields || step.fields.length === 0) return 'complete';

        // Filtra campos puramente visuais como títulos e textos informativos
        const inputFields = step.fields.filter((field: any) => field.type !== 'title' && field.type !== 'text');
        if (inputFields.length === 0) return 'complete';

        const filledFieldsCount = inputFields.filter((field: any) => {
            const val = newAnswers[field.id];
            return isFieldAnswerComplete(field, val);
        }).length;

        if (filledFieldsCount === 0) return 'pending';
        if (filledFieldsCount === inputFields.length) return 'complete';
        return 'in_progress';
    };

    return steps.every((step: any) => getStepStatus(step) === 'complete');
};
