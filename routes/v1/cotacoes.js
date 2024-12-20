const express = require('express');

const { buscaCotacoes } = require('../../services');

const { logger } = require('../../utils');

const router = express.Router();

router.get('/', async (req,res)=>{
    try{
        const cotacoes = await buscaCotacoes();
        res.json({
            sucesso: true,
            cotacoes,    
        });

    }catch(e){
        logger.error(`Erro ao buscar as cotações: ${e.message}`);

        res.status(500).json({
            sucesso: false,
            erro: e.message,
        });

    }
    
    
});

module.exports = router;