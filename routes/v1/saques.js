const express = require('express');
const { logger } = require('../../utils');
const { checaSaldo } = require('../../services');

const router = express.Router();

router.get('/', async(req, res)=>{
    res.json({
        sucesso: true,
        saques: req.user.saques,
    });
});

router.post('/', async (req, res) => {
    const usuario = req.user;
    try {
        const valor = req.body.valor;
        const saldo = await checaSaldo(usuario);

        if (saldo < valor) {
            throw new Error('Saldo insuficiente. Tente outro valor.');
        }

        usuario.saques.push({ valor: valor, data: new Date() });

        const saldoEmMoedas = usuario.moedas.find(m => m.codigo === 'BRL');
        saldoEmMoedas.quantidade -= valor;


        await usuario.save();

        res.json({
            sucesso: true,
            saldo: saldo - valor,
            saques: usuario.saques,
        });
    } catch (e) {
        logger.error(`Erro no saque: ${e.message}`);

        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });
    }
});


module.exports = router;