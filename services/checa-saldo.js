const { Usuario } = require('../models');

const checaSaldo = async (usuario) => {
    const operacoes = (await Usuario.aggregate([
        {
            $match: { cpf: usuario.cpf }
        },
        {
            $project: {
                depositos: {
                    $filter: {
                        input: "$depositos",
                        as: "deposito",
                        cond: { $eq: ["$$deposito.cancelado", false] }
                    }
                },
                saques: "$saques"
            }
        },
        {
            $unwind: {
                path: "$depositos",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: "$_id",
                totalDepositos: { $sum: "$depositos.valor" },
                saques: { $first: "$saques" }
            }
        },
        {
            $unwind: {
                path: "$saques",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: "$_id",
                depositos: { $first: "$totalDepositos" },
                totalSaques: { $sum: "$saques.valor" }
            }
        }
    ]))[0];

    return operacoes ? operacoes.depositos - operacoes.totalSaques : 0;
};

module.exports = checaSaldo;