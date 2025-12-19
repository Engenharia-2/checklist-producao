import Checkbox from 'expo-checkbox';
import React from 'react';
import styled from 'styled-components/native';

interface CustomCheckboxProps {
    label: string;
    value: boolean;
    onValueChange: (newValue: boolean) => void;
    disabled?: boolean;
}

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-vertical: 5px;
  background-color: transparent; 
  border-width: 0;
  padding: 0;
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

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    label,
    value,
    onValueChange,
    disabled
}) => {
    return (
        <Container onPress={() => !disabled && onValueChange(!value)} disabled={disabled}>
            <StyledCheckbox
                value={value}
                onValueChange={onValueChange}
                color={value ? '#21ce49ff' : undefined}
                disabled={disabled}
            />
            <Label>{label}</Label>
        </Container>
    );
};
