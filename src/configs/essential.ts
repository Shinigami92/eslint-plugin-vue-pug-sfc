export = {
  extends: require.resolve('./base'),
  rules: {
    'vue-pug-sfc/use-v-on-exact': 'error',
    'vue-pug-sfc/valid-template-root': 'error',
    'vue-pug-sfc/valid-v-else-if': 'error',
    'vue-pug-sfc/valid-v-else': 'error',
    'vue-pug-sfc/valid-v-for': 'error',
    'vue-pug-sfc/valid-v-if': 'error',
  },
};
