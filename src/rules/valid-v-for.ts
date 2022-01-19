import type { Rule } from 'eslint';
import type { AttributeToken, Loc } from 'pug-lexer';
import { processRule } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid `v-for` directives',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/valid-v-for.html',
    },
    fixable: undefined,
    schema: [],
    messages: {
      requireKey:
        "Custom elements in iteration require 'v-bind:key' directives.",
      keyUseFVorVars:
        "Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive.",
      unexpectedArgument: "'v-for' directives require no argument.",
      unexpectedModifier: "'v-for' directives require no modifier.",
      expectedValue: "'v-for' directives require that attribute value.",
      unexpectedExpression:
        "'v-for' directives require the special syntax '<alias> in <expression>'.",
      invalidEmptyAlias: "Invalid alias ''.",
      invalidAlias: "Invalid alias '{{text}}'.",
    },
  },
  create(context) {
    return processRule(context, () => {
      let vForToken: AttributeToken | undefined;
      let keyToken: AttributeToken | undefined;

      return {
        'start-attributes'() {
          vForToken = undefined;
          keyToken = undefined;
        },
        attribute(token) {
          if (token.name.startsWith('v-for')) {
            vForToken = token;
          } else if (/^(v-bind)?:key$/.test(token.name)) {
            keyToken = token;
          }
        },
        'end-attributes'() {
          if (!vForToken) {
            return;
          }

          let messageId: string = '';

          if (vForToken.name.includes(':')) {
            messageId = 'unexpectedArgument';
          } else if (vForToken.name.includes('.')) {
            messageId = 'unexpectedModifier';
          } else if (
            typeof vForToken.val === 'boolean' ||
            (typeof vForToken.val === 'string' &&
              vForToken.val.slice(1, -1).trim().length === 0)
          ) {
            messageId = 'expectedValue';
          }

          if (!messageId) {
            return;
          }

          const loc: Loc = vForToken.loc;

          const columnStart: number = loc.start.column - 1;
          const columnEnd: number = columnStart + vForToken.name.length;

          context.report({
            node: {} as unknown as Rule.Node,
            loc: {
              line: loc.start.line,
              column: loc.start.column - 1,
              start: {
                line: loc.start.line,
                column: columnStart,
              },
              end: {
                line: loc.end.line,
                column: columnEnd,
              },
            },
            messageId,
          });
        },
      };
    });
  },
} as Rule.RuleModule;
