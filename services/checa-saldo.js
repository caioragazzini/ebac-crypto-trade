const { Usuario } = require('../models');

const checaSaldo = async(usuario) => {

    const operacoes = (await Usuario.aggregate([
        {
            $match: {cpf: usuario.cpf}
        },
        {
            $unwind: { 
                path: "$depositos",
                preserveNullAndEmptyArrays: true,
            }
        },
        //[
            //{_id: ....; depositos:{ valor: xxx }, saques: [...] },
            //{_id: ....; depositos:{ valor: xxx }, saques: [...] },
            //{_id: ....; depositos:{ valor: xxx }, saques: [...] },
            //{_id: ....; depositos:{ valor: xxx }, saques: [...] },
        //]
        {
            $group: {
                _id: "$id",
                depositos: { $sum: "$depositos.valor"},
                saques: { $last: "$saques"}
            }
        },
        //[
            //{_id: ....; depositos:{ valor: xxx }, saques: [...] },
        //]

        {
            $unwind: { 
                path: "$saques",
                preserveNullAndEmptyArrays: true,
            }
        },
        {
            $group: {
                _id: "$id",
                saques: { $sum: "$saques.valor"},
                depositos: { $last: "$depositos" }
                
            }
        }



    ]))[0];
    
    return operacoes.depositos - operacoes.saques;

}

module.exports = checaSaldo;