'use strict';

const fs = require('fs');
const { fileTypeFromFile } = require('file-type');

const SUPPORTED_FORMATS = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];

async function detectFileType(filePath) {
  const detected = await fileTypeFromFile(filePath);

  if (!detected || !SUPPORTED_FORMATS.includes(detected.ext)) {
    throw new Error('Formato de arquivo não suportado');
  }

  const renamedPath = `${filePath}.${detected.ext}`;
  fs.renameSync(filePath, renamedPath);

  return { filePath: renamedPath, mimeType: detected.mime };
}

module.exports = { detectFileType };
