const {
  override,
  fixBabelImports,
  addLessLoader,
  // addWebpackAlias,
} = require('customize-cra');
// const path = require('path');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' },
  }),
  // addWebpackAlias({
  //   '@': path.resolve(__dirname, 'src'),
  //   '@components': path.resolve(__dirname, 'src/components'),
  //   '@sys': path.resolve(__dirname, 'src/js/sys'),
  //   '@app': path.resolve(__dirname, 'src/js/app'),
  //   '@locales': path.resolve(__dirname, 'src/locales'),
  // }),
);
