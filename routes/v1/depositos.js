const express = require('express');
const { checaSaldo } = require('../../services');
const { logger } = require('../../utils');
const { checaOtp } = require('./auth/otp');

const router = express.Router();

router.get('/', checaOtp, async (req, res) => {
    res.json({
        sucesso: true,
        depositos: req.user.depositos,
    });
});

router.post('/', checaOtp, async (req, res) => {
    try {
        const usuario = req.user;
        const valor = req.body.valor;

        // Adiciona o depósito ao histórico do usuário
        usuario.depositos.push({ valor: valor, data: new Date() });

        // Verifica se o usuário já tem a moeda BRL
        const saldoEmMoedas = usuario.moedas.find(m => m.codigo === 'BRL');

        if (saldoEmMoedas) {
            // Incrementa o saldo se a moeda já existir
            await usuario.updateOne(
                { "moedas.codigo": "BRL" }, 
                { $inc: { "moedas.$.quantidade": valor } }
            );
        } else {
            // Adiciona a moeda BRL se não existir
            await usuario.updateOne(
                {}, 
                { $push: { moedas: { codigo: 'BRL', quantidade: valor } } }
            );
        }

        await usuario.save(); // Salva alterações no histórico de depósitos

        res.json({
            sucesso: true,
            saldo: await checaSaldo(usuario),
            depositos: usuario.depositos,
        });
    } catch (e) {
        logger.error(`Erro no depósito: ${e.message}`);

        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

module.exports = router;



/**
 * @openapi
 * /v1/depositos:
 *   get:
 *     description: Retorna a lista de depósitos do usuário
 *    
 *     tags:
 *       - depósitos
 *     responses:
 *       200:
 *         description: Lista de depósitos do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 depositos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Deposito'
 *   post:
 *     description: Realiza um novo depósito para o usuário
 *     security:
 *       - auth: []  # Corrigido para ter os itens da lista alinhados
 *       - otp: []   # Corrigido para ter os itens da lista alinhados
 *     tags:
 *       - depósitos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor:
 *                 type: number
 *                 example: 300
 *     responses:
 *       200:
 *         description: Depósito realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 saldo:
 *                   type: number
 *                   example: 1500
 *                 depositos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Deposito'
 *       422:
 *         description: Erro ao processar o depósito
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
 *                   example: "Erro ao processar depósito"
 * components:
 *   schemas:
 *     Deposito:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "675a00b15a7665f715197081"
 *         valor:
 *           type: number
 *           example: 300
 *         data:
 *           type: string
 *           format: date-time
 *           example: "2024-12-11T21:14:25.127Z"
 *         cancelado:
 *           type: boolean
 *           example: false
 */
