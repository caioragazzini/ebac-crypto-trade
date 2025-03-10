const express = require('express');

const router = express.Router();

/**
 * @openapi
 * /v1/status:
 *   get:
 *     description: Rota de checagem de status
 *     responses:
 *       200:
 *         description: A API está funcional e tudo certo
 */
router.get('/', (_req, res) => {
  res.json({
    sucesso: true,
    status: 'ok',
  });
});

module.exports = router;
