import { Check, ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Modal } from 'react-native';
import {
  Container,
  Label,
  SelectButton,
  SelectedText,
  ModalOverlay,
  ModalContent,
  OptionItem,
  OptionText,
  Loader,
  EmptyText
} from './styles';

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
    disabled?: boolean;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
    label, 
    value, 
    onSelect, 
    options,
    placeholder = 'Selecione uma opção',
    isLoading = false,
    emptyMessage = 'Nenhuma opção disponível',
    disabled = false
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <Container>
            <Label>{label}</Label>
            <SelectButton onPress={() => setModalVisible(true)} disabled={disabled}>
                <SelectedText hasValue={!!value}>{value || placeholder}</SelectedText>
                <ChevronDown size={20} color="#666" />
            </SelectButton>

            <Modal visible={modalVisible} transparent animationType="slide">
                <ModalOverlay onPress={() => setModalVisible(false)}>
                    <ModalContent>
                        {isLoading ? (
                            <Loader size="large" color="#000" />
                        ) : (
                            <FlatList
                                data={options}
                                keyExtractor={(item) => item.id}
                                ListEmptyComponent={
                                    <EmptyText>
                                        {emptyMessage}
                                    </EmptyText>
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
