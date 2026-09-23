export type RootStackParamList = {
    Home: undefined;
    StepsMenu: { id: string; formId: string };
    DynamicForm: { id: string; formId: string; stepId?: string };
};
