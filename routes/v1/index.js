const express = require('express');
require('./auth/jwt');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./docs.js');

const statusRouter = require('./status');
const usuariosRouter = require('./usuarios');
const authRouter = require('./auth');
const depositosRouter = require('./depositos');
const saquesRouter = require('./saques');
const cancelarDepositosRouter = require('./cancelar');
const cotacoesRouter = require('./cotacoes');
const buscaRankingRouter = require('./ranking');
const trocasRouter = require('./trocas');
const relatorioRouter = require('./relatorio');
const rankingUsuariosRouter = require('./ranking-usuarios.js');



const router = express.Router();

router.use('/status', statusRouter);
router.use('/usuarios', usuariosRouter);
router.use('/auth', authRouter);
router.use('/cotacoes', cotacoesRouter);
router.use('/ranking', buscaRankingRouter);
router.use('/relatorio', relatorioRouter);
router.use('/trocas', passport.authenticate('jwt', {session: false}), trocasRouter);
router.use('/depositos', passport.authenticate('jwt', {session: false}), depositosRouter);
router.use('/saques', passport.authenticate('jwt', {session: false}), saquesRouter);
router.use('/cancelar', passport.authenticate('jwt', {session: false}), cancelarDepositosRouter);
router.use('/ranking-usuarios', rankingUsuariosRouter);
router.use('/docs', swaggerUi.serve);
router.use('/docs', swaggerUi.setup(swaggerConfig));


module.exports = router;
