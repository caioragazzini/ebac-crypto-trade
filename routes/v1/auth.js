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