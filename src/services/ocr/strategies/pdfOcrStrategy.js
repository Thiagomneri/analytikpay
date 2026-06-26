'use strict';

const { readFiles, deleteFiles, BUCKET_NAME } = require('../../storage/storageService');

async function extractText(gcsUri, visionClient) {
  const batchId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const batchPrefix = `resultados/${batchId}/`;

  const [operation] = await visionClient.asyncBatchAnnotateFiles({
    requests: [
      {
        inputConfig: { gcsSource: { uri: gcsUri }, mimeType: 'application/pdf' },
        features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
        outputConfig: {
          gcsDestination: { uri: `gs://${BUCKET_NAME}/${batchPrefix}` },
          batchSize: 1,
        },
      },
    ],
  });

  await operation.promise();

  const resultFiles = await readFiles(batchPrefix);

  if (resultFiles.length === 0) {
    throw new Error(`Nenhum resultado encontrado em gs://${BUCKET_NAME}/${batchPrefix}`);
  }

  await deleteFiles(batchPrefix);

  return resultFiles
    .map((contents) => {
      const annotation = JSON.parse(contents);
      return annotation.responses[0].fullTextAnnotation?.text || '';
    })
    .join('');
}

module.exports = { extractText };
