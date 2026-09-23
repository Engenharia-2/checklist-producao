import { styled } from 'styled-components/native';

// --- CustomInput Styles ---
export const CustomContainer = styled.View`
  width: 100%;
  margin-bottom: 8px;
`;

export const CustomLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
`;

export const CustomInputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

export const CustomStyledInput = styled.TextInput`
  background-color: #ffffff;
  border-width: 1px;
  border-color: #ddd;
  border-radius: 15px;
  padding: 12px;
  font-size: 16px;
  color: #333;
  elevation: 4;
  flex: 1;
`;

// --- SearchInput Styles ---
export const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  width: 100%;
`;

export const SearchField = styled.TextInput`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text};
`;
