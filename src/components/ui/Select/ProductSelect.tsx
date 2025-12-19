import { Check, ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Modal } from 'react-native';
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
  max-height: 50%;
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

const PRODUCTS = ['Miliohmimetro', 'Megohmetro', 'Surge test 4kv', 'Surge Test 15kv'];

interface ProductSelectProps {
    label: string;
    value: string;
    onSelect: (value: string) => void;
}

export const ProductSelect: React.FC<ProductSelectProps> = ({ label, value, onSelect }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <Container>
            <Label>{label}</Label>
            <SelectButton onPress={() => setModalVisible(true)}>
                <SelectedText hasValue={!!value}>{value || 'Selecione um produto'}</SelectedText>
                <ChevronDown size={20} color="#666" />
            </SelectButton>

            <Modal visible={modalVisible} transparent animationType="slide">
                <ModalOverlay onPress={() => setModalVisible(false)}>
                    <ModalContent>
                        <FlatList
                            data={PRODUCTS}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <OptionItem onPress={() => {
                                    onSelect(item);
                                    setModalVisible(false);
                                }}>
                                    <OptionText>{item}</OptionText>
                                    {value === item && <Check size={20} color="#000" />}
                                </OptionItem>
                            )}
                        />
                    </ModalContent>
                </ModalOverlay>
            </Modal>
        </Container>
    );
};
