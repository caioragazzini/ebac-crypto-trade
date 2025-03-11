const express = require('express');
const { logger } = require('../../utils');
const { checaSaldo, sacaCrypto } = require('../../services');

const router = express.Router();

/**
 * @openapi
 * /v1/saques:
 *   get:
 *     description: Retorna a lista de saques do usuário
 *     tags:
 *       - saques
 *     responses:
 *       200:
 *         description: Lista de saques
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 saques:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       valor:
 *                         type: number
 *                         example: 10
 *                       data:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-14T12:16:42.095Z"
 *                       _id:
 *                         type: string
 *                         example: "675d772aecb16593a8cbf534"
 */
router.get('/', async(req, res) => {
    res.json({
        sucesso: true,
        saques: req.user.saques,
    });
});

/**
 * @openapi
 * /v1/saques:
 *   post:
 *     description: Realiza um saque em BRL
 *     tags:
 *       - saques
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor:
 *                 type: number
 *                 example: 3000
 *     responses:
 *       200:
 *         description: Saque realizado com sucesso
 *       422:
 *         description: Saldo insuficiente ou erro no saque
 */
router.post('/', async (req, res) => {
    const usuario = req.user;
    try {
        const valor = req.body.valor;
        const saldo = await checaSaldo(usuario);

        if (saldo < valor) {
            throw new Error('Saldo insuficiente. Tente outro valor.');
        }

        usuario.saques.push({ valor: valor, data: new Date() });

        const saldoEmMoedas = usuario.moedas.find(m => m.codigo === 'BRL');
        saldoEmMoedas.quantidade -= valor;

        await usuario.save();

        res.json({
            sucesso: true,
            saldo: saldo - valor,
            saques: usuario.saques,
        });
    } catch (e) {
        logger.error(`Erro no saque: ${e.message}`);

        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

/**
 * @openapi
 * /v1/saques/{codigo}:
 *   post:
 *     description: Realiza um saque de criptomoeda
 *     tags:
 *       - saques
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código da criptomoeda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor:
 *                 type: number
 *                 example: 500
 *     responses:
 *       200:
 *         description: Saque de criptomoeda realizado com sucesso
 *       422:
 *         description: Erro no saque de criptomoeda
 */
router.post('/:codigo', async(req, res) => {
    const usuario = req.user;
    const codigo = req.params.codigo;
    try {
        const valor = req.body.valor;
        const moedas = await sacaCrypto(usuario, codigo, valor);

        res.json({
            sucesso: true,
            moedas: moedas,
        });
    } catch (e) {
        logger.error(`Erro no saque de Crypto: ${e.message}`);
        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

module.exports = router;