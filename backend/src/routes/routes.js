const express = require('express');
const router = express.Router();
const {
    getImplantacaoBase,
    postImplantacaoRecalculo,
    getSubstituicaoBase,
    postSubstituicaoRecalculo
} = require('../controllers/simuladorController');

router.get('/implantacao', getImplantacaoBase);
router.post('/implantacao', postImplantacaoRecalculo);
router.get('/substituicao', getSubstituicaoBase);
router.post('/substituicao', postSubstituicaoRecalculo);

module.exports = router;