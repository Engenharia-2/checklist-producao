import { Search } from 'lucide-react-native';
import React from 'react';
import { TextInputProps } from 'react-native';
import { SearchContainer, SearchField } from './styles';

export const SearchInput: React.FC<TextInputProps> = (props) => {
    return (
        <SearchContainer>
            <Search size={20} color="#999" />
            <SearchField
                placeholderTextColor="#999"
                {...props}
            />
        </SearchContainer>
    );
};
