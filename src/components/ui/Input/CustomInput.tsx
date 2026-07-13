import React, { FC } from 'react';
import { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';
import { CustomContainer, CustomInputWrapper, CustomStyledInput } from './styles';

interface CustomInputProps extends TextInputProps {
    label?: string;
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
        <CustomContainer style={containerStyle}>
            {/* <CustomLabel style={labelStyle}>{label}</CustomLabel> */}
            <CustomInputWrapper>
                <CustomStyledInput
                    placeholderTextColor="#999"
                    style={inputStyle}
                    {...props}
                />
            </CustomInputWrapper>
        </CustomContainer>
    );
};

export default CustomInput;
