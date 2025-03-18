const { logger } = require('../utils');
const { enviaEmailDeParabens } = require('../services/envia-email')
const { calculaLucro } = require('../services/calcula-lucro');

var lucroUsuarioWorker = async(job, done) => {

    try{

        logger.info(`Checando lucro de usuarios...Tentativa ${job.attemptsMade + 1 } / ${job.opts.attempts}`);

        const usuariosComLucro = await calculaLucro();

        for (const usuario of usuariosComLucro) {
            try {
                await enviaEmailDeParabens(usuario.email);
                logger.info(`E-mail enviado para ${usuario.email}`);
            } catch (error) {
                logger.error(`Erro ao enviar e-mail para ${usuario.email}: ${error.message}`);
            }
        }

        logger.info('lucro atualizado com sucesso...');

        done();

    }catch(err){
        logger.error(`Erro ao processar o job ${err.message}`);
        done(err);
    }

};

module.exports = lucroUsuarioWorker;