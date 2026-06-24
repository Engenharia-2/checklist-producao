import React from 'react';
import { ActivityIndicator } from 'react-native';
import { ButtonContainer, ButtonText } from './styles';

interface ButtonProps {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
}

export const CustomButton: React.FC<ButtonProps> = ({ title, onPress, isLoading, disabled, variant }) => {
    return (
        <ButtonContainer onPress={onPress} disabled={disabled || isLoading} variant={variant}>
            {isLoading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <ButtonText>{title}</ButtonText>
            )}
        </ButtonContainer>
    );
};

