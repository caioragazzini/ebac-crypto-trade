const { Usuario, Cotacao } = require('../models');

async function calculaLucro() {
  const usuarios = await Usuario.find().populate('depositos saques moedas');

  const cotacoes = await Cotacao.find();

  const cotacoesMap = cotacoes.reduce((acc, cotacao) => {
    acc[cotacao.moeda] = cotacao.valor;
    return acc;
  }, {});
  console.log("🚀 ~ cotacoesMap ~ cotacoesMap:", cotacoesMap)

  const usuariosComLucro = [];

  for (let usuario of usuarios) {
    let lucroTotal = 0;

    const totalDepositos = usuario.depositos
      .filter((deposito) => !deposito.cancelado)
      .reduce((acc, deposito) => acc + deposito.valor, 0);

    const totalSaques = usuario.saques.reduce((acc, saque) => acc + saque.valor, 0);

    const totalMoedas = usuario.moedas.reduce((acc, moeda) => {
      let cotacao = cotacoesMap[moeda.codigo];
      if (moeda.codigo === 'BRL') {
        cotacao = 1; 
      }
      if (cotacao) {
        const valorMoeda = moeda.quantidade * cotacao;
        if (!isNaN(valorMoeda)) {
          acc += valorMoeda;
        }
      }
      return acc;
    }, 0);

    lucroTotal = totalDepositos - totalSaques + totalMoedas;

    console.log(`Usuário: ${usuario.nome}, Lucro: R$${lucroTotal.toFixed(2)}`);

    if (lucroTotal > 1000) {
      usuariosComLucro.push({ nome: usuario.nome, lucro: lucroTotal , email: usuario.email});
    }
  }

  console.log('Usuários com lucro maior que R$1.000,00:', usuariosComLucro);
  return usuariosComLucro;
}

module.exports = { calculaLucro };