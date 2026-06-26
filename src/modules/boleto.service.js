'use strict';

const fs = require('fs');
const path = require('path');
const { downloadFile } = require('../services/downloader/downloaderService');
const { detectFileType } = require('../services/fileType/fileTypeDetector');
const { uploadFile } = require('../services/storage/storageService');
const { extractText } = require('../services/ocr/ocrService');
const { parseBillFields } = require('./boleto.parser');

async function execute({ url }) {
  if (!url) {
    const err = new Error('A URL do boleto é obrigatória');
    err.statusCode = 400;
    throw err;
  }

  const tempPath = path.resolve(__dirname, '../temp', `${Date.now()}`);
  let rawPath;
  let filePath;

  try {
    rawPath = await downloadFile(url, tempPath);
    const detected = await detectFileType(rawPath);
    filePath = detected.filePath;

    const gcsUri = await uploadFile(filePath);
    const rawText = await extractText(gcsUri, detected.mimeType);
    const billData = parseBillFields(rawText);

    await fs.promises.unlink(filePath);

    return billData;
  } catch (error) {
    const pathToClean = filePath || rawPath;
    if (pathToClean) {
      try {
        await fs.promises.unlink(pathToClean);
      } catch (_) {}
    }
    throw error;
  }
}

module.exports = { execute };
