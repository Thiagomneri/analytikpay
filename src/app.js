'use strict';

const express = require('express');
const boletoRoutes = require('./modules/boleto.routes');

const app = express();

app.use(express.json());
app.use('/analyticpay/boleto', boletoRoutes);

module.exports = app;
