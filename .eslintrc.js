module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    babelOptions: {
      configFile: './.babelrc',
    },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'import/extensions': [
      'warn',
      'ignorePackages',
      {
        js: 'always',
        ts: 'always',
      },
    ],
  },
  settings: {},
  plugins: ['@babel'],
};
