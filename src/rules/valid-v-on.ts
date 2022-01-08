import type { Rule } from 'eslint';
import { processRule } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid `v-on` directives',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/valid-v-on.html',
    },
    fixable: undefined,
    schema: [
      {
        type: 'object',
        properties: {
          modifiers: {
            type: 'array',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unsupportedModifier:
        "'v-on' directives don't support the modifier '{{modifier}}'.",
      avoidKeyword:
        'Avoid using JavaScript keyword as "v-on" value: {{value}}.',
      expectedValueOrVerb:
        "'v-on' directives require a value or verb modifier (like 'stop' or 'prevent').",
    },
  },
  create(context) {
    return processRule(context, () => {
      return {};
    });
  },
} as Rule.RuleModule;
