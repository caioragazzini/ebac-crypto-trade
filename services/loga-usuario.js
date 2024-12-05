const  jsonWebToken  = require("jsonwebtoken");
const { Usuario } = require("../models");
const bcrypt = require('bcrypt');

const logaUsuario = async(email, senha)=>{
    if(!email || !senha){
        throw new Error('Campo senha e email são obrigatorios')
    }
    const usuario = await Usuario.findOne({email:email}).select('senha');

    if(!usuario){
        throw new Error('Usuário não encontrado');        
    }

    if(!await bcrypt.compare(senha, usuario.senha)){
        throw new Error('Senha inválida')

    }

    return jsonWebToken.sign({id : usuario._id}, process.env.JWT_SECRET_KEY);
};

module.exports = logaUsuario;