import { Session } from "../../types/session";
import { generateChartSVG } from "./svgChartGenerator";

// --- Helper Functions for HTML Elements ---

const generateCheckbox = (label: string, checked: boolean) => {
    const checkmark = checked ? "&#10003;" : "";
    return `
        <div class="checkbox-container ${checked ? "checked" : ""}">
            <span class="checkbox-symbol">${checkmark}</span>
            <span class="checkbox-label">${label}</span>
        </div>
    `;
};

const generateField = (label: string, value: any) => {
    return `
        <div class="field">
            <strong>${label}:</strong>
            <span>${value || "Não informado"}</span>
        </div>
    `;
};

const generateImageSection = (title: string, images: string[]) => {
    if (!images || images.length === 0) return "";
    let imageHtml = `
        <div class="image-group-section">
            <h3 class="section-title">${title}</h3>
            <div class="image-grid">
    `;
    images.forEach((img) => {
        imageHtml += `
            <div class="image-block">
                <img src="${img}" class="report-image"/>
            </div>
        `;
    });
    imageHtml += `</div></div>`;
    return imageHtml;
};

const generateCalibrationTable = (label: string, value: any) => {
    if (!value || !value.points) return generateField(label, "Sem dados de calibração");

    let tableRows = "";
    value.points.forEach((pt: any, index: number) => {
        const pointName = pt.name && pt.name.trim() !== "" ? pt.name : `Ponto ${index + 1}`;
        tableRows += `
            <tr>
                <td>${pointName}</td>
                <td>${pt.x}</td>
                <td>${pt.y}</td>
            </tr>
        `;
    });

    const gainStr = value.gain !== null && value.gain !== undefined ? parseFloat(value.gain.toFixed(15)) : "N/A";
    const offsetStr = value.offset !== null && value.offset !== undefined ? parseFloat(value.offset.toFixed(15)) : "N/A";
    const r2Str = value.r2 !== null && value.r2 !== undefined ? parseFloat(value.r2.toFixed(15)) : "N/A";

    const svgChart = value.points && value.points.length >= 2 
        ? generateChartSVG(value.points, value.gain || 0, value.offset || 0) 
        : '';

    return `
        <div class="field calibration-field">
            <strong>${label}:</strong>
            <table class="calibration-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Ref. Padrão (X)</th>
                        <th>Leitura (Y)</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            <div class="calibration-results">
                <strong>Ganho (a):</strong> ${gainStr} <br/>
                <strong>Offset (b):</strong> ${offsetStr} <br/>
                <strong>Qualidade (R²):</strong> ${r2Str}
            </div>
            ${svgChart}
        </div>
    `;
};

// --- ReportComponentFactory: Translates Schema + Answers to HTML ---

const renderComponentHtml = (field: any, value: any): string => {
    switch (field.type) {
        case 'title':
            return `<h3 class="section-title">${field.label}</h3>`;

        case 'input':
        case 'dropdown':
            return generateField(field.label, value);

        case 'checkbox':
            return generateCheckbox(field.label, !!value);

        case 'image':
            return generateImageSection(field.label, value || []);

        case 'calibration_table':
            return generateCalibrationTable(field.label, value);

        default:
            return "";
    }
};

/**
 * Renderiza dinamicamente as etapas do formulário com base no schema.
 */
const renderDynamicSteps = (session: Session): string => {
    const schema = (session as any).formDefinition?.schema;
    const answers = (session as any).answers || {};

    if (!schema || !schema.steps) {
        return "<p>Nenhuma configuração de formulário encontrada para esta sessão.</p>";
    }

    let html = "";

    schema.steps.forEach((step: any) => {
        html += `<div class="section">`;
        html += `<h2 class="step-main-title">${step.title}</h2>`;

        if (step.fields && step.fields.length > 0) {
            step.fields.forEach((field: any) => {
                const fieldValue = answers[field.id];
                html += renderComponentHtml(field, fieldValue);
            });
        }

        html += `</div>`;
    });

    return html;
};

// --- Main PDF Content Creator ---

