const express = require('express');
const { buscaRankingNoBanco } = require('../../services');
const { logger } = require('../../utils');

const router = express.Router();


function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
  
    return new Date(year, month - 1, day);
}


router.get('/', async (req, res) => {
    try {
        let dia;
        const diaStr = req.query.dia; 

        if (diaStr) {
           
            const regex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (regex.test(diaStr)) {
                dia = parseDate(diaStr);
            } else {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Formato de data inválido. Use o formato dd/mm/yyyy.'
                });
            }
        } else {
           
            dia = new Date(); 
        }

        const ranking = await buscaRankingNoBanco(dia);

        console.log("🚀 ~ router.get ~ ranking:", ranking)

        res.json({
            sucesso: true,
            ranking: ranking[0], 
        });
    } catch (e) {
        logger.error(`Erro ao buscar o ranking: ${e.message}`);
        
        res.status(500).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

module.exports = router;

/**
 * @openapi
 * /v1/ranking:
 *   get:
 *     description: Retorna o ranking de usuários com base na variação de saldo para um determinado dia.
 *     tags:
 *       - ranking
 *     parameters:
 *       - in: query
 *         name: dia
 *         required: false
 *         description: Data no formato dd/mm/yyyy para filtrar o ranking (se não for fornecida, será usada a data atual).
 *         schema:
 *           type: string
 *           example: "04/03/2025"
 *     responses:
 *       200:
 *         description: Ranking de usuários retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 ranking:
 *                   type: object
 *                   properties:
 *                     dia:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-04T18:38:48.938Z"
 *                     gainers:
 *                       type: array
 *                       description: Usuários com maior ganho no dia.
 *                       items:
 *                         type: object
 *                         properties:
 *                           usuario:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "67cb3cafdb8243306daf73ef"
 *                               nome:
 *                                 type: string
 *                                 example: "Mariazinha da Silva"
 *                           variacao:
 *                             type: number
 *                             example: 100
 *                           _id:
 *                             type: string
 *                             example: "67cb3d38f701d943196830dd"
 *                     loosers:
 *                       type: array
 *                       description: Usuários com maior perda no dia.
 *                       items:
 *                         type: object
 *                         properties:
 *                           usuario:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "67cb3cafdb8243306daf73ed"
 *                               nome:
 *                                 type: string
 *                                 example: "Juninho da Silva Santos"
 *                           variacao:
 *                             type: number
 *                             example: -2000
 *                           _id:
 *                             type: string
 *                             example: "67cb3d38f701d943196830de"
 *       400:
 *         description: Formato de data inválido.
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
 *                   example: "Formato de data inválido. Use o formato dd/mm/yyyy."
 *       500:
 *         description: Erro interno ao buscar ranking de usuários.
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
 *                   example: "Erro inesperado no servidor."
 * components:
 *   schemas:
 *     Ranking:
 *       type: object
 *       properties:
 *         sucesso:
 *           type: boolean
 *           example: true
 *         ranking:
 *           type: object
 *           properties:
 *             dia:
 *               type: string
 *               format: date-time
 *               example: "2025-03-04T18:38:48.938Z"
 *             gainers:
 *               type: array
 *               description: Usuários com maior ganho no dia.              
 *             loosers:
 *               type: array
 *               description: Usuários com maior perda no dia.
 */

