import type { Rule } from 'eslint';
import componentNameInTemplateCasing from './component-name-in-template-casing';
import thisInTemplate from './this-in-template';

export default {
  'this-in-template': thisInTemplate,
  'component-name-in-template-casing': componentNameInTemplateCasing
} as Record<string, Rule.RuleModule>;
