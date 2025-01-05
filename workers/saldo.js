const { Corretora } = require('../models');
const { CNPJ, RESERVA_MINIMA } = require('../constants');
const { logger } = require('../utils');

var saldoWorker = async(job, done) => {

    try{
        logger.info(`Checando aumento de saldos...Tentativa ${job.attemptsMade + 1 } / ${job.opts.attempts}`);

        const corretora  = await Corretora.findOne({
            cnpj: CNPJ,
        })

        if(corretora.caixa < RESERVA_MINIMA){
            corretora.caixa += RESERVA_MINIMA;
        }      
        await corretora.save();

        logger.info('reserva atualizada com sucesso...');

        done();

    }catch(err){
        logger.error(`Erro ao processar o job ${err.message}`);
        done(err);
    }

};

module.exports = saldoWorker;