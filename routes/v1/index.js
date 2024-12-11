const express = require('express');
require('./auth/jwt');
const passport = require('passport');

const statusRouter = require('./status');
const usuariosRouter = require('./usuarios');
const authRouter = require('./auth');
const depositosRouter = require('./depositos');


const router = express.Router();

router.use('/status', statusRouter);
router.use('/usuarios', usuariosRouter);
router.use('/auth', authRouter);
router.use('/depositos', passport.authenticate('jwt', {session: false}), depositosRouter);

module.exports = router;
