import type { Rule } from 'eslint';
import { processRule } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid template root',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/valid-template-root.html'
    },
    fixable: undefined,
    schema: []
  },
  create(context) {
    return processRule(context, () => {
      return {};
    });
  }
} as Rule.RuleModule;
