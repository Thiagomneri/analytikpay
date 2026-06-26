'use strict';

const express = require('express');
const boletoController = require('./boleto.controller');

const router = express.Router();

router.post('/', boletoController.process);

module.exports = router;
