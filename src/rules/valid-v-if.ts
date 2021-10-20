import type { Rule } from 'eslint';
import type { AttributeToken, Loc } from 'pug-lexer';
import { processRule } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid `v-if` directives',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/valid-v-if.html'
    },
    fixable: undefined,
    schema: [],
    messages: {
      withVElse: "'v-if' and 'v-else' directives can't exist on the same element. You may want 'v-else-if' directives.",
      withVElseIf: "'v-if' and 'v-else-if' directives can't exist on the same element.",
      unexpectedArgument: "'v-if' directives require no argument.",
      unexpectedModifier: "'v-if' directives require no modifier.",
      expectedValue: "'v-if' directives require that attribute value."
    }
  },
  create(context) {
    return processRule(context, () => {
      let vIfToken: AttributeToken | undefined;
      let hasVElseIf: boolean = false;
      let hasVElse: boolean = false;

      return {
        'start-attributes'() {
          vIfToken = undefined;
          hasVElseIf = false;
          hasVElse = false;
        },
        attribute(token) {
          if (token.name.includes('v-if')) {
            vIfToken = token;
          } else if (token.name === 'v-else-if') {
            hasVElseIf = true;
          } else if (token.name === 'v-else') {
            hasVElse = true;
          }
        },
        'end-attributes'() {
          if (vIfToken) {
            let messageId: string = '';

            if (hasVElse) {
              messageId = 'withVElse';
            } else if (hasVElseIf) {
              messageId = 'withVElseIf';
            } else if (vIfToken.name.includes(':')) {
              messageId = 'unexpectedArgument';
            } else if (vIfToken.name !== 'v-if') {
              messageId = 'unexpectedModifier';
            } else if (typeof vIfToken.val === 'string' && vIfToken.val.slice(1, -1).trim() === '') {
              messageId = 'expectedValue';
            } else if (typeof vIfToken.val === 'boolean' && vIfToken.val === true) {
              messageId = 'expectedValue';
            }

            if (!messageId) {
              return;
            }

            const loc: Loc = vIfToken.loc;

            const columnStart: number = loc.start.column - 1;
            const columnEnd: number = columnStart + vIfToken.name.length;

            context.report({
              node: {} as unknown as Rule.Node,
              loc: {
                line: loc.start.line,
                column: loc.start.column - 1,
                start: {
                  line: loc.start.line,
                  column: columnStart
                },
                end: {
                  line: loc.end.line,
                  column: columnEnd
                }
              },
              messageId
            });
          }
        }
      };
    });
  }
} as Rule.RuleModule;
