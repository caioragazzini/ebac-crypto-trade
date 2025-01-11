const { Usuario } = require("../models");

const sacaCrypto = async(usuario, codigo, valor)=>{
    const chamadaDeAtualizacao = await Usuario.updateOne({
        id: usuario._id,
        moedas: {
            $elemMatch:{
                codigo: codigo,
                quantidade: {
                    $gte: valor,
                }
            }
        }
    },
    {
        $inc: {
            'moedas.$.quantidade': -valor,
        }
    },
);
if(chamadaDeAtualizacao.matchedCount === 0){
    throw new Error('Voce não possui saldo para sacar esse valor!');

}
return (await Usuario.findOne({id: usuario._id})).moedas;

};

module.exports = sacaCrypto;