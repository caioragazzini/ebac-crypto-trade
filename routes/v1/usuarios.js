const express = require('express');
const { criarUsuario } = require('../../services');
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

router.get('/me', passport.authenticate('jwt', {session:false}), (req, res)=> {
    res.json({
        sucesso: true,
        usuario: req.user,
    })
});


module.exports = router;