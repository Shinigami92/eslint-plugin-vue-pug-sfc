import type { Rule } from 'eslint';
import { defineTemplateBodyVisitor, ParserServices } from '../utils';

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
    const option: 'always' | 'never' = context.options[0] !== 'always' ? 'never' : 'always';
    const parserServices: ParserServices = context.parserServices;
    const tokens: any[] = parserServices.getTemplateBodyTokenStore?.()._tokens ?? [];

    // console.log(parserServices);
    // console.log(tokens);
    for (const token of tokens) {
      if ((token.value as string)?.includes('this')) {
        // console.log(token);
        if (option === 'never') {
          const loc = token.loc;
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

    return defineTemplateBodyVisitor(context, {});
  }
} as Rule.RuleModule;
