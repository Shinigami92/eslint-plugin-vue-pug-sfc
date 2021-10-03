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

    let lastTagTokenIndex: number | undefined;
    let lastStartAttributesTokenIndex: number | undefined;
    const memory: Array<{
      tagTokenIndex: number;
      startAttributesTokenIndex: number;
      token: lex.AttributeToken;
      index: number;
    }> = [];

    for (let index: number = 0; index < tokens.length; index++) {
      const token: lex.Token = tokens[index]!;

      if (token.type === 'tag') {
        lastTagTokenIndex = index;
        continue;
      }

      if (token.type === 'start-attributes') {
        lastStartAttributesTokenIndex = index;
        continue;
      }

      if (token.type === 'attribute') {
        if (token.name === 'v-else-if' || token.name === 'v-if') {
          // We can safely use non-null assertions, cause the lexer would not detect attributes before the occurrence of `tag` and `start-attributes` tokens.
          memory.push({
            tagTokenIndex: lastTagTokenIndex!,
            startAttributesTokenIndex: lastStartAttributesTokenIndex!,
            token,
            index
            // Do we need to store a indent-level?
            // Maybe we can use the `token.loc.start.column`
          });
        }
      }

      for (const { token, index } of memory) {
        if (
          token.name === 'v-else-if' &&
          // Potentially we could optimize this loop by breaking out with a classic for-loop.
          memory.some(
            (t) =>
              // We only need to check tokens before the current token
              t.index < index && t.token.val === token.val
          )
        ) {
          const loc: lex.Loc = token.loc;

          const columnStart: number = loc.start.column - 1;
          const columnEnd: number = columnStart + 'v-else-if'.length;

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
      }
    }

    return {};
  }
} as Rule.RuleModule;
