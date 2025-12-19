import React from 'react';
import styled from 'styled-components/native';

const TitleContainer = styled.View`
  align-items: center;
`;

const TitleText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

interface CustomTitleProps {
  title: string;
}

export const CustomTitle: React.FC<CustomTitleProps> = ({ title }) => {
  return (
    <TitleContainer>
      <TitleText>{title}</TitleText>
    </TitleContainer>
  );
};

export default CustomTitle;
