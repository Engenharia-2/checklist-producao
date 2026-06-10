import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { useSessionStore } from '../store/sessionStore';

export const useDynamicForm = (sessionId: string, formId: string) => {
    const { sessions, updateChecklistItem } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const answers = (session as any)?.answers || {};

    const [schema, setSchema] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSchema = async () => {
            const formData = await apiService.getFormById(formId);
            if (formData && formData.schema) {
                setSchema(formData.schema);
            }
            setIsLoading(false);
        };
        fetchSchema();
    }, [formId]);

    const handleFieldChange = (fieldId: string, value: any) => {
        updateChecklistItem(sessionId, { [fieldId]: value });
    };

    return {
        schema,
        isLoading,
        answers,
        session,
        handleFieldChange
    };
};
