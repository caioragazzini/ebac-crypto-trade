const express = require('express');
const { geraPnl} = require('../../services');
const { logger } = require('../../utils');

const router = express.Router();

router.get('/pnl',async(req,res)=>{
    try{
        const pnl = await geraPnl(req.user);
        res.json({
            sucesso: true,
            pnl: pnl,
        });

    }catch(e){
        logger.error(`Erro na geração de relatorios ${e.message}`);

        res.status(500).json({
            sucesso: false,
            erro: e.message,
        });

    }
});

module.exports= router;