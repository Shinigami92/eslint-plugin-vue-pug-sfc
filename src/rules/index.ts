import type { Rule } from 'eslint';
import thisInTemplate from './this-in-template';

export default {
  'this-in-template': thisInTemplate
} as Record<string, Rule.RuleModule>;
