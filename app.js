require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const passport = require('passport');

const router = require('./routes');

const app = express();

// configurando autenticação
app.use(passport.initialize());

// configurando formatos de parâmetros
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// declarando rotas
app.use('/', router);

// caso nenhuma rota de match, redireciona para a 404
app.use(function(_req, _res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, _req, res, _next) {
  res.status(err.status || 500);
  res.json({
    sucesso: false,
    erro: err.message,
  });
});

module.exports = app;
