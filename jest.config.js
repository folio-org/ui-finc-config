const path = require('path');
const config = require('@folio/jest-config-stripes');

const esModules = [
  '@folio',
  'ky',
  'uuid'
].join('|');

module.exports = {
  ...config,
  collectCoverageFrom: [
    '**/(lib|src)/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/test/jest/**',
  ],
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './test/jest/setupFiles.js'),
  ],
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
};
