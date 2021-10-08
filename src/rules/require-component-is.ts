import type { Rule } from 'eslint';
import type { Loc, Token } from 'pug-lexer';
import { processRule } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'require `v-bind:is` of `<component>` elements',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/require-component-is.html'
    },
    fixable: undefined,
    schema: []
  },
  create(context) {
    return processRule(context, () => {
      return {
        tag(token, { index, tokens }) {
          if (token.val !== 'component') {
            return;
          }

          let foundIsBinding: boolean = false;
          let subIndex: number = index + 1;
          for (subIndex; subIndex < tokens.length; subIndex++) {
            const element: Token = tokens[subIndex]!;

            // Search for an attribute with `is` binding
            if (element.type === 'attribute' && /^(v-bind)?:is$/.test(element.name)) {
              foundIsBinding = true;
              break;
            }

            // If we encounter a new `tag` or `end-attributes` token, we can stop searching
            if (element?.type === 'end-attributes' || element.type === 'tag') {
              break;
            }
          }

          if (!foundIsBinding) {
            const loc: Loc = token.loc;

            const columnStart: number = loc.start.column - 1;
            const columnEnd: number = columnStart + 'component'.length;

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
              message: "Expected 'component' elements to have 'v-bind:is' attribute."
            });
          }

          // After looping we can skip forward to the new index.
          index = subIndex - 1;
        }
      };
    });
  }
} as Rule.RuleModule;
