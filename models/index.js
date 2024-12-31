const mongoose = require('mongoose');
const UsuarioSchema= require('./usuario');
const CotacaoSchema = require('./cotacao');
const RankingDiarioSchema = require('./ranking-diario');


const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Cotacao = mongoose.model('Cotacao',CotacaoSchema);
const RankingDiario = mongoose.model('RankingDiario',RankingDiarioSchema);

const connect = async () => {
  await mongoose.connect(process.env.MONGO_URL);
}

module.exports = {
  connect,
  Usuario,
  Cotacao,
  RankingDiario,
}
