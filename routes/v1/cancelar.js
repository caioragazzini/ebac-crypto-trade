const express = require('express');
const { logger } = require('../../utils');
const { cancelarDeposito } = require('../../services');

const router = express.Router();

/**
 * @openapi
 * /v1/cancelar/{id}:
 *   patch:
 *     description: Cancela um depósito existente pelo ID
 *     tags:
 *       - depósitos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do depósito a ser cancelado
 *         schema:
 *           type: string
 *           example: "675d71c5dacc8f59ca34218d"
 *     responses:
 *       200:
 *         description: Depósito cancelado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 mensagem:
 *                   type: string
 *                   example: "Depósito cancelado com sucesso"
 *                 deposito:
 *                   type: object
 *                   properties:
 *                     valor:
 *                       type: number
 *                       example: 300
 *                     data:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-14T11:53:41.821Z"
 *                     cancelado:
 *                       type: boolean
 *                       example: true
 *       422:
 *         description: Falha ao cancelar o depósito
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
 *                   example: "Depósito não encontrado ou já cancelado"
 */

router.patch('/:id', async (req, res) => {
    try {
        const usuario = req.user; 
        const depositoId = req.params.id; 

        const deposito = await cancelarDeposito(usuario, depositoId);

        res.json({
            sucesso: true,
            mensagem: 'Depósito cancelado com sucesso',
            deposito,
        });
    } catch (error) {
        res.status(422).json({
            sucesso: false,
            erro: error.message,
        });
    }
});

module.exports = router;