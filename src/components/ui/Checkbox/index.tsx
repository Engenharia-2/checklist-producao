import React from 'react';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    Container,
    ClickableArea,
    Label,
    StyledCheckbox,
    HelpButton
} from './styles';

interface CustomCheckboxProps {
    label: string;
    value: boolean;
    onValueChange: (newValue: boolean) => void;
    disabled?: boolean;
    explanation?: string;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    label,
    value,
    onValueChange,
    disabled,
    explanation
}) => {
    const handleShowExplanation = () => {
        Alert.alert(
            "Explicação",
            explanation,
            [{ text: "Entendi" }]
        );
    };

    return (
        <Container>
            <ClickableArea onPress={() => !disabled && onValueChange(!value)} disabled={disabled}>
                <StyledCheckbox
                    value={value}
                    onValueChange={onValueChange}
                    color={value ? '#21ce49ff' : undefined}
                    disabled={disabled}
                />
                <Label>{label}</Label>
            </ClickableArea>
            
            {explanation ? (
                <HelpButton onPress={handleShowExplanation}>
                    <Ionicons name="help-circle-outline" size={24} color="#1890ff" />
                </HelpButton>
            ) : null}
        </Container>
    );
};
