import type { Rule } from 'eslint';

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of `this` in template',
      categories: ['vue3-recommended', 'recommended'],
      url: 'https://eslint.vuejs.org/rules/this-in-template.html'
    },
    fixable: 'code',
    schema: [
      {
        enum: ['always', 'never']
      }
    ]
  },
  create(context) {
    console.log('create', context);

    return {};
  }
} as Rule.RuleModule;
