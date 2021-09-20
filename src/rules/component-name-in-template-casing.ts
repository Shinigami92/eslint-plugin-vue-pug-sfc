import type { Rule } from 'eslint';
import { checkIsVueFile, parsePugContent } from '../utils';

const allowedCaseOptions: ['PascalCase', 'kebab-case'] = ['PascalCase', 'kebab-case'];
const defaultCase: 'PascalCase' = 'PascalCase' as const;

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
        enum: allowedCaseOptions
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

    const caseOption = context.options[0];
    const options = context.options[1] || {};
    const caseType = allowedCaseOptions.indexOf(caseOption) !== -1 ? caseOption : defaultCase;

    return {};
  }
} as Rule.RuleModule;
