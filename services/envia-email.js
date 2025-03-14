const nodemailer = require('nodemailer');
const ejs = require('ejs');


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,

});

const enviaEmailDeConfirmacao= async (usuario, urlDeRedirecionamento) => {
    const paramentros ={
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




module.exports = { 
    transporter,
    enviaEmailDeConfirmacao
};