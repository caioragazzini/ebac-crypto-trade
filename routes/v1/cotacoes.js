const express = require('express');

const { buscaCotacoesNoBanco } = require('../../services');

const { logger } = require('../../utils');

const router = express.Router();

/**
 * @openapi
 * /v1/cotacoes:
 *   get:
 *     description: Retorna a última cotação válida
 *     tags:
 *       - operações
 *     responses:
 *       200:
 *         description: Recebe uma lista de cotações
 */


router.get('/', async (req,res)=>{
    try{
        const cotacoes = await buscaCotacoesNoBanco();
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