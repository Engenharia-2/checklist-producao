import Checkbox from 'expo-checkbox';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: 10px;
  background-color: transparent; 
  border-width: 0;
`;

export const ClickableArea = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const Label = styled.Text`
  font-size: 16px;
  color: #333;
  flex: 1;
`;

export const StyledCheckbox = styled(Checkbox)`
  width: 40px;
  height: 40px;
  margin-right: 8px;
`;

export const HelpButton = styled.TouchableOpacity`
  padding: 5px;
  margin-left: 5px;
`;
