
module.exports = {
    criarUsuario: require('./cria-usuario'),
    logaUsuario: require('./loga-usuario'),
    checaSaldo: require('./checa-saldo'),
    trocaMoedas: require('./troca-moedas'),
    enviaEmail: require('./envia-email'),
    sacaCryptos: require('./saca-crypto'),
    geraPnl: require('./gera-pnl'),
    cancelarDeposito: require('./cancela-deposito'),
    buscaCotacoesOnline: require('./busca-cotacoes').buscaCotacoesOnline,
    buscaCotacoesNoBanco: require('./busca-cotacoes').buscaCotacoesNoBanco,
    calculaRankingDiario: require('./busca-ranking').calculaRankingDiario,
    buscaRankingNoBanco: require('./busca-ranking').buscaRankingNoBanco,
    buscaRankingUsuarios: require('./busca-ranking-usuarios').buscaRankingUsuarios,
   
};