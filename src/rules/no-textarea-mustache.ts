import type { Rule } from 'eslint';
import type { Loc } from 'pug-lexer';
import { processRule } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow mustaches in `<textarea>`',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/no-textarea-mustache.html',
    },
    fixable: undefined,
    schema: [],
  },
  create(context) {
    return processRule(context, () => {
      let lastTagWasTextarea: boolean = false;

      return {
        tag(token) {
          lastTagWasTextarea = token.val === 'textarea';
        },
        text(token) {
          if (!lastTagWasTextarea || !/^{{.*}}$/.test(token.val.trim())) {
            return;
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
                column: columnStart,
              },
              end: {
                line: loc.end.line,
                column: columnEnd,
              },
            },
            message: "Unexpected mustache. Use 'v-model' instead.",
          });
        },
      };
    });
  },
} as Rule.RuleModule;
