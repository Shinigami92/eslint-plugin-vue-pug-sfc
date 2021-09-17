import type { Rule } from 'eslint';
import * as lex from 'pug-lexer';
import { checkIsVueFile, parsePugContent } from '../utils';
import { previousTagToken } from '../utils/pug-utils';

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

    for (let index: number = 0; index < tokens.length; index++) {
      const token: lex.Token = tokens[index]!;

      if ('val' in token && typeof token.val === 'string' && /this\.(?!class)/.test(token.val)) {
        if (option === 'never') {
          const lastTagToken: lex.TagToken | undefined = previousTagToken(tokens, index);
          if (lastTagToken) {
            const lastTagTokenIndex: number = tokens.indexOf(lastTagToken);
            const vForAttributeToken: lex.AttributeToken | undefined = tokens
              .slice(lastTagTokenIndex, index)
              .find((t) => t.type === 'attribute' && t.name === 'v-for') as lex.AttributeToken | undefined;
            if (typeof vForAttributeToken?.val === 'string') {
              const ofLoopVariableName: string =
                vForAttributeToken.val.slice(1, -1).trim().split(' of')[0]?.trim() ?? '';

              if (token.val.includes(`this.${ofLoopVariableName}`)) {
                continue;
              }
            }
          }

          const loc: lex.Loc = token.loc;
          context.report({
            node: { type: 'ThisExpression' },
            loc: {
              line: loc.start.line,
              column: loc.start.column,
              start: loc.start,
              end: loc.end
            },
            fix(fixer) {
              // @ts-expect-error: Access range from token
              const range: [number, number] = token.range;
              const textSlice: string = context.getSourceCode().text.slice(range[0], range[1]);
              const rangeOffset: number = textSlice.indexOf('this.');
              // TODO: Fix `div {{ this['xs'] }}` to `div {{ xs }}`
              return fixer.removeRange([range[0] + rangeOffset, range[0] + rangeOffset + 'this.'.length]);
            },
            message: "Unexpected usage of 'this'."
          });
        }
      }
    }

    return {};
  }
} as Rule.RuleModule;
