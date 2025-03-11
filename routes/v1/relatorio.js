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


/**
 * @openapi
 * /v1/pnl:
 *   get:
 *     description: Retorna o PnL (Profit and Loss) do usuário autenticado com base no relatório mais recente.
 *     tags:
 *       - relatórios
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: PnL gerado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 pnl:
 *                   type: number
 *                   example: 1500.75
 *       500:
 *         description: Erro ao gerar o PnL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: false
 *                 erro:
 *                   type: string
 *                   example: "Erro na geração de relatórios."
 */