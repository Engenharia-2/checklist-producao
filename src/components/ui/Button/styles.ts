import styled from 'styled-components/native';

export const ButtonContainer = styled.TouchableOpacity<{ disabled?: boolean; variant?: string }>`
  background-color: ${({ theme, variant, disabled }) => 
    disabled ? '#cccccc' : (variant === 'secondary' ? theme.colors.secondary : theme.colors.primary)};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  align-items: center;
  justify-content: center;
  width: 100%;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.surface};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: bold;
`;
