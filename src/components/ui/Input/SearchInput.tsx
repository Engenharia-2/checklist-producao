import { Search } from 'lucide-react-native';
import React from 'react';
import { TextInputProps } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  width: 100%;
`;

const Input = styled.TextInput`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text};
`;

export const SearchInput: React.FC<TextInputProps> = (props) => {
    return (
        <Container>
            <Search size={20} color="#999" />
            <Input
                placeholderTextColor="#999"
                {...props}
            />
        </Container>
    );
};
