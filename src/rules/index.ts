import type { Rule } from 'eslint';
import attributeHyphenation from './attribute-hyphenation';
import componentNameInTemplateCasing from './component-name-in-template-casing';
import noDeprecatedDollarScopedslotsApi from './no-deprecated-dollar-scopedslots-api';
import noDeprecatedFilter from './no-deprecated-filter';
import thisInTemplate from './this-in-template';

export default {
  'attribute-hyphenation': attributeHyphenation,
  'component-name-in-template-casing': componentNameInTemplateCasing,
  'no-deprecated-dollar-scopedslots-api': noDeprecatedDollarScopedslotsApi,
  'no-deprecated-filter': noDeprecatedFilter,
  'this-in-template': thisInTemplate,
} as Record<string, Rule.RuleModule>;
