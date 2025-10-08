const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

function carregarPlanilha(nomeArquivo) {
  try {
    const filePath = path.join(__dirname, "../data/", nomeArquivo);

    if (!fs.existsSync(filePath)) {
      const dataDir = path.join(__dirname, "../data/");

      if (fs.existsSync(dataDir)) {
        const files = fs.readdirSync(dataDir);
      } else {
        console.error(`❌ Pasta data não existe: ${dataDir}`);
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

function processarSubstituicaoBase() {
  try {
    const linhas = carregarPlanilha("substituicaodecopasimulacao.xlsx");

    if (!linhas || linhas.length === 0) {
      throw new Error("Planilha vazia ou sem dados");
    }

    linhas.forEach((linha, index) => {
      if (index < 10) {
        console.log(`Linha ${index}:`, linha);
      }
    });

    const linhaHectaresPlantas = linhas[2];
    const hectares = Number(linhaHectaresPlantas[1]) || 1;
    const qtdPlantas = Number(linhaHectaresPlantas[4]) || 100;

    const preparoArea = linhas
      .slice(5, 12)
      .filter(
        (linha) =>
          linha &&
          linha.length > 0 &&
          linha[0] &&
          String(linha[0]).trim() !== ""
      );

    const insumos = linhas
      .slice(14, 19)
      .filter(
        (linha) =>
          linha &&
          linha.length > 0 &&
          linha[0] &&
          String(linha[0]).trim() !== ""
      );

    const preparoSolo = linhas
      .slice(21, 24)
      .filter(
        (linha) =>
          linha &&
          linha.length > 0 &&
          linha[0] &&
          String(linha[0]).trim() !== ""
      );

    const servicos = linhas
      .slice(26, 30)
      .filter(
        (linha) =>
          linha &&
          linha.length > 0 &&
          linha[0] &&
          String(linha[0]).trim() !== ""
      );

    const subtotalPreparoArea = linhas[12] || [];
    const subtotalInsumos = linhas[19] || [];
    const subtotalPreparoSolo = linhas[24] || [];
    const subtotalServicos = linhas[30] || [];
    const valorTotal = linhas[31] || [];

    const jsonFinal = {
      titulo:
        linhas[0] && linhas[0][0]
          ? linhas[0][0]
          : "Substituição de Copa de Cajueiro",
      hectaresPlantas: {
        hectares: hectares,
        qtdPlantas: qtdPlantas,
      },
      preparoArea: preparoArea.map((linha) => ({
        descricao: linha[0] || "",
        unidade: linha[1] || "",
        quantidade: Number(linha[2]) || 0,
        valorUnitario: Number(linha[3]) || 0,
        valorTotal: Number(linha[4]) || 0,
      })),
      subtotalPreparoArea: {
        descricao: subtotalPreparoArea[0] || "Subtotal Preparo Área",
        valorTotal: Number(subtotalPreparoArea[4]) || 0,
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
      preparoSolo: preparoSolo.map((linha) => ({
        descricao: linha[0] || "",
        unidade: linha[1] || "",
        quantidade: Number(linha[2]) || 0,
        valorUnitario: Number(linha[3]) || 0,
        valorTotal: Number(linha[4]) || 0,
      })),
      subtotalPreparoSolo: {
        descricao: subtotalPreparoSolo[0] || "Subtotal Preparo Solo",
        valorTotal: Number(subtotalPreparoSolo[4]) || 0,
      },
      servicos: servicos.map((linha) => ({
        descricao: linha[0] || "",
        unidade: linha[1] || "",
        quantidade: Number(linha[2]) || 0,
        valorUnitario: Number(linha[3]) || 0,
        valorTotal: Number(linha[4]) || 0,
      })),
      subtotalServicos: {
        descricao: subtotalServicos[0] || "Subtotal Serviços",
        valorTotal: Number(subtotalServicos[4]) || 0,
      },
      valorTotal: {
        descricao: valorTotal[0] || "TOTAL GERAL",
        valorTotal: Number(valorTotal[4]) || 0,
      },
    };

    return jsonFinal;
  } catch (error) {
    throw new Error(
      `Falha ao processar planilha de substituição: ${error.message}`
    );
  }
}

function recalcularSubstituicaoSimulacao(dados) {
  try {
    const { hectares, preparoArea, insumos, preparoSolo, servicos } = dados;

    const resultado = {
      ...dados,
      preparoArea: preparoArea.map((item) => ({
        ...item,
        valorTotal: item.quantidade * item.valorUnitario * hectares,
      })),
      insumos: insumos.map((item) => ({
        ...item,
        valorTotal: item.quantidade * item.valorUnitario * hectares,
      })),
      preparoSolo: preparoSolo.map((item) => ({
        ...item,
        valorTotal: item.quantidade * item.valorUnitario * hectares,
      })),
      servicos: servicos.map((item) => ({
        ...item,
        valorTotal: item.quantidade * item.valorUnitario * hectares,
      })),
      recalculado: true,
      timestamp: new Date().toISOString(),
    };

    resultado.subtotalPreparoArea.valorTotal = resultado.preparoArea.reduce(
      (sum, item) => sum + item.valorTotal,
      0
    );
    resultado.subtotalInsumos.valorTotal = resultado.insumos.reduce(
      (sum, item) => sum + item.valorTotal,
      0
    );
    resultado.subtotalPreparoSolo.valorTotal = resultado.preparoSolo.reduce(
      (sum, item) => sum + item.valorTotal,
      0
    );
    resultado.subtotalServicos.valorTotal = resultado.servicos.reduce(
      (sum, item) => sum + item.valorTotal,
      0
    );
    resultado.valorTotal.valorTotal =
      resultado.subtotalPreparoArea.valorTotal +
      resultado.subtotalInsumos.valorTotal +
      resultado.subtotalPreparoSolo.valorTotal +
      resultado.subtotalServicos.valorTotal;

    return resultado;
  } catch (error) {
    console.error("❌ Erro em recalcularSubstituicaoSimulacao:", error);
    throw error;
  }
}

module.exports = { processarSubstituicaoBase, recalcularSubstituicaoSimulacao };
