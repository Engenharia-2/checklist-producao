import { Check, ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Modal, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

const Label = styled.Text`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: bold;
`;

const SelectButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

const SelectedText = styled.Text<{ hasValue: boolean }>`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme, hasValue }) => (hasValue ? theme.colors.text : theme.colors.textSecondary)};
`;

const ModalOverlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.lg};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  max-height: 70%;
`;

const OptionItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const OptionText = styled.Text`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text};
`;

interface DropdownOption {
    id: string;
    name: string;
}

interface CustomDropdownProps {
    label: string;
    value: string; // The text to display for the selected value
    onSelect: (id: string, name: string) => void;
    options: DropdownOption[];
    placeholder?: string;
    isLoading?: boolean;
    emptyMessage?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
    label, 
    value, 
    onSelect, 
    options,
    placeholder = 'Selecione uma opção',
    isLoading = false,
    emptyMessage = 'Nenhuma opção disponível'
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <Container>
            <Label>{label}</Label>
            <SelectButton onPress={() => setModalVisible(true)}>
                <SelectedText hasValue={!!value}>{value || placeholder}</SelectedText>
                <ChevronDown size={20} color="#666" />
            </SelectButton>

            <Modal visible={modalVisible} transparent animationType="slide">
                <ModalOverlay onPress={() => setModalVisible(false)}>
                    <ModalContent>
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#000" style={{ margin: 20 }} />
                        ) : (
                            <FlatList
                                data={options}
                                keyExtractor={(item) => item.id}
                                ListEmptyComponent={
                                    <OptionText style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                                        {emptyMessage}
                                    </OptionText>
                                }
                                renderItem={({ item }) => (
                                    <OptionItem onPress={() => {
                                        onSelect(item.id, item.name);
                                        setModalVisible(false);
                                    }}>
                                        <OptionText>{item.name}</OptionText>
                                        {value === item.name && <Check size={20} color="#000" />}
                                    </OptionItem>
                                )}
                            />
                        )}
                    </ModalContent>
                </ModalOverlay>
            </Modal>
        </Container>
    );
};
