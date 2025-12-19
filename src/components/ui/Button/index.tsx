import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

const ButtonContainer = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  align-items: center;
  justify-content: center;
  width: 100%;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.surface};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: bold;
`;

export const CustomButton: React.FC<ButtonProps> = ({ title, onPress, isLoading, disabled }) => {
    return (
        <ButtonContainer onPress={onPress} disabled={disabled || isLoading}>
            {isLoading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <ButtonText>{title}</ButtonText>
            )}
        </ButtonContainer>
    );
};
