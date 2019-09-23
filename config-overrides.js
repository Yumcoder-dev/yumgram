/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
// const path = require('path');
const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackModuleRule,
  addWebpackAlias,
  // eslint-disable-next-line import/no-extraneous-dependencies
} = require('customize-cra');
const path = require('path');

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
    modifyVars: {
      'primary-color': '#5682a3',
      'font-size-base': '13px',
      'layout-header-height': '48px',
      'layout-sider-background': '#f0f2f5',
      // 'layout-body-background': '#5682a3',
      'layout-header-background': '#5682a3',
      'layout-header-padding': '0',
    },
  }),
  // also config
  // -- vscode --> root/jsconfig.json
  // -- jest --> package.json
  // -- eslint --> .eslintrc.js
  addWebpackAlias({
    '@': path.resolve(__dirname, './src/'),
    '@components': path.resolve(__dirname, './src/components/index/public'),
    '@components-shared': path.resolve(__dirname, './src/components/index/internal/shared'),
    '@login': path.resolve(__dirname, './src/components/login/index/public'),
    '@login-shared': path.resolve(__dirname, './src/components/login/index/internal/shared'),
    '@login-components': path.resolve(
      __dirname,
      './src/components/login/index/internal/components',
    ),
    '@login-widgets': path.resolve(__dirname, './src/components/login/index/internal/widgets'),
    '@im': path.resolve(__dirname, './src/components/im/index/public'),
    '@im-shared': path.resolve(__dirname, './src/components/im/index/internal/shared'),
    '@im-components': path.resolve(__dirname, './src/components/im/index/internal/components'),
    '@im-widgets': path.resolve(__dirname, './src/components/im/index/internal/widgets'),
    '@yumjs': path.resolve(__dirname, './src/scripts/yumjs/index'),
    '@appjs': path.resolve(__dirname, './src/scripts/appjs/index'),
    '@locale': path.resolve(__dirname, './src/locales/i18n'),
  }),
);
