const { buscaRankingUsuarios } = require('../services');
const { logger } = require('../utils');
const { TopClients } = require('../models');

const rankingUsuariosWorker = async (job, done) => {
  try {
    logger.info(`Buscando Ranking de Usuários... Tentativa ${job.attemptsMade + 1} / ${job.opts.attempts}`);

    const dia = new Date();
    const ranking = await buscaRankingUsuarios(dia);

    if (!ranking) {
      logger.warn('⚠️ Nenhum ranking encontrado para hoje.');
      return done();
    }

    const rankingComDia = {
      ...ranking,
      dia: new Date().toISOString(),
    };

    logger.info('✅ Ranking de usuários requisitado com sucesso!');
    console.log("🚀 ~ rankingUsuariosWorker ~ rankingComDia:", rankingComDia);

    await TopClients.create(rankingComDia);

    logger.info('✅ Ranking de usuários inserido no banco com sucesso!');
    done();

  } catch (err) {
    logger.error(`❌ Erro ao processar o job de ranking de usuários: ${err.message}`);
    done(err);
  }
};

module.exports = rankingUsuariosWorker;
