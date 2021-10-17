import type { Rule } from 'eslint';
import type { Loc } from 'pug-lexer';
import { processRule } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using deprecated filters syntax (in Vue.js 3.0.0+)',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-filter.html'
    },
    fixable: undefined,
    schema: [],
    messages: {
      noDeprecatedFilter: 'Filters are deprecated.'
    }
  },
  create(context) {
    const isFilterAllowed: boolean = !(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (context.parserOptions.vueFeatures?.filter ?? true)
    );
    if (isFilterAllowed) {
      return {};
    }

    return processRule(context, () => {
      return {
        attribute(token) {
          if (typeof token.val === 'string' && token.val.includes('|')) {
            const loc: Loc = token.loc;

            const columnStart: number = loc.start.column - 1;
            const columnEnd: number = columnStart;

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
              messageId: 'noDeprecatedFilter'
            });
          }
        },
        text(token) {
          if (token.val.includes('|')) {
            const loc: Loc = token.loc;

            const columnStart: number = loc.start.column - 1;
            const columnEnd: number = columnStart;

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
              messageId: 'noDeprecatedFilter'
            });
          }
        }
      };
    });
  }
} as Rule.RuleModule;
