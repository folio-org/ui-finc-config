// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

// add '@k-int' for test in SourceManagementForm.test.js
// in ContactFieldArray.js we import { useKiwtFieldArray } from '@k-int/stripes-kint-components';
const esModules = ['@folio', 'ky', '@k-int'].join('|');

module.exports = {
  collectCoverageFrom: [
    '**/(lib|src)/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/test/**',
  ],
  coverageDirectory: './artifacts/coverage-jest/',
  coverageReporters: ['lcov'],
  reporters: ['jest-junit', 'default'],
  transform: { '^.+\\.(js|jsx)$': path.join(__dirname, './test/jest/jest-transformer.js') },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleNameMapper: {
    '^.+\\.(css)$': 'identity-obj-proxy',
    '^.+\\.(svg)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jsdom',
  testMatch: ['**/(lib|src)/**/?(*.)test.{js,jsx}'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: [path.join(__dirname, './test/jest/setupTests.js')],
  setupFilesAfterEnv: [path.join(__dirname, './test/jest/jest.setup.js')],
};
