'use strict';

const fs = require('fs');
const path = require('path');
const axios = require('axios');

function validateUrl(rawUrl) {
  let parsed;

  try {
    parsed = new URL(rawUrl);
  } catch {
    const err = new Error('URL inválida');
    err.statusCode = 400;
    throw err;
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    const err = new Error('A URL deve ser http ou https');
    err.statusCode = 400;
    throw err;
  }
}

async function downloadFile(url, destination) {
  validateUrl(url);

  const dir = path.dirname(destination);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    timeout: 60_000,
    maxContentLength: 100 * 1024 * 1024,
    maxBodyLength: 100 * 1024 * 1024,
  });

  await new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(destination);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  return destination;
}

module.exports = { downloadFile };
