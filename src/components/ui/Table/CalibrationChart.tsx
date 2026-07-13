import React, { useMemo } from 'react';
import { View } from 'react-native';
import { VictoryChart, VictoryScatter, VictoryLine, VictoryTheme, VictoryAxis } from 'victory-native';
import { localStyles } from './styles';

export interface CalibrationChartProps {
    points: { x: string; y: string }[];
    gain: number | null;
    offset: number | null;
    errorMsg?: string;
}

export const CalibrationChart: React.FC<CalibrationChartProps> = ({ points, gain, offset, errorMsg }) => {
    const chartData = useMemo(() => {
        if (gain === null || offset === null || errorMsg) return null;

        const validPoints = points.map(pt => {
            const xStr = pt.x !== undefined && pt.x !== null ? String(pt.x) : '';
            const yStr = pt.y !== undefined && pt.y !== null ? String(pt.y) : '';
            return {
                x: parseFloat(xStr.replace(',', '.')),
                y: parseFloat(yStr.replace(',', '.'))
            };
        }).filter(pt => !isNaN(pt.x) && !isNaN(pt.y));

        validPoints.sort((a, b) => a.x - b.x);

        if (validPoints.length < 2) return null;

        const xValues = validPoints.map(p => p.x);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        
        const padding = (maxX - minX) * 0.1 || 1; 
        const startX = minX - padding;
        const endX = maxX + padding;

        const lineData = [
            { x: startX, y: (gain * startX) + offset },
            { x: endX, y: (gain * endX) + offset }
        ];

        return { scatterData: validPoints, lineData };
    }, [points, gain, offset, errorMsg]);

    if (!chartData) return null;

    return (
        <View style={localStyles.chartContainer}>
            <VictoryChart 
                theme={VictoryTheme.material} 
                height={250} 
                padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
            >
                <VictoryAxis 
                    label="Referência Padrão (X)"
                    style={{ axisLabel: { padding: 30 } }}
                />
                <VictoryAxis 
                    dependentAxis
                    label="Leitura (Y)"
                    style={{ axisLabel: { padding: 40 } }}
                />
                
                <VictoryLine
                    data={chartData.lineData}
                    style={{
                        data: { stroke: "#005a9c", strokeWidth: 2 } 
                    }}
                />
                
                <VictoryLine
                    data={chartData.scatterData}
                    style={{
                        data: { stroke: "#d93d05", strokeWidth: 1.5, strokeDasharray: "5,5" } 
                    }}
                />
                
                <VictoryScatter
                    data={chartData.scatterData}
                    size={5}
                    style={{
                        data: { fill: "#f24607" } 
                    }}
                />
            </VictoryChart>
        </View>
    );
};
