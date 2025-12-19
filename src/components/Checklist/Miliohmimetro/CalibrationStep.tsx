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


export const CalibrationStep: React.FC<StepProps> = ({ sessionId }) => {
    const { sessions } = useSessionStore();
    const session = sessions.find(s => s.id === sessionId);
    const checklist = session?.checklist || {};

    const { handleChange } = useChecklistItem(sessionId);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomTitle title="Calibração Interna" />

            <ChecklistItem
                id="calib_all_scales"
                label="Calibrar todas as escalas visando identificar possíveis falhas de medição"
                isChecked={checklist['calib_all_scales'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="calib_battery"
                label="Realizar calibração da bateria"
                isChecked={checklist['calib_battery'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
            <ChecklistItem
                id="calib_temperature_kappo"
                label="Realizar calibração da temperatura com utilização do KAPPO (utilizar o gráfico abaixo)."
                isChecked={checklist['calib_temperature_kappo'] || false}
                onToggle={(id, val) => handleChange(id, val)}
            />
{/* 
            <TableContainer>
                <TableRow>
                    <TableHeader>Resist. KAPPO</TableHeader>
                    <TableHeader>Temp. Padrão</TableHeader>
                    <TableHeader>Temp. Mili</TableHeader>
                </TableRow>
                <TableRow>
                    <TableCell>100</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>0</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>109,73</TableCell>
                    <TableCell>25</TableCell>
                    <TableCell>0</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>119,4</TableCell>
                    <TableCell>50</TableCell>
                    <TableCell>0</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>128,99</TableCell>
                    <TableCell>75</TableCell>
                    <TableCell>0</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>138,51</TableCell>
                    <TableCell>100</TableCell>
                    <TableCell>0</TableCell>
                </TableRow>
            </TableContainer> */}

        </ScrollView>
    );
};
