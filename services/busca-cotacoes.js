const axios =require('axios');

const buscaCotacoes = async()=>{

    const url = `${process.env.COIN_MARKETCAP_URL}/v2/cryptocurrency/quotes/latest`;

    const { data } = await axios.get(url, {

        params: {
            symbol: 'BTC,ETH,BNB,XRP,ADA,SOL',
            convert: 'BRL'
        },
        headers:{
            'X-CMC_PRO_API_KEY': process.env.COIN_MARKETCAP_KEY
        }

    });

    const dataDaCotacao = new Date();
    const info = Object.values(data.data);

    return info.map(([cotacao])=>({
        moeda: cotacao.symbol,
        valor: cotacao.quote.BRL.price,
        data: dataDaCotacao,
    }
));

};
module.exports = buscaCotacoes;