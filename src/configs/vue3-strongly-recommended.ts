export = {
  extends: require.resolve('./vue3-essential'),
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'vue-pug-sfc/attribute-hyphenation': 'warn'
      }
    }
  ]
};
