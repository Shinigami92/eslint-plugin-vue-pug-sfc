import type { Rule } from 'eslint';
import type { AttributeToken, Loc, TagToken, TextToken } from 'pug-lexer';
import type { TokenProcessorProperties } from '../utils';
import { processRule } from '../utils';
import { previousTagToken } from '../utils/pug-utils';
import { isVueBinding } from '../utils/vue';

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
    return processRule(context, () => {
      const option: 'always' | 'never' = context.options[0] !== 'always' ? 'never' : 'always';

      function handle(token: AttributeToken | TextToken, { index, tokens }: TokenProcessorProperties): void {
        if (
          typeof token.val === 'string' &&
          (token.type === 'text' || isVueBinding(token)) &&
          /this\??\.(?!class)/.test(token.val)
        ) {
          if (option === 'never') {
            const lastTagToken: TagToken | undefined = previousTagToken(tokens, index);
            if (lastTagToken) {
              const lastTagTokenIndex: number = tokens.indexOf(lastTagToken);
              const vForAttributeToken: AttributeToken | undefined = tokens
                .slice(lastTagTokenIndex, index)
                .find((t) => t.type === 'attribute' && t.name === 'v-for') as AttributeToken | undefined;
              if (typeof vForAttributeToken?.val === 'string') {
                const ofLoopVariableName: string =
                  vForAttributeToken.val.slice(1, -1).trim().split(' of')[0]?.trim() ?? '';

                if (token.val.includes(`this.${ofLoopVariableName}`)) {
                  return;
                }
              }
            }

            const withOptionalChaining: boolean = token.val.includes('this?.');

            const loc: Loc = token.loc;

            // @ts-expect-error: Access range from token
            const range: [number, number] = token.range;
            const textSlice: string = context.getSourceCode().text.slice(range[0], range[1]);
            const columnOffset: number = textSlice.indexOf(`this${withOptionalChaining ? '?' : ''}.`);

            const columnStart: number = loc.start.column - 1 + columnOffset;
            const columnEnd: number = columnStart + 'this'.length + (withOptionalChaining ? 1 : 0);

            context.report({
              node: { type: 'ThisExpression' },
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
              fix(fixer) {
                // TODO: Fix `div {{ this['xs'] }}` to `div {{ xs }}`
                const removeFrom: number = range[0] + columnOffset;
                const removeTo: number = removeFrom + 'this.'.length + (withOptionalChaining ? 1 : 0);
                return fixer.removeRange([removeFrom, removeTo]);
              },
              message: "Unexpected usage of 'this'."
            });
          } else {
            // TODO: Add support for option `always`
            // console.warn(
            //   '[vue-pug-sfc] this-in-template option always is not supported yet.' +
            //     ' Please comment in https://github.com/Shinigami92/eslint-plugin-vue-pug-sfc/issues/6 and ask for support.'
            // );
          }
        }
      }

      return {
        attribute: handle,
        text: handle
      };
    });
  }
} as Rule.RuleModule;
