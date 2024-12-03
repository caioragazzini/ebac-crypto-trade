const express = require('express');

const statusRouter = require('./status');
const usuariosRouter = require('./usuarios')

const router = express.Router();

router.use('/status', statusRouter);
router.use('/usuarios', usuariosRouter);

module.exports = router;
