export = {
  extends: require.resolve('./base'),
  rules: {
    'vue-pug-sfc/no-duplicate-attributes': 'error',
    'vue-pug-sfc/require-component-is': 'error',
    'vue-pug-sfc/require-v-for-key': 'error'
  }
};
