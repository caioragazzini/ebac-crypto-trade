const { Cotacao } = require('../models');
const { buscaCotacoesOnline } = require('../services');
const { logger } = require('../utils');

var cotacoesWorker = async(_job, done) => {
    logger.info('Buscando Cotações...');

    const cotacoes = await buscaCotacoesOnline();

    logger.info('Cotações requisitadas com sucesso...');

    await Cotacao.insertMany(cotacoes);

    logger.info('Cotações inseridas no banco!');

    done();

};

module.exports = cotacoesWorker;