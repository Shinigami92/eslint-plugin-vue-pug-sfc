import type { Rule } from 'eslint';
import attributeHyphenation from './attribute-hyphenation';
import componentNameInTemplateCasing from './component-name-in-template-casing';
import noDeprecatedDollarScopedslotsApi from './no-deprecated-dollar-scopedslots-api';
import noDeprecatedFilter from './no-deprecated-filter';
import noTemplateKey from './no-template-key';
import noTextareaMustache from './no-textarea-mustache';
import noUseVIfWithVFor from './no-use-v-if-with-v-for';
import requireComponentIs from './require-component-is';
import requireVForKey from './require-v-for-key';
import thisInTemplate from './this-in-template';
import useVOnExact from './use-v-on-exact';
import validTemplateRoot from './valid-template-root';
import validVElse from './valid-v-else';
import validVElseIf from './valid-v-else-if';
import validVFor from './valid-v-for';
import validVIf from './valid-v-if';

export default {
  'attribute-hyphenation': attributeHyphenation,
  'component-name-in-template-casing': componentNameInTemplateCasing,
  'no-deprecated-dollar-scopedslots-api': noDeprecatedDollarScopedslotsApi,
  'no-deprecated-filter': noDeprecatedFilter,
  'no-template-key': noTemplateKey,
  'no-textarea-mustache': noTextareaMustache,
  'no-use-v-if-with-v-for': noUseVIfWithVFor,
  'require-component-is': requireComponentIs,
  'require-v-for-key': requireVForKey,
  'this-in-template': thisInTemplate,
  'use-v-on-exact': useVOnExact,
  'valid-template-root': validTemplateRoot,
  'valid-v-else-if': validVElseIf,
  'valid-v-else': validVElse,
  'valid-v-for': validVFor,
  'valid-v-if': validVIf,
} as Record<string, Rule.RuleModule>;
