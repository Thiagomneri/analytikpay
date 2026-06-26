'use strict';

const path = require('path');
const { storageClient } = require('../../config/gcp');

const BUCKET_NAME = process.env.GCS_BUCKET;
if (!BUCKET_NAME) {
  throw new Error('Variável de ambiente GCS_BUCKET não configurada');
}

async function uploadFile(filePath) {
  const remotePath = `temp/${path.basename(filePath)}`;

  await storageClient.bucket(BUCKET_NAME).upload(filePath, {
    destination: remotePath,
  });

  return `gs://${BUCKET_NAME}/${remotePath}`;
}

async function readFiles(prefix) {
  const [files] = await storageClient.bucket(BUCKET_NAME).getFiles({ prefix });

  return Promise.all(
    files.map(async (file) => {
      const [contents] = await file.download();
      return contents;
    }),
  );
}

async function deleteFiles(prefix) {
  const [files] = await storageClient.bucket(BUCKET_NAME).getFiles({ prefix });

  await Promise.all(files.map((file) => file.delete()));
}

module.exports = { uploadFile, readFiles, deleteFiles, BUCKET_NAME };
