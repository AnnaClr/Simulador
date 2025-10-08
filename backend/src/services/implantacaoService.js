const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

function carregarPlanilha(nomeArquivo) {
    try {
        const filePath = path.join(__dirname, '../data/', nomeArquivo);
        
        if (!fs.existsSync(filePath)) {
            
            const dataDir = path.join(__dirname, '../data/');
            
            if (fs.existsSync(dataDir)) {
                const files = fs.readdirSync(dataDir);
            } else {
                const srcDir = path.join(__dirname, '../');
            }
            throw new Error(`Arquivo não encontrado: ${nomeArquivo}`);
        }
        
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        
        return data;
    } catch (error) {
        throw error;
    }
}

function processarImplantacaoBase() {
    try {
        const linhas = carregarPlanilha("implantacaocajueiroanaosimulacao.xlsx");
        
        if (!linhas || linhas.length === 0) {
            throw new Error('Planilha vazia ou sem dados');
        }

        linhas.forEach((linha, index) => {
            if (index < 10) {
                console.log(`Linha ${index}:`, linha);
            }
        });

        const linhaHectaresPlantas = linhas[2];
        const hectares = Number(linhaHectaresPlantas[1]) || 1;
        const qtdPlantas = Number(linhaHectaresPlantas[4]) || 204;

        const preparoSolo = linhas.slice(5, 26)
            .filter(linha => linha && linha.length > 0 && linha[0] && String(linha[0]).trim() !== '');
        
        const insumos = linhas.slice(28, 35)
            .filter(linha => linha && linha.length > 0 && linha[0] && String(linha[0]).trim() !== '');

        const subtotalSolo = linhas[26] || [];
        const subtotalInsumos = linhas[35] || [];
        const valorTotal = linhas[36] || [];

        const jsonFinal = {
            titulo: linhas[0] && linhas[0][0] ? linhas[0][0] : "Implantação de Pomar de Cajueiro-anão",
            hectaresPlantas: {
                hectares: hectares,
                qtdPlantas: qtdPlantas,
            },
            preparoSolo: preparoSolo.map((linha) => ({
                descricao: linha[0] || "",
                unidade: linha[1] || "",
                quantidade: Number(linha[2]) || 0,
                valorUnitario: Number(linha[3]) || 0,
                valorTotal: Number(linha[4]) || 0,
            })),
            subtotalSolo: {
                descricao: subtotalSolo[0] || "Subtotal Preparo Solo",
                valorTotal: Number(subtotalSolo[4]) || 0,
            },
            insumos: insumos.map((linha) => ({
                descricao: linha[0] || "",
                unidade: linha[1] || "",
                quantidade: Number(linha[2]) || 0,
                valorUnitario: Number(linha[3]) || 0,
                valorTotal: Number(linha[4]) || 0,
            })),
            subtotalInsumos: {
                descricao: subtotalInsumos[0] || "Subtotal Insumos",
                valorTotal: Number(subtotalInsumos[4]) || 0,
            },
            valorTotal: {
                descricao: valorTotal[0] || "TOTAL GERAL",
                valorTotal: Number(valorTotal[4]) || 0,
            }
        };
        
        return jsonFinal;
    } catch (error) {
        throw new Error(`Falha ao processar planilha de implantação: ${error.message}`);
    }
}

function recalcularImplantacaoSimulacao(dados) {
    try {
        const { hectares, preparoSolo, insumos } = dados;
        
        const resultado = {
            ...dados,
            preparoSolo: preparoSolo.map(item => ({
                ...item,
                valorTotal: item.quantidade * item.valorUnitario * hectares
            })),
            insumos: insumos.map(item => ({
                ...item,
                valorTotal: item.quantidade * item.valorUnitario * hectares
            })),
            recalculado: true,
            timestamp: new Date().toISOString()
        };

        resultado.subtotalSolo.valorTotal = resultado.preparoSolo.reduce((sum, item) => sum + item.valorTotal, 0);
        resultado.subtotalInsumos.valorTotal = resultado.insumos.reduce((sum, item) => sum + item.valorTotal, 0);
        resultado.valorTotal.valorTotal = resultado.subtotalSolo.valorTotal + resultado.subtotalInsumos.valorTotal;

        return resultado;
    } catch (error) {
        throw error;
    }
}

module.exports = { processarImplantacaoBase, recalcularImplantacaoSimulacao };