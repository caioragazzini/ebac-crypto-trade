const express = require('express');
const { trocaMoedas } = require('../../services');
const { logger } = require('../../utils');

const router = express.Router();

/**
 * @openapi
 * /v1/troca-moedas:
 *   post:
 *     description: Realiza a troca de moedas para um usuário autenticado.
 *     tags:
 *       - transações
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cotacaoId
 *               - quantidade
 *               - operacao
 *             properties:
 *               cotacaoId:
 *                 type: string
 *                 description: Identificador da cotação utilizada para a troca.
 *                 example: "abc123"
 *               quantidade:
 *                 type: number
 *                 description: Quantidade de moedas a serem trocadas.
 *                 example: 100.5
 *               operacao:
 *                 type: string
 *                 description: Tipo de operação a ser realizada (compra ou venda).
 *                 enum: [compra, venda]
 *                 example: "compra"
 *     responses:
 *       200:
 *         description: Troca de moedas realizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 moedas:
 *                   type: object
 *                   description: Informações da transação realizada.
 *       422:
 *         description: Erro na troca de moedas devido a entrada inválida ou regras de negócio.
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
 *                   example: "Saldo insuficiente para a transação."
 *       500:
 *         description: Erro interno no servidor ao processar a troca de moedas.
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

router.post('/', async(req,res)=>{
    try{
        const moedas = await trocaMoedas(
            req.user,
            req.body.cotacaoId,
            req.body.quantidade,
            req.body.operacao,
        );
        res.json({
            sucesso: true,
            moedas: moedas,
        })

    }catch(e){
        logger.error(`Erro na troca de moedas: ${e.message} `);

        res.status(422).json({
            sucesso: false,
            erro: e.message,
        })

    }

});


module.exports = router
