const express = require('express');

const { logger } = require('../../utils');
const { logaUsuario } = require('../../services');

const router = express.Router();

router.post('/', async(req, res)=>{
    try{
        const { email, senha } = req.body;

        const jwt = await logaUsuario(email, senha);
        res.status(200).json({
            sucesso: true,
            jwt: jwt,
        });

    }catch(err){
        logger.error(`Erro na autenticação: ${e.message}`);
        res.status(401).json({
            sucesso: false,
            erro: 'Email ou senhas invalidos'

        })
    }
});

module.exports = router;