import type { Rule } from 'eslint';
import { processRule } from '../utils';

export default {
  meta: {},
  create(context) {
    return processRule(context, () => {
      return {};
    });
  },
} as Rule.RuleModule;
