require('dotenv').config();

const { mongoose } = require('mongoose');

const { Corretora, connect } = require('./models');
const { CNPJ, RESERVA_MINIMA } = require('./constants');

(async () => {
    await connect();

    await Corretora.findOneAndUpdate({
        cnpj: CNPJ
    },{
        caixa: RESERVA_MINIMA
    },{
        upsert: true,
    });
    await mongoose.disconnect();

})();

