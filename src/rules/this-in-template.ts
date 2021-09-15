import type { Rule } from 'eslint';
import * as lex from 'pug-lexer';
import { checkIsVueFile, parsePugContent } from '../utils';

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
    if (!checkIsVueFile(context)) {
      return {};
    }

    const { tokens } = parsePugContent(context);

    if (tokens.length === 0) {
      return {};
    }

    const option: 'always' | 'never' = context.options[0] !== 'always' ? 'never' : 'always';
    console.log('option:', option);

    for (const token of tokens) {
      if ('val' in token && typeof token.val === 'string' && /this\.(?!class)/.test(token.val)) {
        console.log(token);

        if (option === 'never') {
          /*
           * TODO: Allow stuff like:
           *
           * - div(v-for="x of xs") {{this.x}}
           * - div(v-for="x of xs") {{this.x()}}
           * - div(v-for="x of xs") {{this.x.y()}}
           * - div(v-for="x of xs") {{this.x['foo']}}
           */
          const loc: lex.Loc = token.loc;
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
