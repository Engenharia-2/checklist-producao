export interface ChartPoint {
    x: string;
    y: string;
}

export const generateChartSVG = (pointsRaw: ChartPoint[], gain: number, offset: number): string => {
    // 1. Converter pontos e filtrar inválidos
    const points = pointsRaw.map(p => {
        const xStr = p.x !== undefined && p.x !== null ? String(p.x) : '';
        const yStr = p.y !== undefined && p.y !== null ? String(p.y) : '';
        return {
            x: parseFloat(xStr.replace(',', '.')),
            y: parseFloat(yStr.replace(',', '.'))
        };
    }).filter(p => !isNaN(p.x) && !isNaN(p.y));

    if (points.length < 2) return '';

    // 2. Calcular os limites (Bounding Box) dos dados reais
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    
    const minXRaw = Math.min(...xs);
    const maxXRaw = Math.max(...xs);

    // Calcular os valores Y baseados na reta teórica (Ganho e Offset) para os extremos de X
    const theoreticalY1 = (gain * minXRaw) + offset;
    const theoreticalY2 = (gain * maxXRaw) + offset;

    const minYRaw = Math.min(...ys, theoreticalY1, theoreticalY2);
    const maxYRaw = Math.max(...ys, theoreticalY1, theoreticalY2);

    // 3. Adicionar "respiro" (padding matemático de 15%) nos limites para os pontos não tocarem a borda
    const xRange = maxXRaw - minXRaw || 1;
    const yRange = maxYRaw - minYRaw || 1;
    
    const minX = minXRaw - (xRange * 0.15);
    const maxX = maxXRaw + (xRange * 0.15);
    const minY = minYRaw - (yRange * 0.15);
    const maxY = maxYRaw + (yRange * 0.15);

    // 4. Configurar as dimensões do Canvas SVG
    const width = 600;
    const height = 350;
    
    // Espaço extra interno para eixos e estética
    const paddingLeft = 40;
    const paddingRight = 30;
    const paddingTop = 30;
    const paddingBottom = 40;

    const graphWidth = width - paddingLeft - paddingRight;
    const graphHeight = height - paddingTop - paddingBottom;

    // 5. Funções de Mapeamento (Transforma o X/Y real em Posição de Pixel no SVG)
    // No SVG, o eixo Y cresce de cima para baixo, então precisamos inverter a conta do Y.
    const mapX = (x: number) => paddingLeft + ((x - minX) / (maxX - minX)) * graphWidth;
    const mapY = (y: number) => height - paddingBottom - ((y - minY) / (maxY - minY)) * graphHeight;

    // 6. Iniciar a construção do bloco SVG em formato String
    let svg = `<div style="text-align: center; margin: 20px 0; width: 100%;">`;
    svg += `<svg viewBox="0 0 ${width} ${height}" style="width: 90%; height: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">`;

    // Desenhar a Grade de Fundo (Grid) e Numerações dos Eixos
    const numTicks = 5;

    // Eixo Y (Linhas horizontais e textos no eixo Y)
    for (let i = 0; i <= numTicks; i++) {
        const valY = minY + (yRange / numTicks) * i;
        const posLineY = mapY(valY);
        // Grid
        svg += `<line x1="${paddingLeft}" y1="${posLineY}" x2="${width - paddingRight}" y2="${posLineY}" stroke="#f0f0f0" stroke-width="1" />`;
        // Numeração
        svg += `<text x="${paddingLeft - 5}" y="${posLineY + 4}" font-size="11" font-family="sans-serif" fill="#666" text-anchor="end">${valY.toFixed(1)}</text>`;
    }

    // Eixo X (Linhas verticais e textos no eixo X)
    for (let i = 0; i <= numTicks; i++) {
        const valX = minX + (xRange / numTicks) * i;
        const posLineX = mapX(valX);
        // Grid
        svg += `<line x1="${posLineX}" y1="${paddingTop}" x2="${posLineX}" y2="${height - paddingBottom}" stroke="#f0f0f0" stroke-width="1" />`;
        // Numeração
        svg += `<text x="${posLineX}" y="${height - paddingBottom + 15}" font-size="11" font-family="sans-serif" fill="#666" text-anchor="middle">${valX.toFixed(1)}</text>`;
    }

    // 6.1 Eixos (Tentamos achar o eixo X=0 e Y=0. Se estiverem fora da tela, colamos na borda)
    const axisY = (minY <= 0 && maxY >= 0) ? mapY(0) : mapY(minY);
    const axisX = (minX <= 0 && maxX >= 0) ? mapX(0) : mapX(minX);

    svg += `<line x1="${paddingLeft}" y1="${axisY}" x2="${width - paddingRight}" y2="${axisY}" stroke="#bfbfbf" stroke-width="2" />`;
    svg += `<line x1="${axisX}" y1="${paddingTop}" x2="${axisX}" y2="${height - paddingBottom}" stroke="#bfbfbf" stroke-width="2" />`;

    // 6.2 Desenhar a Reta de Tendência (Azul)
    const trendX1 = mapX(minXRaw);
    const trendY1 = mapY(theoreticalY1);
    const trendX2 = mapX(maxXRaw);
    const trendY2 = mapY(theoreticalY2);
    
    svg += `<line x1="${trendX1}" y1="${trendY1}" x2="${trendX2}" y2="${trendY2}" stroke="#1890ff" stroke-width="2.5" />`;

    // 6.3 Desenhar a Linha tracejada conectando os pontos de dispersão (Vermelha)
    const sortedPoints = [...points].sort((a, b) => a.x - b.x);
    
    if (sortedPoints.length > 1) {
        let polylinePoints = sortedPoints.map(p => `${mapX(p.x)},${mapY(p.y)}`).join(' ');
        svg += `<polyline points="${polylinePoints}" fill="none" stroke="#ff4d4f" stroke-width="1.5" stroke-dasharray="6,4" />`;
    }

    // 6.4 Desenhar os Pontos de Dispersão (Bolinhas Vermelhas)
    for (const p of points) {
        svg += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="4.5" fill="#ff4d4f" stroke="#ffffff" stroke-width="1" />`;
    }

    // Fechar tags
    svg += `</svg>`;
    svg += `</div>`;

    return svg;
};
