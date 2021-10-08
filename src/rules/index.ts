import type { Rule } from 'eslint';
import attributeHyphenation from './attribute-hyphenation';
import componentNameInTemplateCasing from './component-name-in-template-casing';
import noDupeVElseIf from './no-dupe-v-else-if';
import noDuplicateAttributes from './no-duplicate-attributes';
import noTemplateKey from './no-template-key';
import noTextareaMustache from './no-textarea-mustache';
import noUseVIfWithVFor from './no-use-v-if-with-v-for';
import requireComponentIs from './require-component-is';
import requireVForKey from './require-v-for-key';
import thisInTemplate from './this-in-template';
import useVOnExact from './use-v-on-exact';

export default {
  'attribute-hyphenation': attributeHyphenation,
  'component-name-in-template-casing': componentNameInTemplateCasing,
  'no-dupe-v-else-if': noDupeVElseIf,
  'no-duplicate-attributes': noDuplicateAttributes,
  'no-template-key': noTemplateKey,
  'no-textarea-mustache': noTextareaMustache,
  'no-use-v-if-with-v-for': noUseVIfWithVFor,
  'require-component-is': requireComponentIs,
  'require-v-for-key': requireVForKey,
  'this-in-template': thisInTemplate,
  'use-v-on-exact': useVOnExact
} as Record<string, Rule.RuleModule>;
