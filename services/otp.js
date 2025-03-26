const qrcode = require('qr-image');
const { authenticator } = require('otplib');

const geraSegredo = (email) => {
    const segredo = authenticator.generateSecret();
    console.log("🚀 ~ geraSegredo ~ segredo:", segredo)

    const optauth = authenticator.keyuri(
        email,
        'CryptoTrade',
        segredo,
    );
    console.log("🚀 ~ geraSegredo ~ optauth:", optauth)

    const imagem = qrcode.imageSync(optauth, { type: 'svg'});

    return{
        segredo,
        qrcode: imagem,
    }
};

const validaOtp = (segredo, token)=>{

    return authenticator.check(token, segredo);

};

module.exports = {
    geraSegredo,
    validaOtp,
}