import type { Rule } from 'eslint';
import type { Loc } from 'pug-lexer';
import { processRule } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow duplication of attributes',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/no-duplicate-attributes.html'
    },
    fixable: undefined,
    schema: [
      {
        type: 'object',
        properties: {
          allowCoexistClass: {
            type: 'boolean'
          },
          allowCoexistStyle: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    return processRule(context, () => {
      const { allowCoexistStyle = true, allowCoexistClass = true } = context.options[0] ?? {};

      let currentAttributeNames: string[] = [];

      function findDuplicate(name: string): string | undefined {
        if (allowCoexistClass && /^(v-bind)?:?class$/i.test(name)) {
          return;
        }
        if (allowCoexistStyle && /^(v-bind)?:?style$/i.test(name)) {
          return;
        }
        return currentAttributeNames.find((attrName) => attrName === name);
      }

      return {
        'start-attributes'() {
          currentAttributeNames = [];
        },
        attribute(token) {
          const attributeName: string = token.name;

          if (/^(@|v-on:)/.test(attributeName)) {
            return;
          }

          const cleanedAttributeName: string = attributeName.replace(/^(v-bind)?:/, '');

          const duplicateAttributeName: string | undefined = findDuplicate(cleanedAttributeName);
          if (duplicateAttributeName) {
            const loc: Loc = token.loc;

            const columnStart: number = loc.start.column - 1;
            const columnEnd: number = columnStart + attributeName.length;

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
              message: "Duplicate attribute '{{name}}'.",
              data: { name: duplicateAttributeName }
            });
          }

          currentAttributeNames.push(cleanedAttributeName);
        }
      };
    });
  }
} as Rule.RuleModule;
