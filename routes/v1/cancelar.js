const express = require('express');
const { logger } = require('../../utils');
const { cancelarDeposito } = require('../../services');

const router = express.Router();

router.patch('/:id', async (req, res) => {
    try {
        const usuario = req.user; 
        const depositoId = req.params.id; 

        const deposito = await cancelarDeposito(usuario, depositoId);

        res.json({
            sucesso: true,
            mensagem: 'Depósito cancelado com sucesso',
            deposito,
        });
    } catch (error) {
        res.status(422).json({
            sucesso: false,
            erro: error.message,
        });
    }
});

module.exports = router;