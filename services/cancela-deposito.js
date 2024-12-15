const { Usuario } = require('../models');

const cancelarDeposito = async (usuario, depositoId) => {
    const deposito = usuario.depositos.id(depositoId);

    if (!deposito) {
        throw new Error('Depósito não encontrado');
    }

    if (deposito.cancelado) {
        throw new Error('Este depósito já foi cancelado');
    }

    deposito.cancelado = true;
    await usuario.save();

    return deposito;
};

module.exports = cancelarDeposito;