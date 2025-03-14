const {Usuario} = require('../models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

//TODO
// const { enviaEmailDeConfirmacao} = require('.envia-email');

const criarUsuario = async(usuario, urlDeRedirecionamento) => {
    if(!usuario.senha){
        throw new Error('O campo senha é obrigatório');
    }
    if(usuario.senha.length <=4){
        throw new Error('O campo senha deve ter no minimo 5 caracteres');
    }
    const hashSenha = await bcrypt.hash(usuario.senha, 10);
    usuario.senha =  hashSenha;

    usuario.tokenDeConfirmacao = crypto.randomBytes(32).toString('hex');
    const {senha, ...usuarioSalvo} = (await Usuario.create(usuario))._doc;

    //TODO
    //await enviaEmailDeConfirmacao(usuarioSalvo, urlDeRedirecionamento);

    return usuarioSalvo;

};


module.exports = criarUsuario;