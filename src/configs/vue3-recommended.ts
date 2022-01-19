export = {
  extends: require.resolve('./vue3-strongly-recommended'),
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'vue-pug-sfc/this-in-template': 'warn',
      },
    },
  ],
};
