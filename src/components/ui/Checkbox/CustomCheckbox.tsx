import Checkbox from 'expo-checkbox';
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

interface CustomCheckboxProps {
    label: string;
    value: boolean;
    onValueChange: (newValue: boolean) => void;
    disabled?: boolean;
    explanation?: string;
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: 5px;
  background-color: transparent; 
  border-width: 0;
  padding: 0;
`;

const ClickableArea = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const Label = styled.Text`
  font-size: 16px;
  color: #333;
  flex: 1;
`;

const StyledCheckbox = styled(Checkbox)`
  width: 40px;
  height: 40px;
  margin-right: 8px;
`;

const HelpButton = styled.TouchableOpacity`
  padding: 5px;
  margin-left: 5px;
`;

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