export const createPdfContent = (
    session: Session,
    logoBase64: string | null,
): string => {
    const dynamicChecklistHtml = renderDynamicSteps(session);

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page {
            margin-top: 3cm;
            margin-bottom: 2.5cm;
            margin-left: 1cm;
            margin-right: 1cm;

            @top-center {
                content: "Relatório de Produção";
                font-family: 'Helvetica Neue', Arial, sans-serif;
                font-size: 18pt;
                font-weight: bold;
                color: #005a9c;
                border-bottom: 2px solid #005a9c;
                width: 100%;
                padding-bottom: 10px;
                vertical-align: bottom;
            }

            @bottom-center {
                content: "Gerado em: ${new Date().toLocaleString("pt-BR")} | LHF Sistemas";
                font-family: 'Helvetica Neue', Arial, sans-serif;
                font-size: 9pt;
                color: #888;
                border-top: 1px solid #ccc;
                width: 100%;
                padding-top: 5px;
                vertical-align: top;
            }
        }
        
        * { box-sizing: border-box; }
        body { 
            font-family: 'Helvetica Neue', Arial, sans-serif; 
            color: #333; 
            margin: 0; 
            padding: 0;
        }
        .main-content { width: 100%; }
        
        .section { 
            margin-bottom: 1cm; 
            page-break-inside: avoid; 
            break-inside: avoid;
        }
        
        .step-main-title {
            font-size: 18pt;
            color: #333;
            background-color: #f0f2f5;
            padding: 10px;
            border-left: 5px solid #005a9c;
            margin-bottom: 15px;
            page-break-after: avoid;
        }

        .section-title { 
            font-size: 14pt; 
            color: #005a9c; 
            border-bottom: 1px solid #ccc; 
            padding-bottom: 5px; 
            margin-bottom: 15px; 
            margin-top: 20px;
            page-break-after: avoid; 
        }
        
        .field { 
            display: flex; 
            justify-content: space-between; 
            padding: 8px 0; 
            border-bottom: 1px solid #eee; 
            page-break-inside: avoid; 
        }
        .field strong { color: #005a9c; }
        
        .checkbox-container { 
            display: flex; 
            align-items: center; 
            background: #f1f4fa; 
            border-radius: 8px; 
            padding: 6px 10px; 
            margin: 5px 0; 
            break-inside: avoid;
        }
        .checkbox-container.checked { background-color: #005a9c; color: #fff;}
        .checkbox-symbol { margin-right: 8px; font-weight: bold; }
        
        .image-group-section { margin-top: 20px; page-break-before: auto; }
        .image-grid { display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-start; }
        .image-block { margin-bottom: 10px; }
        .report-image { max-width: 8.5cm; max-height: 10cm; height: auto; border-radius: 4px; border: 1px solid #ddd; }
        
        .calibration-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            margin-bottom: 10px;
        }
        .calibration-table th, .calibration-table td {
            border: 1px solid #ccc;
            padding: 5px;
            text-align: center;
        }
        .calibration-table th {
            background-color: #f0f2f5;
            color: #333;
        }
        .calibration-results {
            margin-top: 5px;
            padding: 10px;
            background-color: #e6f7ff;
            border: 1px solid #91d5ff;
            border-radius: 4px;
        }
        .calibration-field {
            flex-direction: column;
            align-items: flex-start;
        }
      </style>
    </head>
    <body>
      <div class="main-content">
        <div class="section">
          <h2 class="section-title">Dados da Sessão</h2>
          ${generateField("Ordem de Produção (OP)", session.osNumber)}
          ${generateField("Número de Série", session.serialNumber)}
          ${generateField("Modelo do Produto", session.formName)}
          ${generateField("Data de Início", new Date(session.startDate || (session as any).createdAt || new Date()).toLocaleString("pt-BR"))}
          ${(session.endDate || (session as any).updatedAt) ? generateField("Data de Fim / Atualização", new Date(session.endDate || (session as any).updatedAt).toLocaleString("pt-BR")) : ""}
        </div>

        ${dynamicChecklistHtml}

      </div>
    </body>
    </html>
  `;

    return htmlContent;
};
