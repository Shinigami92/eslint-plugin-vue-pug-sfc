import type { Rule } from 'eslint';
import { extractPugTemplate } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid template root',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/valid-template-root.html',
    },
    fixable: undefined,
    schema: [],
  },
  create(context) {
    const { pugTemplateElement, pugText } = extractPugTemplate(context) ?? {};

    if (!pugTemplateElement) {
      return {};
    }

    const hasSrc: boolean = pugTemplateElement.startTag.attributes.some(
      (node) => node.key.name === 'src'
    );
    const hasContent: boolean = (pugText ?? '').length > 0;

    if (!hasSrc && !hasContent) {
      context.report({
        node: {} as unknown as Rule.Node,
        loc: {
          line: pugTemplateElement.startTag.loc.start.line,
          column: pugTemplateElement.startTag.loc.start.column,
          start: {
            line: pugTemplateElement.startTag.loc.start.line,
            column: pugTemplateElement.startTag.loc.start.column,
          },
          end: {
            line: pugTemplateElement.endTag?.loc.end.line ?? 1,
            column: pugTemplateElement.endTag?.loc.end.column ?? 0,
          },
        },
        message: 'The template requires child element.',
      });
    } else if (hasSrc && hasContent) {
      context.report({
        node: {} as unknown as Rule.Node,
        loc: {
          line: pugTemplateElement.startTag.loc.end.line,
          column: pugTemplateElement.startTag.loc.end.column,
          start: {
            line: pugTemplateElement.startTag.loc.end.line,
            column: pugTemplateElement.startTag.loc.end.column,
          },
          end: {
            line: pugTemplateElement.endTag?.loc.start.line ?? 1,
            column: pugTemplateElement.endTag?.loc.start.column ?? 0,
          },
        },
        message:
          "The template root with 'src' attribute is required to be empty.",
      });
    }

    return {};
  },
} as Rule.RuleModule;
