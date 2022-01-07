import type { AST, Rule } from 'eslint';
import type { Loc } from 'pug-lexer';
import { processRule } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using deprecated `$scopedSlots` (in Vue.js 3.0.0+)',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-dollar-scopedslots-api.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      deprecated: 'The `$scopedSlots` is deprecated.'
    }
  },
  create(context) {
    return processRule(context, () => {
      return {
        attribute(token) {
          if (typeof token.val === 'string' && token.val.includes('$scopedSlots')) {
            // Ignore for
            if (token.name === 'v-for' && !/in\s\$scopedSlots/.test(token.val)) {
              return;
            }

            const loc: Loc = token.loc;

            const columnStart: number =
              loc.start.column - 1 + token.name.length + '='.length + token.val.indexOf('$scopedSlots');
            const columnEnd: number = columnStart + '$scopedSlots'.length;

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
              messageId: 'deprecated',
              fix(fixer) {
                // @ts-expect-error: Access range from token
                const range: AST.Range = token.range;
                const textSlice: string = context.getSourceCode().text.slice(range[0], range[1]);
                const columnOffset: number = textSlice.indexOf('$scopedSlots');

                const removeFrom: number = range[0] + columnOffset;
                const removeTo: number = removeFrom + '$scopedSlots'.length;
                return fixer.replaceTextRange([removeFrom, removeTo], '$slots');
              }
            });
          }
        }
      };
    });
  }
} as Rule.RuleModule;
