export interface CalibrationPoint {
  name?: string; // Nome do Ponto (opcional)
  x: number; // Valor Padrão / Esperado
  y: number; // Valor Lido / Medido
}

export interface CalibrationResult {
  gain: number | null;
  offset: number | null;
  r2: number | null;
  error?: string;
}

/**
 * Calcula o Ganho (a), Offset (b) e Qualidade do Ajuste (R²) utilizando o Método dos Mínimos Quadrados.
 * Ajustado para calibração de instrumentos: prevê a Referência (X) baseada na Leitura (Y).
 * Equação: X = a * Y + b
 * Ganho (a) = (n * ΣXY - ΣX * ΣY) / (n * ΣY² - (ΣY)²)
 * Offset (b) = (ΣX - a * ΣY) / n
 * R² = 1 - (Σ(Xi - Ŷi)²) / (Σ(Xi - X_mean)²)
 * 
 * @param points Array de pontos contendo x (Referência) e y (Leitura).
 * @returns Objeto com gain, offset e r2.
 */
export const calculateCalibration = (points: CalibrationPoint[]): CalibrationResult => {
  const n = points.length;

  if (n < 2) {
    return { gain: null, offset: null, r2: null, error: "São necessários pelo menos 2 pontos para o cálculo." };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumY2 = 0;

  for (let i = 0; i < n; i++) {
    const p = points[i];
    sumX += p.x;
    sumY += p.y;
    sumXY += (p.x * p.y);
    sumY2 += (p.y * p.y);
  }

  const denominator = (n * sumY2) - (sumY * sumY);

  if (denominator === 0) {
    return { gain: null, offset: null, r2: null, error: "Aviso: Valores de Leitura (Y) são idênticos ou inválidos." };
  }

  const a = ((n * sumXY) - (sumX * sumY)) / denominator;
  const b = (sumX - (a * sumY)) / n;

  // Calcula o R² para o modelo X = aY + b
  const meanX = sumX / n;
  let ssTot = 0; // Soma total dos quadrados (baseado em X)
  let ssRes = 0; // Soma residual dos quadrados (baseado em X)

  for (let i = 0; i < n; i++) {
    const p = points[i];
    const predictedX = (a * p.y) + b;
    
    ssTot += Math.pow(p.x - meanX, 2);
    ssRes += Math.pow(p.x - predictedX, 2);
  }

  // Previne divisão por zero caso todos os X sejam exatamente iguais
  const r2 = ssTot === 0 ? 1 : (1 - (ssRes / ssTot));

  return { gain: a, offset: b, r2: r2 };
};
