export = {
  extends: require.resolve('./base'),
  rules: {
    'vue-pug-sfc/no-dupe-v-else-if': 'error',
    'vue-pug-sfc/no-duplicate-attributes': 'error',
    'vue-pug-sfc/no-use-v-if-with-v-for': 'error',
    'vue-pug-sfc/require-component-is': 'error',
    'vue-pug-sfc/require-v-for-key': 'error',
    'vue-pug-sfc/use-v-on-exact': 'error'
  }
};
