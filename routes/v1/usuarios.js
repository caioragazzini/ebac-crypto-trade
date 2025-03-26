const express = require('express');
const { criarUsuario, checaSaldo, geraSegredo } = require('../../services');
const { logger } = require('../../utils');
const passport = require('passport');
const bycrypt = require('bcrypt');

const router = express.Router();

/**
 * @openapi
 * /v1/usuarios:
 *   post:
 *     description: Cria um novo usuário
 *     tags:
 *       - usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     example: "caioragazzini@gmail.com.br"
 *                   cpf:
 *                     type: string
 *                     example: "146.897.780-60"
 *                   nome:
 *                     type: string
 *                     example: "João"
 *                   senha:
 *                     type: string
 *                     example: "1234@ebac"
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 usuario:
 *                   type: object
 *       422:
 *         description: Erro na criação do usuário
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
 *                   example: "Erro ao criar usuário"
 */
router.post('/', async (req, res) => {
    const dados = req.body.usuario;
    const urlDeRedirecionamento = req.body.redirect;
    
    if(!urlDeRedirecionamento){

        return res.status(422).json({
            sucesso: false,
            erro: 'Deve passar um parametro redirect para onde o usuario será redirecionado pós confirmação'
        });
    }

    try {
        const usuario = await criarUsuario(dados, urlDeRedirecionamento);
        res.json({
            sucesso: true,
            usuario: usuario,
        });
    } catch (e) {
        logger.error(`Erro na criação do usuário ${e.message}`);
        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

router.put('/senha', 
    passport.authenticate('jwt', { session: false }), 
    async(req,res)=>{

    const { senha }= req.body;
    try{

        const usuario = req.user;
        usuario.senha = await bycrypt.hash(senha,10);
        await usuario.save();
        res.json({
            sucesso: true,
            messagem: 'Senha alterada com sucesso',
        });

    } catch(e) {
        logger.error(`Erro ao alterar a senha ${e.message}`);
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 usuario:
 *                   type: object
 *                 saldo:
 *                   type: number
 *                   example: 1000.50
 *       401:
 *         description: Autorização está faltando ou inválida
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: "caioragazzini@gmail.com.br"
 *         cpf:
 *           type: string
 *           example: "146.897.780-60"
 *         nome:
 *           type: string
 *           example: "João"
 *         senha:
 *           type: string
 *           example: "1234@ebac"
 */
router.get('/me', 
    passport.authenticate('jwt', { session: false }), 
    async (req, res) => {
    res.json({
        sucesso: true,
        usuario: req.user,
        saldo: await checaSaldo(req.user),
    });
});

router.post('/otp',
    passport.authenticate('jwt', { session: false }), 
    async(req,res) => {
        const usuario = req.user;
        try{

            const {segredo, qrcode } = geraSegredo(usuario.email);
           
            usuario.segredoOtp = segredo;

            await usuario.save();

            console.log("🚀 ~ AAAAAAA~ qrcode:", qrcode)
            return res.send(qrcode);

        } catch(e){
            logger.error(`Erro ma geração do segredo do TOTP ${e.message}`);

            return res.status(500).json({
                sucesso: false,
                erro: e.message,
            });

        }
    });

module.exports = router;
