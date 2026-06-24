import { Check, ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Modal, ActivityIndicator } from 'react-native';
import {
  Container,
  Label,
  SelectButton,
  SelectedText,
  ModalOverlay,
  ModalContent,
  OptionItem,
  OptionText
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
