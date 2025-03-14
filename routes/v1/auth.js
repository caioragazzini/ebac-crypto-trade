const express = require('express');

const { logger } = require('../../utils');
const { logaUsuario, confirmaConta } = require('../../services');


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

module.exports = router;