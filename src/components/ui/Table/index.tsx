import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CustomInput } from '../Input/CustomInput';
import { CustomButton } from '../Button';
import { styles as globalStyles } from '../../../pages/Checklist/styles';
import { localStyles } from './styles';

import { useCalibrationTable } from '../../../hooks/useCalibrationTable';
import { CalibrationChart } from './CalibrationChart';

interface CalibrationTableFieldProps {
    field: any;
    value: any;
    onFieldChange: (fieldId: string, value: any) => void;
    editable?: boolean;
}

export const CalibrationTableField: React.FC<CalibrationTableFieldProps> = ({ field, value, onFieldChange, editable = true }) => {
    // Toda a inteligência matemática e gerencial de estado agora vive no Hook.
    const { 
        points, 
        results, 
        handlePointChange, 
        addRow, 
        removeRow 
    } = useCalibrationTable(value, onFieldChange, field);

    return (
        <View style={globalStyles.fieldContainer}>
            <Text style={globalStyles.label}>{field.label || 'Tabela de Calibração'}</Text>
            
            <View style={localStyles.headerRow}>
                <Text style={localStyles.headerText}>Nome</Text>
                <Text style={localStyles.headerText}>Ref. Padrão (X)</Text>
                <Text style={localStyles.headerText}>Leitura (Y)</Text>
                <View style={localStyles.deleteIconSpace} />
            </View>

            {points.map((pt, index) => (
                <View key={`row-${index}`} style={localStyles.row}>
                    <View style={localStyles.inputWrapper}>
                        <CustomInput
                            value={pt.name}
                            onChangeText={(text) => handlePointChange(index, 'name', text)}
                            placeholder="Ponto"
                            editable={editable}
                        />
                    </View>
                    <View style={localStyles.inputWrapper}>
                        <CustomInput
                            value={pt.x}
                            onChangeText={(text) => handlePointChange(index, 'x', text)}
                            placeholder="X"
                            keyboardType="decimal-pad"
                            editable={editable}
                        />
                    </View>
                    <View style={localStyles.inputWrapper}>
                        <CustomInput
                            value={pt.y}
                            onChangeText={(text) => handlePointChange(index, 'y', text)}
                            placeholder="Y"
                            keyboardType="decimal-pad"
                            editable={editable}
                        />
                    </View>
                    <View style={localStyles.deleteIconSpace}>
                        {points.length > 2 && editable && (
                            <TouchableOpacity onPress={() => removeRow(index)} style={localStyles.deleteBtn}>
                                <Text style={localStyles.deleteBtnText}>X</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ))}

            {editable && (
                <View style={localStyles.actions}>
                    <View style={localStyles.addButtonWrapper}>
                        <CustomButton title="+ Ponto" onPress={addRow} variant="secondary" />
                    </View>
                </View>
            )}

            <View style={localStyles.resultsContainer}>
                {results.error ? (
                    <Text style={localStyles.errorText}>{results.error}</Text>
                ) : (
                    <>
                        <Text style={localStyles.resultText}>Ganho (a): <Text style={localStyles.bold}>{results.gain !== null && results.gain !== undefined ? parseFloat(results.gain.toFixed(15)) : ''}</Text></Text>
                        <Text style={localStyles.resultText}>Offset (b): <Text style={localStyles.bold}>{results.offset !== null && results.offset !== undefined ? parseFloat(results.offset.toFixed(15)) : ''}</Text></Text>
                        <Text style={localStyles.resultText}>Qualidade (R²): <Text style={localStyles.bold}>{results.r2 !== null && results.r2 !== undefined ? parseFloat(results.r2.toFixed(15)) : ''}</Text></Text>
                    </>
                )}
            </View>

            {/* O Gráfico Visual Inteligente processa tudo isoladamente */}
            <CalibrationChart 
                points={points} 
                gain={results.gain} 
                offset={results.offset} 
                errorMsg={results.error} 
            />
        </View>
    );
};
