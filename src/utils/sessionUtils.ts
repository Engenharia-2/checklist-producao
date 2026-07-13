import { Session } from '../types/session';

export const calculateIsSessionComplete = (session: Session, newAnswers: Record<string, any>): boolean => {
    // Usamos any para formDefinition por enquanto, pois o tipo Session puro pode não ter essa tipagem na estrutura atual
    const steps = (session as any)?.formDefinition?.schema?.steps || [];
    if (steps.length === 0) return false;

    const getStepStatus = (step: any) => {
        if (!step.fields || step.fields.length === 0) return 'complete';

        // Filtra campos puramente visuais como títulos
        const inputFields = step.fields.filter((field: any) => field.type !== 'title');
        if (inputFields.length === 0) return 'complete';

        const filledFieldsCount = inputFields.filter((field: any) => {
            const val = newAnswers[field.id];
            if (field.type === 'image') return Array.isArray(val) && val.length > 0;
            if (field.type === 'checkbox') return val === true;
            return val !== undefined && val !== null && val !== '';
        }).length;

        if (filledFieldsCount === 0) return 'pending';
        if (filledFieldsCount === inputFields.length) return 'complete';
        return 'in_progress';
    };

    return steps.every((step: any) => getStepStatus(step) === 'complete');
};
