const { Relatorio } = require('../models');

const geraPnl = async(usuario)=> {

    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const relatorio = await Relatorio.aggregate([
        {
            $match: {
                usuarioId: usuario._id,
                data: { $gte: ontem},
            }
        },
        {
            $sort: {data: -1}
        }
    ]);

    if(relatorio.length === 0){
        return 0;
    }
    if(relatorio.length === 1){
        return relatorio[0].saldo;
    }

    return relatorio[0].saldo - relatorio[1].saldo;


};

module.exports = geraPnl;