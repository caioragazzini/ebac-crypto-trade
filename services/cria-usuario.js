const {Usuario} = require('../models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const { enviaEmailDeConfirmacao} = require('./envia-email');

const criarUsuario = async(usuario, urlDeRedirecionamento) => {
    if(!usuario.senha){
        throw new Error('O campo senha é obrigatório');
    }
    if(usuario.senha.length <=4){
        throw new Error('O campo senha deve ter no minimo 5 caracteres');
    }

    if(!urlDeRedirecionamento){
        throw new Error('A URL de redirecionamento é obrigatória');
    }
    const hashSenha = await bcrypt.hash(usuario.senha, 10);
    usuario.senha =  hashSenha;

    usuario.tokenDeConfirmacao = crypto.randomBytes(32).toString('hex');
    const {senha, ...usuarioSalvo} = (await Usuario.create(usuario))._doc;

   
    await enviaEmailDeConfirmacao(usuarioSalvo, urlDeRedirecionamento);

    return usuarioSalvo;

};


module.exports = criarUsuario;