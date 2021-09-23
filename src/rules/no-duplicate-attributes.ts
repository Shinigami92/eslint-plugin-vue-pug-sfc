import type { Rule } from 'eslint';
import * as lex from 'pug-lexer';
import { checkIsVueFile, parsePugContent } from '../utils';

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
    if (!checkIsVueFile(context)) {
      return {};
    }

    const { tokens } = parsePugContent(context);

    if (tokens.length === 0) {
      return {};
    }

    let currentTagAttributes: lex.AttributeToken[] = [];
    for (let index: number = 0; index < tokens.length; index++) {
      const token: lex.Token = tokens[index]!;

      if (token.type === 'start-attributes') {
        currentTagAttributes = [];
        continue;
      }

      if (token.type === 'attribute') {
        const attributeName: string = token.name;

        const alreadyThere: boolean = currentTagAttributes.some((attr) => attr.name === attributeName);

        if (alreadyThere) {
          const loc: lex.Loc = token.loc;

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
            data: { name: attributeName }
          });
        }

        currentTagAttributes.push(token);
      }
    }

    return {};
  }
} as Rule.RuleModule;
