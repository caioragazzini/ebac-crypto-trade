require('dotenv').config();

const { Corretora, connect, Usuario, TopClients } = require('./models');
const { CNPJ, RESERVA_MINIMA } = require('./constants');
const { mongoose } = require('mongoose');
const bcrypt = require('bcrypt');  // Importando o bcrypt

// popula base de dados
(async () => {
  await connect();

  await Corretora.findOneAndUpdate({
    cnpj: CNPJ,
  }, {
    caixa: RESERVA_MINIMA,
  }, {
    upsert: true,
  });

  // insere usuários
  const usuarioUm = await Usuario.findOneAndUpdate({
    cpf: '90925683094',
    email: 'juninho@ebac.com.br',
  }, {
    nome: 'Juninho da Silva Santos',
    senha: await bcrypt.hash('ebac1234', 10),
  }, {
    upsert: true,
  });

  const usuarioDois = await Usuario.findOneAndUpdate({
    cpf: '70200659022',
    email: 'mariazinha@ebac.com.br',
  }, {
    nome: 'Mariazinha da silva',
    senha: await bcrypt.hash('ebac1234', 10),
  }, {
    upsert: true,
  });

  const ontem = (new Date()).setDate((new Date()).getDate() - 1);
  const anteOntem = (new Date()).setDate((new Date()).getDate() - 2);
  const tresDiasAtras = (new Date()).setDate((new Date()).getDate() - 3);

  // insere ranking
  await TopClients.insertMany([
    { dia: ontem, gainers: [ { usuario: usuarioUm, variacao: 200 } ], loosers: [ { usuario: usuarioDois, variacao: -1300 }] },
    { dia: anteOntem, gainers: [ { usuario: usuarioDois, variacao: 2000 } ], loosers: [ { usuario: usuarioUm, variacao: -100 }] },
    { dia: tresDiasAtras, gainers: [ { usuario: usuarioDois, variacao: 100 } ], loosers: [ { usuario: usuarioUm, variacao: -2000 }] },
  ]);

  await mongoose.disconnect();
})();
