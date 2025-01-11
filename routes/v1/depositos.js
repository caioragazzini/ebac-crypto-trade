const express = require('express');
const { checaSaldo } = require('../../services');

const { logger } = require('../../utils');

const router = express.Router();

router.get('/', async(req,res)=>{
    res.json({
        sucesso: true,
        depositos: req.user.depositos,
    });
});

router.post('/', async (req, res) => {
    const usuario = req.user;
    try {
        const valor = req.body.valor;

        usuario.depositos.push({ valor: valor, data: new Date() });

        const saldoEmMoedas = usuario.moedas.find(m => m.codigo === 'BRL' );
        if(saldoEmMoedas){
            saldoEmMoedas.quantidade += valor;
        }else{
            usuario.moedas.push({ codigo: 'BRL', quantidade: valor});
        }


        await usuario.save();

        res.json({
            sucesso: true,
            saldo: await checaSaldo(usuario),
            depositos: usuario.depositos,
        });
    } catch (e) {
        logger.error(`Erro no depósito: ${e.message}`);

        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });
    }
});


module.exports = router;