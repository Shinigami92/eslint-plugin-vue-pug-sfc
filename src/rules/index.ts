import type { Rule } from 'eslint';
import componentNameInTemplateCasing from './component-name-in-template-casing';

export default {
  'component-name-in-template-casing': componentNameInTemplateCasing,
} as Record<string, Rule.RuleModule>;
