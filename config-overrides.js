/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackModuleRule,
  // addWebpackAlias,
  // eslint-disable-next-line import/no-extraneous-dependencies
} = require('customize-cra');
// const path = require('path');

module.exports = override(
  config => ({
    ...config,
    output: {
      ...config.output,
      globalObject: 'this',
    },
  }),
  addWebpackModuleRule({
    test: /\.worker\.js$/,
    use: { loader: 'worker-loader' },
  }),
  // addWebpackModuleRule({
  //   test: /\.wasm$/,
  //   use: { loader: 'wasm-loader' },
  // }),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#5682a3' },
  }),
  // addWebpackAlias({
  //   '@': path.resolve(__dirname, 'src'),
  //   '@components': path.resolve(__dirname, 'src/components'),
  //   '@sys': path.resolve(__dirname, 'src/js/sys'),
  //   '@app': path.resolve(__dirname, 'src/js/app'),
  //   '@locales': path.resolve(__dirname, 'src/locales'),
  // }),
);
