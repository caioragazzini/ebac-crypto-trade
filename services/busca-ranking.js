const { buscaCotacoesOnline, buscaCotacoesNoBanco } = require('./busca-cotacoes');
const { RankingDiario } =require('../models')
const { logger } = require('../utils');

const calculaRankingDiario = async () => {
  try {
    
    const cotacoesHoje = await buscaCotacoesOnline();
    const cotacoesOntem = await buscaCotacoesNoBanco();

    const mapaCotacoesOntem = cotacoesOntem.reduce((map, { moeda, valor }) => {
      map[moeda] = valor;
      return map;
    }, {});

   
    const variacoes = cotacoesHoje.map(({ moeda, valor: ultimaCotacaoHoje }) => {
      const ultimaCotacaoOntem = mapaCotacoesOntem[moeda] || 0; 
      const variacao =
        ultimaCotacaoOntem > 0
          ? ((ultimaCotacaoHoje - ultimaCotacaoOntem) / ultimaCotacaoOntem) * 100
          : 0; 

      return { moeda, variacao };
    });

    const gainers = variacoes
      .filter(v => v.variacao > 0)
      .sort((a, b) => b.variacao - a.variacao)
      .slice(0, 3);

    const loosers = variacoes
      .filter(v => v.variacao < 0)
      .sort((a, b) => a.variacao - b.variacao)
      .slice(0, 3);

    
    return { gainers, loosers };
  } catch (e) {
    logger.error(`Erro ao calcular o ranking diário: ${e.message}`);
    
  }
};

const buscaRankingNoBanco = async (dia) => {
  try {
      
      const inicioDoDia = new Date(dia.setHours(0, 0, 0, 0));
      const fimDoDia = new Date(dia.setHours(23, 59, 59, 999));

      return await RankingDiario.aggregate([
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
          {
              "$unset": "_id"
          }
      ]);
      
     
  } catch (e) {
    logger.error(`Erro ao buscar ranking no banco: ${e.message}`);
 
  }
};


module.exports = { calculaRankingDiario, buscaRankingNoBanco };
