const express = require('express');
require('./auth/jwt');

const statusRouter = require('./status');
const usuariosRouter = require('./usuarios');
const authRouter = require('./auth');

const router = express.Router();

router.use('/status', statusRouter);
router.use('/usuarios', usuariosRouter);
router.use('/auth', authRouter);

module.exports = router;
