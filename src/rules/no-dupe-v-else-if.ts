import type { Rule } from 'eslint';
import * as lex from 'pug-lexer';
import { checkIsVueFile, parsePugContent } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow duplicate conditions in `v-if` / `v-else-if` chains',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/no-dupe-v-else-if.html'
    },
    fixable: undefined,
    schema: [],
    messages: {
      unexpected:
        'This branch can never execute. Its condition is a duplicate or covered by previous conditions in the `v-if` / `v-else-if` chain.'
    }
  },
  create(context) {
    if (!checkIsVueFile(context)) {
      return {};
    }

    const { tokens } = parsePugContent(context);

    if (tokens.length === 0) {
      return {};
    }

    let indentLevel: number = 0;
    const ifs: lex.AttributeToken[][] = [];

    for (let index: number = 0; index < tokens.length; index++) {
      const token: lex.Token = tokens[index]!;

      if (token.type === 'indent') {
        indentLevel++;
        continue;
      }

      if (token.type === 'outdent') {
        delete ifs[indentLevel];
        indentLevel--;
        continue;
      }

      if (token.type === 'attribute') {
        if (token.name === 'v-if') {
          ifs[indentLevel] = [token];
        } else if (
          token.name === 'v-else-if' &&
          ((typeof token.val === 'string' && token.val) || typeof token.val !== 'string')
        ) {
          if (!Array.isArray(ifs[indentLevel])) {
            ifs[indentLevel] = [];
          }

          if (ifs[indentLevel]!.some((tok) => tok.val === token.val)) {
            const loc: lex.Loc = token.loc;

            const columnStart: number = loc.start.column - 1 + 'v-else-if="'.length;
            const columnEnd: number = columnStart - 1 + String(token.val).length - '"'.length;

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
              messageId: 'unexpected'
            });
          }

          ifs[indentLevel]!.push(token);
        }
      }
    }

    return {};
  }
} as Rule.RuleModule;
