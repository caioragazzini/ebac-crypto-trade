const { Cotacao } = require('../models');
const { buscaCotacoesOnline } = require('../services');
const { logger } = require('../utils');

var cotacoesWorker = async(job, done) => {

    try{
        logger.info(`Buscando Cotações...Tentativa ${job.attemptsMade + 1 } / ${job.opts.attempts}`);

        const cotacoes = await buscaCotacoesOnline();

        logger.info('Cotações requisitadas com sucesso...');

        await Cotacao.insertMany(cotacoes);

        logger.info('Cotações inseridas no banco!');

        done();

    }catch(err){
        logger.error(`Erro ao processar o job ${err.message}`);
        done(err);
    }
    
    

};

module.exports = cotacoesWorker;