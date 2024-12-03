const {Usuario} = require('../models');
const bcrypt = require('bcrypt');

const criarUsuario = async(usuario) => {
    if(!usuario.senha){
        throw new Error('O campo senha é obrigatório');
    }
    if(usuario.senha.length <=4){
        throw new Error('O campo senha deve ter no minimo 5 caracteres');
    }
    const hashSenha = await bcrypt.hash(usuario.senha, 10);
    usuario.senha =  hashSenha;

    const {senha, ...usuarioSalvo} = (await Usuario.create(usuario))._doc;

    return usuarioSalvo;

};


module.exports = criarUsuario;