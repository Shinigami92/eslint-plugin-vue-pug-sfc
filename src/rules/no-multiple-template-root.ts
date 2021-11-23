import type { Rule } from 'eslint';
import { processRule } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow adding multiple root nodes to the template',
      categories: ['essential'],
      url: 'https://eslint.vuejs.org/rules/no-multiple-template-root.html'
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
