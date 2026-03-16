const path = require('path');
const config = require('@folio/jest-config-stripes');

const esModules = [
  '@folio',
  'ky',
  'uuid'
].join('|');

module.exports = {
  ...config,
  // default testMatch does not include .ts. Remove next line if .ts will be added in @folio/jest-config-stripes/
  testMatch: ['**/(lib|src)/**/?(*.)test.{js,jsx,ts,tsx}'],
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './test/jest/setupFiles.js'),
  ],
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
};
