const { Usuario, Relatorio } = require("../models");
const { checaSaldo } = require("../services");
const { logger } = require("../utils");

const relatorioWorker = async(__, done)=>{
    try{
        logger.info("Buscando todos os usuarios da base...")

        const usuarios = await Usuario.find().limit(10);
    
        for(const usuario of usuarios){
            logger.info(`Criando relatorios para usuario ${usuario._id}`);
    
            await Relatorio.create({
                usuarioId: usuario._id,
                data: new Date(),
                saldo: await checaSaldo(usuario),
            }) 
    
        }
    
        logger.info('Relatorios criados com sucesso');
        done();
    }
    catch(err){
        logger.info(`Erro ao processar o job ${err.message}`);
        done(err);

    }
   

};

module.exports = relatorioWorker;