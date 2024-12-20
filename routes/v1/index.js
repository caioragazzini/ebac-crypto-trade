const express = require('express');
require('./auth/jwt');
const passport = require('passport');

const statusRouter = require('./status');
const usuariosRouter = require('./usuarios');
const authRouter = require('./auth');
const depositosRouter = require('./depositos');
const saquesRouter = require('./saques');
const cancelarDepositosRouter = require('./cancelar');
const cotacoesRouter = require('./cotacoes');

const router = express.Router();

router.use('/status', statusRouter);
router.use('/usuarios', usuariosRouter);
router.use('/auth', authRouter);
router.use('/cotacoes', cotacoesRouter);
router.use('/depositos', passport.authenticate('jwt', {session: false}), depositosRouter);
router.use('/saques', passport.authenticate('jwt', {session: false}), saquesRouter);
router.use('/cancelar', passport.authenticate('jwt', {session: false}), cancelarDepositosRouter);

module.exports = router;
