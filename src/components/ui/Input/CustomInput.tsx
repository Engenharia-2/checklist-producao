import React, { FC } from 'react';
import { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

// Styled components to match theme
const Container = styled.View`
  width: 100%;
  margin-bottom: 8px;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const StyledInput = styled.TextInput`
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

interface CustomInputProps extends TextInputProps {
    label: string;
    containerStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    inputStyle?: StyleProp<TextStyle>;
}

export const CustomInput: FC<CustomInputProps> = ({
    label,
    containerStyle,
    labelStyle,
    inputStyle,
    ...props
}) => {
    return (
        <Container style={containerStyle}>
            <Label style={labelStyle}>{label}</Label>
            <InputContainer>
                <StyledInput
                    placeholderTextColor="#999"
                    style={inputStyle}
                    {...props}
                />
            </InputContainer>
        </Container>
    );
};

export default CustomInput;
