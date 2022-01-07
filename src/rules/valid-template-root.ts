import type { Rule } from 'eslint';
import { processRule } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid template root',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/valid-template-root.html'
    },
    fixable: undefined,
    schema: []
  },
  create(context) {
    const text: string = context.getSourceCode().text;
    const hasSrc: boolean = /<template .*src=["'].*.pug["'].*>/.test(text);

    if (!hasSrc && /<template .*><\/template>/.test(text)) {
      context.report({
        node: {} as unknown as Rule.Node,
        loc: {
          line: 1,
          column: 0,
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 32
          }
        },
        message: 'The template requires child element.'
      });
    }

    return processRule(context, () => {
      return {
        eos(token, { index }) {
          if (hasSrc && index !== 0) {
            console.log(token.loc);

            context.report({
              node: {} as unknown as Rule.Node,
              loc: {
                line: 1,
                column: 0,
                start: {
                  line: 1,
                  column: 36 - 1
                },
                end: {
                  line: token.loc.end.line,
                  column: token.loc.end.column - 1
                }
              },
              message: "The template root with 'src' attribute is required to be empty."
            });
          } else if (!hasSrc && index === 0) {
            context.report({
              node: {} as unknown as Rule.Node,
              loc: {
                line: 1,
                column: 0,
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 0
                }
              },
              message: 'The template requires child element.'
            });
          }
        }
      };
    });
  }
} as Rule.RuleModule;
