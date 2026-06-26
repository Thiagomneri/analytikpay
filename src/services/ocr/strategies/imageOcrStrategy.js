'use strict';

async function extractText(gcsUri, visionClient) {
  const [result] = await visionClient.documentTextDetection({
    image: { source: { imageUri: gcsUri } },
  });

  return result.fullTextAnnotation?.text || '';
}

module.exports = { extractText };
