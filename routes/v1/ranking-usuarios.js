const express = require('express');
const { buscaRankingUsuarios } = require('../../services');
const { logger } = require('../../utils');

const router = express.Router();

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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dia:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-04T18:38:48.938Z"
 *                       gainers:
 *                         type: array
 *                         description: Usuários com maior ganho no dia.
 *                         items:
 *                           type: object
 *                           properties:
 *                             usuario:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: "67cb3cafdb8243306daf73ef"
 *                                 nome:
 *                                   type: string
 *                                   example: "Mariazinha da Silva"
 *                             variacao:
 *                               type: number
 *                               example: 100
 *                             _id:
 *                               type: string
 *                               example: "67cb3d38f701d943196830dd"
 *                       loosers:
 *                         type: array
 *                         description: Usuários com maior perda no dia.
 *                         items:
 *                           type: object
 *                           properties:
 *                             usuario:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: "67cb3cafdb8243306daf73ed"
 *                                 nome:
 *                                   type: string
 *                                   example: "Juninho da Silva Santos"
 *                             variacao:
 *                               type: number
 *                               example: -2000
 *                             _id:
 *                               type: string
 *                               example: "67cb3d38f701d943196830de"
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
 */

router.get('/', async (req, res) => {
    try {
        let dia;
        const diaStr = req.query.dia;

        console.log("Iniciando busca de ranking de usuários..."); 

        if (diaStr) {
            const regex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (regex.test(diaStr)) {
                const [day, month, year] = diaStr.split('/').map(Number);
                dia = new Date(year, month - 1, day);
                console.log(`Data fornecida: ${dia}`); 
            } else {
                console.log(`Formato de data inválido: ${diaStr}`); 
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Formato de data inválido. Use o formato dd/mm/yyyy.',
                });
            }
        } else {
            dia = new Date();
            console.log(`Nenhuma data fornecida, usando data atual: ${dia}`);
        }

        console.log("Chamando buscaRankingUsuarios..."); 
        console.log(`buscaRankingUsuarios: ${typeof buscaRankingUsuarios}`); 
        const ranking = await buscaRankingUsuarios(dia);

        console.log("Ranking obtido:", ranking); 

        res.json({
            sucesso: true,
            ranking,
        });
        console.log("Ranking enviado com sucesso."); 
    } catch (e) {
        logger.error(`Erro ao buscar ranking de usuários: ${e.message}`);
        console.error(`Erro ao buscar ranking de usuários: ${e.message}`); 
        res.status(500).json({
            sucesso: false,
            erro: e.message,
        });
        console.log("Erro ao buscar ranking de usuários."); 
    }
});

module.exports = router;