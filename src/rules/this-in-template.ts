import type { Rule } from 'eslint';
import * as path from 'path';
import * as lex from 'pug-lexer';
import { AST } from 'vue-eslint-parser';
import type { ParserServices } from '../utils';

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of `this` in template',
      categories: ['vue3-recommended', 'recommended'],
      url: 'https://eslint.vuejs.org/rules/this-in-template.html'
    },
    fixable: 'code',
    schema: [
      {
        enum: ['always', 'never']
      }
    ]
  },
  create(context) {
    const parserServices: ParserServices = context.parserServices;

    const df: AST.VDocumentFragment | null | undefined = parserServices.getDocumentFragment?.();
    if (!df) {
      return {};
    }

    const pugTemplateElement: AST.VElement | undefined = df.children.find(
      (node) =>
        node.type === 'VElement' &&
        node.name === 'template' &&
        node.startTag.attributes.some(
          (attr) => !attr.directive && attr.key.name === 'lang' && attr.value && attr.value.value === 'pug'
        )
    ) as AST.VElement | undefined;

    if (!pugTemplateElement) {
      return {};
    }

    const pugText: string = context
      .getSourceCode()
      .text.slice(pugTemplateElement.startTag.range[1], pugTemplateElement.endTag?.range[0]);
    console.log(pugText);

    const pugTokens: lex.Token[] = lex(pugText);
    console.log(pugTokens);

    if (parserServices.defineTemplateBodyVisitor == null) {
      const filename: string = context.getFilename();
      if (path.extname(filename) === '.vue') {
        context.report({
          loc: { line: 1, column: 0 },
          message:
            'Use the latest vue-eslint-parser. See also https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error.'
        });
      }
      return {};
    }

    const option: 'always' | 'never' = context.options[0] !== 'always' ? 'never' : 'always';

    console.log(pugTokens);
    for (const token of pugTokens) {
      if ('val' in token && typeof token.val === 'string' && token.val.includes('this')) {
        // console.log(token);
        if (option === 'never') {
          const loc: AST.LocationRange = token.loc;
          context.report({
            loc: {
              line: loc.start.line,
              column: loc.start.column,
              start: loc.start,
              end: loc.end
            },
            message: "Unexpected usage of 'this'."
          });
        }
      }
    }

    return {};
  }
} as Rule.RuleModule;
