import type { Rule } from 'eslint';
import { processRule } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid `v-for` directives',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/valid-v-for.html'
    },
    fixable: undefined,
    schema: [],
    messages: {
      requireKey: "Custom elements in iteration require 'v-bind:key' directives.",
      keyUseFVorVars:
        "Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive.",
      unexpectedArgument: "'v-for' directives require no argument.",
      unexpectedModifier: "'v-for' directives require no modifier.",
      expectedValue: "'v-for' directives require that attribute value.",
      unexpectedExpression: "'v-for' directives require the special syntax '<alias> in <expression>'.",
      invalidEmptyAlias: "Invalid alias ''.",
      invalidAlias: "Invalid alias '{{text}}'."
    }
  },
  create(context) {
    return processRule(context, () => {
      return {};
    });
  }
} as Rule.RuleModule;
