export = {
  extends: require.resolve('./essential'),
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'vue-pug-sfc/attribute-hyphenation': 'warn',
        'vue-pug-sfc/component-name-in-template-casing': 'warn',
      },
    },
  ],
};
