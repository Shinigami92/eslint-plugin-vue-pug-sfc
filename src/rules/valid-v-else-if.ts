import type { Rule } from 'eslint';
import type { AttributeToken, Loc } from 'pug-lexer';
import { processRule } from '../utils';
import { hasAttributeTokens } from '../utils/pug-utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid `v-else-if` directives',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/valid-v-else-if.html',
    },
    fixable: undefined,
    schema: [],
    messages: {
      missingVIf:
        "'v-else-if' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive.",
      withVIf:
        "'v-else-if' and 'v-if' directives can't exist on the same element.",
      withVElse:
        "'v-else-if' and 'v-else' directives can't exist on the same element.",
      unexpectedArgument: "'v-else-if' directives require no argument.",
      unexpectedModifier: "'v-else-if' directives require no modifier.",
      expectedValue: "'v-else-if' directives require that attribute value.",
    },
  },
  create(context) {
    return processRule(context, () => {
      let hasVIf: boolean = false;
      let vElseIfToken: AttributeToken | undefined;
      let hasVElse: boolean = false;

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
          vElseIfToken = undefined;
          hasVElse = false;
        },
        attribute(token) {
          if (token.name.includes('v-else-if')) {
            vElseIfToken = token;
          } else if (token.name === 'v-if') {
            hasVIf = true;
            ifs[indentLevel] = true;
          } else if (token.name === 'v-else') {
            hasVElse = true;
          }
        },
        'end-attributes'() {
          if (vElseIfToken) {
            let messageId: string = '';

            if (hasVIf) {
              messageId = 'withVIf';
            } else if (hasVElse) {
              messageId = 'withVElse';
            } else if (!ifs[indentLevel]) {
              messageId = 'missingVIf';
            } else if (vElseIfToken.name.includes(':')) {
              messageId = 'unexpectedArgument';
            } else if (vElseIfToken.name !== 'v-else-if') {
              messageId = 'unexpectedModifier';
            } else if (
              (typeof vElseIfToken.val === 'string' &&
                vElseIfToken.val.slice(1, -1).trim() === '') ||
              (typeof vElseIfToken.val === 'boolean' &&
                vElseIfToken.val === true)
            ) {
              messageId = 'expectedValue';
            }

            if (!messageId) {
              return;
            }

            const loc: Loc = vElseIfToken.loc;

            const columnStart: number = loc.start.column - 1;
            const columnEnd: number = columnStart + vElseIfToken.name.length;

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
