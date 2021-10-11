import type { AST, Rule } from 'eslint';
import type { Loc } from 'pug-lexer';
import { processRule } from '../utils';

const DECLARATION_DIRECTIVES: string[] = ['v-for', 'scope', 'slot-scope', 'v-slot'];

export default {
  meta: {
    hasSuggestions: true,
    type: 'suggestion',
    docs: {
      description: 'disallow unused variable definitions of v-for directives or scope attributes',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/no-unused-vars.html'
    },
    fixable: undefined,
    schema: [
      {
        type: 'object',
        properties: {
          ignorePattern: {
            type: 'string'
          }
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    return processRule(context, () => {
      const { ignorePattern } = context.options[0] ?? {};

      let ignoreRegEx: RegExp | null = null;
      if (ignorePattern) {
        ignoreRegEx = new RegExp(ignorePattern, 'u');
      }

      // TODO: Safe variables in a map and check if they were used
      // If not, trigger the reporter
      // Maybe we need to do this on `eos` tag or when the related outdent level was reached?

      return {
        indent() {
          // TODO: increase indentation level
        },
        outdent() {
          // TODO: decrease indentation level
        },
        attribute(token) {
          if (DECLARATION_DIRECTIVES.includes(token.name) && typeof token.val === 'string') {
            const match: RegExpExecArray | null = /(?<variableGroup>.+) (in|of) .+/.exec(token.val.slice(1, -1));
            const variableGroup: string | undefined = match?.groups?.variableGroup;
            console.log('variableGroup', variableGroup);
          }

          const variableName: string = '';

          const loc: Loc = token.loc;

          const columnStart: number = loc.start.column - 1;
          const columnEnd: number = loc.end.column - 1;

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
            message: "'{{name}}' is defined but never used.",
            data: {
              name: variableName
            },
            suggest:
              ignorePattern === '^_'
                ? [
                    {
                      desc: `Replace the ${variableName} with _${variableName}`,
                      fix(fixer) {
                        // @ts-expect-error: Access token range
                        const range: AST.Range = token.range;
                        return fixer.insertTextBeforeRange(range, '_');
                      }
                    }
                  ]
                : []
          });
        }
      };
    });
  }
} as Rule.RuleModule;
