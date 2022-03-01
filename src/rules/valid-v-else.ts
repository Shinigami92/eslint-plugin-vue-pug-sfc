import type { Rule } from 'eslint';
import type { AttributeToken, Loc } from 'pug-lexer';
import { processRule } from '../utils';
import { hasAttributeTokens } from '../utils/pug-utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid `v-else` directives',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/valid-v-else.html',
    },
    fixable: undefined,
    schema: [],
    messages: {
      missingVIf:
        "'v-else' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive.",
      withVIf:
        "'v-else' and 'v-if' directives can't exist on the same element. You may want 'v-else-if' directives.",
      withVElseIf:
        "'v-else' and 'v-else-if' directives can't exist on the same element.",
      unexpectedArgument: "'v-else' directives require no argument.",
      unexpectedModifier: "'v-else' directives require no modifier.",
      unexpectedValue: "'v-else' directives require no attribute value.",
    },
  },
  create(context) {
    return processRule(context, () => {
      let hasVIf: boolean = false;
      let hasVElseIf: boolean = false;
      let vElseToken: AttributeToken | undefined;

      let indentLevel: number = 0;
      const ifs: boolean[] = [];

      return {
        indent() {
          indentLevel++;
        },
        outdent() {
          delete ifs[indentLevel];
          indentLevel--;
        },
        tag(token, { tokens }) {
          if (
            ifs[indentLevel] &&
            !hasAttributeTokens(
              token,
              tokens,
              (attr) =>
                attr.name.includes('v-if') || attr.name.includes('v-else'),
            )
          ) {
            delete ifs[indentLevel];
          }
        },
        'start-attributes'() {
          hasVIf = false;
          hasVElseIf = false;
          vElseToken = undefined;
        },
        attribute(token) {
          if (
            token.name.includes('v-else') &&
            !token.name.includes('v-else-if')
          ) {
            vElseToken = token;
          } else if (token.name === 'v-if') {
            hasVIf = true;
            ifs[indentLevel] = true;
          } else if (token.name === 'v-else-if') {
            hasVElseIf = true;
          }
        },
        'end-attributes'() {
          if (vElseToken) {
            let messageId: string = '';

            if (hasVIf) {
              messageId = 'withVIf';
            } else if (hasVElseIf) {
              messageId = 'withVElseIf';
            } else if (!ifs[indentLevel]) {
              messageId = 'missingVIf';
            } else if (vElseToken.name.includes(':')) {
              messageId = 'unexpectedArgument';
            } else if (vElseToken.name !== 'v-else') {
              messageId = 'unexpectedModifier';
            } else if (
              typeof vElseToken.val === 'string' ||
              (typeof vElseToken.val === 'boolean' && vElseToken.val === false)
            ) {
              messageId = 'unexpectedValue';
            }

            if (!messageId) {
              return;
            }

            const loc: Loc = vElseToken.loc;

            const columnStart: number = loc.start.column - 1;
            const columnEnd: number = columnStart + vElseToken.name.length;

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
          }
        },
      };
    });
  },
} as Rule.RuleModule;
