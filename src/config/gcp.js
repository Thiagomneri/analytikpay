'use strict';

const vision = require('@google-cloud/vision').v1;
const { Storage } = require('@google-cloud/storage');

const visionClient = new vision.ImageAnnotatorClient();
const storageClient = new Storage();

module.exports = { visionClient, storageClient };
