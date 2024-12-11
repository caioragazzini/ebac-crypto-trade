const express = require('express');

const logger = require('../../utils');

const router = express.Router();

router.get('/', async(req,res)=>{
    res.json({
        sucesso: true,
        depositos: req.user.depositos,
    });
});

router.post('/', async(req,res)=>{
    const usuario = req.user;
    try{
        const valor = req.body.valor;
        usuario.depositos.push({valor: valor, data: new Date()});
        await usuario.save();

        res.json({
            sucesso: true,
            depositos: usuario.depositos,
        });

    }catch(e){
        logger.error(`Erro no deposito: ${e.message}`);

        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });


    }

});

module.exports = router;