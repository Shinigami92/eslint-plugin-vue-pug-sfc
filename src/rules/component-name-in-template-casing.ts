import type { Rule } from 'eslint';
import * as lex from 'pug-lexer';
import { checkIsVueFile, parsePugContent } from '../utils';
import { getConverter, isKebabCase, isPascalCase } from '../utils/casing';

type AllowedCaseOptions = 'PascalCase' | 'kebab-case';
interface RuleOptions {
  registeredComponentsOnly: boolean;
  ignores: string[];
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce specific casing for the component naming style in template',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/component-name-in-template-casing.html'
    },
    fixable: 'code',
    schema: [
      {
        enum: ['PascalCase', 'kebab-case']
      },
      {
        type: 'object',
        properties: {
          ignores: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            additionalItems: false
          },
          registeredComponentsOnly: {
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

    const caseOption: AllowedCaseOptions = context.options[0] === 'kebab-case' ? 'kebab-case' : 'PascalCase';
    // TODO: Use `registeredComponentsOnly` and `ignores`.
    const { registeredComponentsOnly = true, ignores = [] }: RuleOptions = context.options[1] ?? {};

    for (let index: number = 0; index < tokens.length; index++) {
      const token: lex.Token = tokens[index]!;

      if (token.type === 'tag') {
        const tagName: string = token.val;

        if (
          (caseOption === 'PascalCase' && !isPascalCase(tagName)) ||
          (caseOption === 'kebab-case' && !isKebabCase(tagName))
        ) {
          const loc: lex.Loc = token.loc;

          // @ts-expect-error: Access range from token
          const range: [number, number] = token.range;
          const columnStart: number = loc.start.column - 1;
          const columnEnd: number = columnStart + tagName.length;

          context.report({
            node: {
              // TODO: Find a suitable node type.
              type: 'ThisExpression'
            },
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
            message: 'Component name "{{name}}" is not {{caseType}}.',
            data: {
              name: tagName,
              caseType: caseOption
            },
            fix(fixer) {
              return fixer.replaceTextRange(range, getConverter(caseOption)(tagName));
            }
          });
        }
      }
    }

    return {};
  }
} as Rule.RuleModule;
