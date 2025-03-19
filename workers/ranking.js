const { calculaRankingDiario } = require('../services'); 
const { logger } = require('../utils'); 
const { RankingDiario } = require('../models'); 


const rankingWorker = async (job, done) => {
  try {
    logger.info(`Buscando Ranking...Tentativa ${job.attemptsMade + 1 } / ${job.opts.attempts}`);
    
    const ranking = await calculaRankingDiario();
    const rankingComDia = {
      ...ranking,
      dia: new Date().toISOString(),
    };

    logger.info('Ranking requisitados com sucesso...');

  
   
    await RankingDiario.create(rankingComDia);

    logger.info('Ranking inserido no banco!');

    done();

  } catch (err) {
   logger.error(`Erro ao processar o job ${err.message}`);
        done(err);
  }
};

module.exports = rankingWorker;

