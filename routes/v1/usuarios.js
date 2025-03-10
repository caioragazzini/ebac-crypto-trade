const express = require('express');
const { criarUsuario, checaSaldo } = require('../../services');
const { logger } = require('../../utils');
const passport = require('passport');

const router = express.Router();

router.post('/', async(req,res)=> {
    const dados = req.body.usuario;
    try{
        const usuario = await criarUsuario(dados);
        res.json({
            sucesso: true,
            usuario: usuario,
        });

    }catch(e) {
        logger.error(`Erro na criação do usuário ${e.message}`);

        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });

    }
});

/**
 * @openapi
 * /v1/usuarios/me:
 *   get:
 *     description: Retorna o perfil do usuário(a)
 *     security:
 *       - auth: []
 *     tags:
 *       - usuario
 *     responses:
 *       200:
 *         description: Informações do perfil do usuário(a)
 *       401:
 *         description: Autorização está faltando ou inválida
 */

router.get('/me', passport.authenticate('jwt', {session:false}), async(req, res)=> {
    res.json({
        sucesso: true,
        usuario: req.user,
        saldo: await checaSaldo(req.user),
    })
});


module.exports = router;