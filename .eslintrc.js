module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'react-app',
    'airbnb',
    'plugin:flowtype/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'flowtype'],
  rules: {
    'react/prop-types': 'off',
  },
  settings: {
    'import/resolver': {
      alias: [
          ['@', './src/'],
          ['@components', './src/components/index/index.public.js'],
          ['@components-shared', './src/components/index/index.shared.js'],
          ['@login', './src/components/login/index/public'],
          ['@login-shared', './src/components/login/index/internal/shared'],
          ['@login-components', './src/components/login/index/internal/components'],
          ['@login-widgets', './src/components/login/index/internal/widgets'],
          ['@im', './src/components/im/index.js'],
          ['@yumjs', './src/scripts/yumjs/index.js'],
          ['@appjs', './src/scripts/appjs/index.js'],
          ['@locale', './src/locales/i18n.js'],
        ],
    },
  },
};
