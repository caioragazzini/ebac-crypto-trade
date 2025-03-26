const express = require('express');

const { logger } = require('../../utils');
const { logaUsuario, confirmaConta, enviaEmailDeRecuperacao, validaTokenAlteracaoDeSenha } = require('../../services');


const router = express.Router();

router.post('/', async(req, res)=>{
    try{
        const { email, senha } = req.body;

        const jwt = await logaUsuario(email, senha);
        res.status(200).json({
            sucesso: true,
            jwt: jwt,
        });

    }catch(e){
        logger.error(`Erro na autenticação: ${e.message}`);

        if (e.message.match('confirmado')) {

            res.status(401).json({
                sucesso: false,
                erro: e.message,
    
            });
        } else {

            res.status(401).json({
                sucesso: false,
                erro: 'Email ou senhas invalidos'
    
            });
        }
       
    }
});

router.get('/confirma-conta', async(req,res) =>{
    try{

        const { token, redirect } = req.query;
        await confirmaConta(token);

        res.redirect(redirect);
    } catch(e){
        logger.error(`Erro na confirmacao de conta: ${e.message}`);
        res.status(422).json({
            sucesso: false,
            erro: e.message,
        })
    }
});

router.get('/pede-recuperacao', async(req,res)=>{
    try{
        const { email, redirect } = req.query;

        await enviaEmailDeRecuperacao(email, redirect);
        res.status(200).json({
            sucesso: true,
            messagem: 'Se voce possui um cadastro você receberá o email',
        });

    } catch(e){
        logger.error(`Erro no envio da recuperação de senha: ${e.message}`),

        res.json(422).json({
            sucesso:false,
            erro: e.message
        });

    }

});

router.get('valida-token', async(req,res)=>{
    try{
        const { token, redirect }= req.query;

        const jwt = await validaTokenAlteracaoDeSenha(token);

        res.redirect(`${redirect}?jwt=${jwt}`);

    } catch(e)
    {
        logger.error(`Erro no validação do token de recuperação de senha: ${e.message}`),

        res.json(422).json({
            sucesso:false,
            erro: e.message
        });

    }
})

module.exports = router;

/**
 * @openapi
 * /v1/auth:
 *   post:
 *     description: Autentica um usuário e retorna um token JWT
 *     tags:
 *       - autenticacao
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@email.com"
 *               senha:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 jwt:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciais inválidas ou conta não confirmada
 * /v1/auth/confirma-conta:
 *   get:
 *     description: Confirma a conta de um usuário
 *     tags:
 *       - autenticacao
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: redirect
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Conta confirmada, redirecionamento efetuado
 *       422:
 *         description: Erro ao confirmar conta
 * /v1/auth/pede-recuperacao:
 *   get:
 *     description: Solicita recuperação de senha
 *     tags:
 *       - autenticacao
 *     parameters:
 *       - name: email
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: redirect
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email de recuperação enviado
 *       422:
 *         description: Erro ao enviar recuperação de senha
 * /v1/auth/valida-token:
 *   get:
 *     description: Valida token de recuperação de senha e redireciona com JWT
 *     tags:
 *       - autenticacao
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: redirect
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Token válido, redirecionamento efetuado
 *       422:
 *         description: Erro ao validar token de recuperação de senha
 */
