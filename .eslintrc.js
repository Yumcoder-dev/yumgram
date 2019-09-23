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
          ['@components', './src/components/index/public.js'],
          ['@components-shared', './src/components/index/internal/shared.js'],
          ['@login', './src/components/login/index/public.js'],
          ['@login-shared', './src/components/login/index/internal/shared.js'],
          ['@login-components', './src/components/login/index/internal/components.js'],
          ['@login-widgets', './src/components/login/index/internal/widgets.js'],
          ['@im', './src/components/im/index/public.js'],
          ['@im-shared', './src/components/im/index/internal/shared.js'],
          ['@im-components', './src/components/im/index/internal/components.js'],
          ['@im-widgets', './src/components/im/index/internal/widgets.js'],
          ['@yumjs', './src/scripts/yumjs/index.js'],
          ['@appjs', './src/scripts/appjs/index.js'],
          ['@locale', './src/locales/i18n.js'],
        ],
    },
  },
};
