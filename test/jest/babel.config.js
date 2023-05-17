const { babelOptions } = require('@folio/stripes-cli');

module.exports = {
  ...babelOptions,
};

// module.exports = {
//   presets: [
//     '@babel/preset-env',
//     ['@babel/preset-react', { 'runtime': 'automatic' }],
//   ],
//   plugins: [
//     '@babel/plugin-proposal-class-properties',
//     ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
//     '@babel/plugin-transform-runtime',
//   ],
// };
