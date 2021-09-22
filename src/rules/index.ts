import type { Rule } from 'eslint';
import componentNameInTemplateCasing from './component-name-in-template-casing';
import thisInTemplate from './this-in-template';

export default {
  'component-name-in-template-casing': componentNameInTemplateCasing,
  'this-in-template': thisInTemplate
} as Record<string, Rule.RuleModule>;
