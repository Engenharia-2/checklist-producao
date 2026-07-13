import { useState, useEffect, useMemo } from 'react';
import { calculateCalibration, CalibrationPoint } from '../utils/mathUtils';

export interface FieldType {
    id: string;
    type: string;
    label?: string;
    rowNames?: string;
    referenceValues?: string;
}

export const useCalibrationTable = (value: { points?: CalibrationPoint[] } | null | undefined, onFieldChange: (fieldId: string, value: any) => void, field: FieldType) => {
    const fieldId = field.id;

    // 1. Estado local de digitação (mantém as strings puras com vírgula etc)
    const [points, setPoints] = useState<{ name: string; x: string; y: string }[]>(() => {
        const defaultRowNames = field.rowNames
            ? field.rowNames.split(',').map((name: string) => name.trim())
            : ['', ''];

        const defaultRefValues = field.referenceValues
            ? field.referenceValues.split(',').map((val: string) => val.trim())
            : [];

        if (value && value.points && Array.isArray(value.points)) {
            return value.points.map((p: any, idx: number) => ({
                name: p.name ? p.name.toString() : (defaultRowNames[idx] || ''),
                x: p.x !== undefined && p.x !== null && p.x.toString().trim() !== '' ? p.x.toString() : (defaultRefValues[idx] || ''),
                y: p.y !== undefined && p.y !== null ? p.y.toString() : ''
            }));
        }
        return defaultRowNames.map((name: string, idx: number) => ({ 
            name, 
            x: defaultRefValues[idx] || '', 
            y: '' 
        }));
    });

    // 2. Cálculo dos pontos válidos em tempo real (DRY - limpa as strings apenas quando 'points' muda)
    const validNumericPoints: CalibrationPoint[] = useMemo(() => {
        return points.map(pt => {
            const xStr = pt.x !== undefined && pt.x !== null ? String(pt.x) : '';
            const yStr = pt.y !== undefined && pt.y !== null ? String(pt.y) : '';
            const numX = parseFloat(xStr.replace(',', '.'));
            const numY = parseFloat(yStr.replace(',', '.'));
            return {
                name: pt.name,
                x: isNaN(numX) ? 0 : numX,
                y: isNaN(numY) ? 0 : numY
            };
        });
    }, [points]);

    // 3. Cálculos matemáticos em tempo real usando useMemo (elimina 4 estados do componente)
    const results = useMemo(() => {
        return calculateCalibration(validNumericPoints);
    }, [validNumericPoints]);

    // 4. Efeito colateral: Avisar o FormPai quando houver mudança estrutural
    useEffect(() => {
        onFieldChange(fieldId, {
            points: validNumericPoints,
            gain: results.gain,
            offset: results.offset,
            r2: results.r2,
            error: results.error
        });
    }, [validNumericPoints, results, fieldId, onFieldChange]);

    // 5. Funções Auxiliares de Interação
    const handlePointChange = (index: number, axis: 'name' | 'x' | 'y', text: string) => {
        setPoints(prevPoints => {
            const newPoints = [...prevPoints];
            newPoints[index] = {
                ...newPoints[index],
                [axis]: text
            };
            return newPoints;
        });
    };

    const addRow = () => {
        setPoints(prev => [...prev, { name: '', x: '', y: '' }]);
    };

    const removeRow = (index: number) => {
        if (points.length <= 2) return;
        setPoints(prev => prev.filter((_, i) => i !== index));
    };

    return {
        points,
        results,
        validNumericPoints, // Será usado pelo gráfico
        handlePointChange,
        addRow,
        removeRow
    };
};
