const { TopClients } = require('../models');
const { logger } = require('../utils');

const buscaRankingUsuarios = async (dia) => {
    try {
        const inicioDoDia = new Date(dia.setHours(0, 0, 0, 0));
        const fimDoDia = new Date(dia.setHours(23, 59, 59, 999));
      
        return await TopClients.aggregate([
            {
                "$match": {
                    "dia": { "$gte": inicioDoDia, "$lte": fimDoDia }
                }
            },
            { "$sort": { "dia": -1 } },
            {
                "$group": {
                    "_id": "$dia",
                    "dia": { "$first": "$dia" },
                    "gainers": { "$first": "$gainers" },
                    "loosers": { "$first": "$loosers" }
                }
            },
            { "$unset": "_id" }
        ])
        .then(async (ranking) => {
            if (ranking && ranking.length > 0) {
                await TopClients.populate(ranking, { path: 'gainers.usuario loosers.usuario', select: 'nome' });
            }
            return ranking;
        });

       
    } catch (e) {
        logger.error(`Erro ao buscar ranking no banco: ${e.message}`);
        
    }
};

module.exports = { buscaRankingUsuarios };