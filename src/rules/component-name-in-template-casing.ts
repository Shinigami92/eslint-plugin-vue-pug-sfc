import type { Rule } from 'eslint';
import * as lex from 'pug-lexer';
import { checkIsVueFile, parsePugContent } from '../utils';
import { isKebabCase, isPascalCase } from '../utils/casing';

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

          context.report({
            node: {
              // TODO: Find a suitable node type.
              type: 'ThisExpression'
            },
            loc: {
              line: loc.start.line,
              column: loc.start.column,
              start: { line: loc.start.line, column: loc.start.column },
              end: { line: loc.end.line, column: loc.end.column }
            },
            message: 'Component name "{{name}}" is not {{caseType}}.',
            data: {
              name: tagName,
              caseType: caseOption
            },
            fix(fixer) {
              // TODO: Implement fixer.
              return fixer.removeRange([0, 0]);
            }
          });
        }
      }
    }

    return {};
  }
} as Rule.RuleModule;
