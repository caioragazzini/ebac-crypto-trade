
module.exports = {
    criarUsuario: require('./cria-usuario'),
    logaUsuario: require('./loga-usuario'),
    checaSaldo: require('./checa-saldo'),
    trocaMoedas: require('./troca-moedas'),
    sacaCryptos: require('./saca-crypto'),
    geraPnl: require('./gera-pnl'),
    cancelarDeposito: require('./cancela-deposito'),
    buscaCotacoesOnline: require('./busca-cotacoes').buscaCotacoesOnline,
    buscaCotacoesNoBanco: require('./busca-cotacoes').buscaCotacoesNoBanco,
    calculaRankingDiario: require('./busca-ranking').calculaRankingDiario,
    buscaRankingNoBanco: require('./busca-ranking').buscaRankingNoBanco,
    buscaRankingUsuarios: require('./busca-ranking-usuarios').buscaRankingUsuarios,
    enviaEmailDeConfirmacao: require('./envia-email').enviaEmailDeConfirmacao,
    enviaEmailDeRecuperacao: require('./envia-email').enviaEmailDeRecuperacao,
    enviaEmailDeParabens: require('./envia-email').enviaEmailDeParabens,
    confirmaConta: require('./confirma-conta'),
    validaTokenAlteracaoDeSenha: require('./valida-token-senha'),
    calculaLucro: require('./calcula-lucro').calculaLucro,
    geraSegredo: require('./otp').geraSegredo,
    validaOtp: require('./otp').validaOtp,
   
};