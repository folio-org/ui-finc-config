const path = require('path');
const config = require('@folio/jest-config-stripes');

const esModules = [
  '@folio',
  '@k-int',
  'ky',
  'uuid'
].join('|');

module.exports = {
  ...config,
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './test/jest/setupFiles.js'),
  ],
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
};
