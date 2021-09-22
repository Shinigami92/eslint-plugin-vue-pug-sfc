export = {
  extends: require.resolve('./strongly-recommended'),
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'vue-pug-sfc/this-in-template': 'warn'
      }
    }
  ]
};
