const express = require('express');

const { buscaCotacoesNoBanco } = require('../../services');

const { logger } = require('../../utils');

const router = express.Router();



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

/**
 * @openapi
 * /v1/cotacoes:
 *   get:
 *     description: Retorna a última cotação válida
 *     tags:
 *       - cotacoes
 *     responses:
 *       200:
 *         description: Recebe uma lista de cotações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 cotacoes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cotação'
 * components:
 *   schemas:
 *     Cotação:
 *       type: object
 *       properties:
 *         data:
 *           type: dateTime
 *           example: 2025-03-07T21:45:01.152Z
 *         moeda:
 *           type: string
 *           example: "USD"
 *         valor:
 *           type: number
 *           example: 5.25
 *         id:
 *           type: string
 *           example: 67cb68dd843502e0058031e2
 */