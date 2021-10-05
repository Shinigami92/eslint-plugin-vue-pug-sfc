import type { Rule } from 'eslint';
import type { Loc, Token } from 'pug-lexer';
import { checkIsVueFile, parsePugContent } from '../utils';

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of `exact` modifier on `v-on`',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/use-v-on-exact.html'
    },
    fixable: undefined,
    schema: []
  },
  create(context) {
    if (!checkIsVueFile(context)) {
      return {};
    }

    const { tokens } = parsePugContent(context);

    if (tokens.length === 0) {
      return {};
    }

    let currentClickAttributeTokenIndexes: number[] = [];

    for (let index: number = 0; index < tokens.length; index++) {
      const token: Token = tokens[index]!;

      if (token.type === 'start-attributes') {
        currentClickAttributeTokenIndexes = [];
        continue;
      }

      if (token.type === 'attribute') {
        if (token.name.startsWith('v-on:click') || token.name.startsWith('@click')) {
          currentClickAttributeTokenIndexes.push(index);
        }

        if (currentClickAttributeTokenIndexes.length < 2) {
          continue;
        }

        const loc: Loc = token.loc;

        const columnStart: number = loc.start.column - 1;
        const columnEnd: number = loc.end.column - 1;

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
          message: "Consider to use '.exact' modifier."
        });
      }
    }

    return {};
  }
} as Rule.RuleModule;
