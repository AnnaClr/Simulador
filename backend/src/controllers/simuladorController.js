const { processarImplantacaoBase, recalcularImplantacaoSimulacao } = require('../services/implantacaoService');
const { processarSubstituicaoBase, recalcularSubstituicaoSimulacao } = require('../services/substituicaoService');

function getImplantacaoBase(req, res) {
    try {
        const data = processarImplantacaoBase();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao processar planilha base.' });
    }
}

function getSubstituicaoBase(req, res) {
    try {
        const data = processarSubstituicaoBase();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao processar planilha base.' });
    }
}

function postImplantacaoRecalculo(req, res) {
    try {
        const data = req.body;
        const resultado = recalcularImplantacaoSimulacao(data);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao recalcular simulação.' });
    }
}

function postSubstituicaoRecalculo(req, res) {
    try {
        const data = req.body;
        const resultado = recalcularSubstituicaoSimulacao(data);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao recalcular simulação.' });
    }
}

module.exports = { 
    getImplantacaoBase, 
    postImplantacaoRecalculo, 
    getSubstituicaoBase, 
    postSubstituicaoRecalculo 
};