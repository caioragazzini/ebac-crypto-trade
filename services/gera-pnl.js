const { Relatorio } = require('../models');

const geraPnl = async (usuario) => {
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  ontem.setHours(0, 0, 0, 0); 

  const relatorio = await Relatorio.aggregate([
    {
      $match: {
        usuario: usuario._id, 
        data: { $gte: ontem },
      },
    },
    {
      $sort: { data: -1 },
    },
  ]);

  if (relatorio.length === 0) {
    return 0;
  }

  if (relatorio.length === 1) {
    return relatorio[0].saldo;
  }

  return relatorio[0].saldo - relatorio[1].saldo;
};

module.exports = geraPnl;
