'use strict';

const { visionClient } = require('../../config/gcp');
const pdfOcrStrategy = require('./strategies/pdfOcrStrategy');
const imageOcrStrategy = require('./strategies/imageOcrStrategy');

const STRATEGIES = {
  'application/pdf': pdfOcrStrategy,
  'image/jpg': imageOcrStrategy,
  'image/jpeg': imageOcrStrategy,
  'image/png': imageOcrStrategy,
  'image/webp': imageOcrStrategy,
};

function getStrategy(mimeType) {
  const strategy = STRATEGIES[mimeType];
  if (!strategy) {
    throw new Error(`Nenhuma estratégia OCR disponível para o tipo: ${mimeType}`);
  }
  return strategy;
}

async function extractText(gcsUri, mimeType) {
  const strategy = getStrategy(mimeType);
  return strategy.extractText(gcsUri, visionClient);
}

module.exports = { extractText };
