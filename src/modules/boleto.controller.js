'use strict';

const boletoService = require('./boleto.service');

async function process(req, res) {
  try {
    const data = await boletoService.execute(req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: 'Erro ao processar o boleto' });
  }
}

module.exports = { process };
