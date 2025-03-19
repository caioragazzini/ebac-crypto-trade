const nodemailer = require('nodemailer');
const ejs = require('ejs');
const { Usuario } = require('../models');
const  jsonWebToken  = require('jsonwebtoken');


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,

});

const enviaEmailDeConfirmacao= async (usuario, urlDeRedirecionamento) => {
    const parametros ={
        nome: usuario.nome,
        linkDeConfirmacao: `${process.env.URL_DA_CRYPTOTRADE}/V1/auth/confirma-conta?token=${usuario.tokenDeConfirmacao}&redirect=${urlDeRedirecionamento}`
    };
    await transporter.sendMail({
        from: '"CryptoTrade" <noreply@cryptotrade.com.br> ',
        to: usuario.email,
        subject: 'Confirme a sua conta',
        text: await ejs.renderFile('emails/confirmacao/template.txt', parametros) ,
        html: await ejs.renderFile('emails/confirmacao/template.html', parametros),
    })
};

const enviaEmailDeRecuperacao = async(email, urlDeRedirecionamento) =>{
    if(!urlDeRedirecionamento){
        throw new Error('Deve ser enviado um parametro com a URL de redirecionamento no redirect');
    }
    if(!email){
        throw new Error('Deve ser enviado um parametro com o email que deseja para recuperação de senha de redirecionamento no redirect');
    }

    const usuario= await Usuario.findOne({email});
    if(usuario){
        const token = jsonWebToken.sign(
        {
            token: usuario.tokenDeRecuperacao
        }, 
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: '5 minutes',
        },
    );
    const parametros = { 
        nome: usuario.nome,
        linkDeRecuperacao: `${ process.env.URL_DA_CRYPTOTRADE}/v1/auth/valida-token?token=${token}&redirect=${urlDeRedirecionamento}`,
    }
    await transporter.sendMail({
        from: '"CryptoTrade" <noreply@cryptotrade.com.br> ',
        to: usuario.email,
        subject: 'Pedido de recuperação de senha!',
        text: await ejs.renderFile('emails/recuperacao-de-senha/template.txt', parametros) ,
        html: await ejs.renderFile('emails/recuperacao-de-senha/template.html', parametros),
    })

    }
}


const enviaEmailDeParabens = async (usuario) => {
    if (!usuario || !usuario.email) {
        console.error("❌ Erro: Usuário inválido ou sem e-mail definido.", usuario);
        return;
    }

    const parametros = { nome: usuario.nome };

    console.log("🚀 Enviando e-mail para:", usuario.email);

    try {
        const text = await ejs.renderFile('emails/usuario-lucro/template.txt', parametros);
        const html = await ejs.renderFile('emails/usuario-lucro/template.html', parametros);

        await transporter.sendMail({
            from: '"CryptoTrade" <noreply@cryptotrade.com.br>',
            to: usuario.email,
            subject: 'Parabéns, você está lucrando!!!',
            text: text,
            html: html,
        });

        console.log(`✅ E-mail enviado com sucesso para ${usuario.email}`);
    } catch (error) {
        console.error(`❌ Erro ao enviar e-mail para ${usuario.email}:`, error.message);
    }
};


module.exports = { 
    transporter,
    enviaEmailDeConfirmacao, 
    enviaEmailDeRecuperacao,
    enviaEmailDeParabens,
};