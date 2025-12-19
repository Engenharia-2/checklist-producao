import React from 'react';
import { ScrollView } from 'react-native';
import { useSessionStore } from '../../../store/sessionStore';
import CustomTitle from '../../ui/Title/CustomTitle';
import { ChecklistItem } from '../ChecklistItem';
import { styles } from '../styles';
import { useChecklistItem } from '../../../hooks/useChecklistItem';

interface StepProps {
    sessionId: string;
}

// const CalibrationContainer = styled.View`
//   margin-top: 24px;
//   border-width: 1px;
//   border-color: ${({ theme }) => theme.colors.border};
//   border-radius: ${({ theme }) => theme.borderRadius.md};
//   padding: 16px;
// `;

// const CalibrationTitle = styled.Text`
//   font-size: 16px;
//   font-weight: bold;
//   margin-bottom: 16px;
//   text-align: center;
//   color: ${({ theme }) => theme.colors.text};
// `;

// const CalibrationRow = styled.View`
//   flex-direction: row;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 8px;
// `;

// const CalibrationLabel = styled.Text`
//   font-size: 14px;
//   width: 20%;
//   color: ${({ theme }) => theme.colors.textSecondary};
// `;

export const SoftwareStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const { handleChange } = useChecklistItem(sessionId);

    const calibrationPoints = [1000, 2000, 3000, 4000, 5000];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomTitle title="Software e Calibração" />

            <ChecklistItem
                id="mega_software_atualizar"
                label="Atualizar o software para a versão mais recente"
                isChecked={checklist['mega_software_atualizar'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="mega_software_repetibilidade"
                label="Verificar repetibilidade das medições em todas as faixas"
                isChecked={checklist['mega_software_repetibilidade'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />

            {/* <CalibrationContainer>
                <CalibrationTitle>Executar calibração em todas as faixas</CalibrationTitle>
                <CalibrationRow>
                    <CalibrationLabel></CalibrationLabel>
                    <Text style={{width: '40%', textAlign: 'center'}}>Aplicado</Text>
                    <Text style={{width: '40%', textAlign: 'center'}}>Saída</Text>
                </CalibrationRow>
                {calibrationPoints.map(point => (
                    <CalibrationRow key={point}>
                        <CalibrationLabel>{point}V</CalibrationLabel>
                        <View style={{width: '40%'}}>
                            <CustomInput
                                value={checklist[`mega_calib_aplicado_${point}`] || ''}
                                onChangeText={(text) => handleChange(`mega_calib_aplicado_${point}`, text)}
                                placeholder="Valor"
                                keyboardType="numeric"
                                label=''
                            />
                        </View>
                        <View style={{width: '40%'}}>
                            <CustomInput
                                value={checklist[`mega_calib_saida_${point}`] || ''}
                                onChangeText={(text) => handleChange(`mega_calib_saida_${point}`, text)}
                                placeholder="Valor"
                                keyboardType="numeric"
                                label=''
                            />
                        </View>
                    </CalibrationRow>
                ))}
            </CalibrationContainer> */}

        </ScrollView>
    );
};
