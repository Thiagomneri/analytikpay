'use strict';

require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.info(`Serviço rodando em http://0.0.0.0:${PORT}`);
});

server.on('error', (error) => {
  console.error('[Erro] Ao iniciar o servidor:', error);
  process.exit(1);
});
