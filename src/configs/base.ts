export = {
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    templateTokenizer: {
      pug: 'vue-eslint-parser-template-tokenizer-pug'
    },
  },
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['vue-pug-sfc'],
};
