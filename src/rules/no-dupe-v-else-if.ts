import type { Rule } from 'eslint';
import type { AttributeToken, Loc } from 'pug-lexer';
import { processRule } from '../utils';

function isSubset(
  operandsA: string | boolean,
  operandsB: string | boolean
): boolean {
  // TODO: Check conditions more deeply
  return operandsA === operandsB;
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow duplicate conditions in `v-if` / `v-else-if` chains',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/no-dupe-v-else-if.html',
    },
    fixable: undefined,
    schema: [],
    messages: {
      unexpected:
        'This branch can never execute. Its condition is a duplicate or covered by previous conditions in the `v-if` / `v-else-if` chain.',
    },
  },
  create(context) {
    return processRule(context, () => {
      let indentLevel: number = 0;
      const ifs: AttributeToken[][] = [];
      const currentTagHasIf: boolean[] = [];

      return {
        indent() {
          indentLevel++;
        },
        outdent() {
          delete ifs[indentLevel];
          indentLevel--;
        },
        tag() {
          if (!currentTagHasIf[indentLevel]) {
            delete ifs[indentLevel];
          }
          currentTagHasIf[indentLevel] = false;
        },
        attribute(token) {
          if (token.name === 'v-if') {
            ifs[indentLevel] = [token];
            currentTagHasIf[indentLevel] = true;
          } else if (
            token.name === 'v-else-if' &&
            ((typeof token.val === 'string' && token.val) ||
              typeof token.val !== 'string')
          ) {
            currentTagHasIf[indentLevel] = true;
            if (!Array.isArray(ifs[indentLevel])) {
              ifs[indentLevel] = [];
            }

            if (ifs[indentLevel]!.some((tok) => isSubset(tok.val, token.val))) {
              const loc: Loc = token.loc;

              const columnStart: number =
                loc.start.column - 1 + 'v-else-if="'.length;
              const columnEnd: number =
                columnStart - 1 + String(token.val).length - '"'.length;

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
                messageId: 'unexpected',
              });
            }

            ifs[indentLevel]!.push(token);
          }
        },
      };
    });
  },
} as Rule.RuleModule;
