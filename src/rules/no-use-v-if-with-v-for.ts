import type { Rule } from 'eslint';
import type { AttributeToken, Loc, Token } from 'pug-lexer';
import { processRule } from '../utils';

/**
 * Check if the given string `expression` uses a given `variable`.
 *
 * This function calls itself recursively for each `variable` if the `variable` argument is a tuple or destructuring.
 *
 * @param variable The variable to check for. Can also contain tuples or destructuring.
 * @param expression The expression to check if the variables is used.
 * @returns `true` if the variable is used in the given expression, `false` otherwise.
 */
function usesVariable(variable: string, expression: string): boolean {
  if (new RegExp(`\\s?${variable}(?!\\w)`).test(expression)) {
    return true;
  }

  if (
    (variable.startsWith('{') && variable.endsWith('}')) ||
    (variable.startsWith('(') && variable.endsWith(')'))
  ) {
    const variables: string[] = variable
      .slice(1, -1)
      .split(',')
      .map((v) => v.trim());
    return variables.some((variable) => usesVariable(variable, expression));
  }

  return false;
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow use v-if on the same element as v-for',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/no-use-v-if-with-v-for.html',
    },
    fixable: undefined,
    schema: [
      {
        type: 'object',
        properties: {
          allowUsingIterationVar: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    return processRule(context, () => {
      const { allowUsingIterationVar = false } = context.options[0] ?? {};

      let lastStartAttributesTokenIndex: number | undefined;

      return {
        'start-attributes'(_, { index }) {
          lastStartAttributesTokenIndex = index;
        },
        attribute(token, { index, tokens }) {
          if (token.name !== 'v-if') {
            return;
          }

          let endAttributesTokenIndex: number = index;
          for (let index2: number = index; index2 < tokens.length; index2++) {
            endAttributesTokenIndex = index2;
            const element: Token = tokens[index2]!;
            if (element.type === 'end-attributes') {
              break;
            }
          }

          // Find `v-for` attribute in attributes
          const attributeTokens: AttributeToken[] = tokens.slice(
            lastStartAttributesTokenIndex! + 1,
            endAttributesTokenIndex
          ) as AttributeToken[];
          const vForAttribute: AttributeToken | undefined =
            attributeTokens.find((attr) => attr.name === 'v-for');
          if (
            !vForAttribute ||
            // Ignore the rule if `val` is not a string
            typeof vForAttribute.val !== 'string'
          ) {
            return;
          }

          const vForVar: string = vForAttribute.val.slice(1, -1); // Remove surrounding quotes
          let [iterationVariable, iteratorName] = vForVar.split(' in ');

          iterationVariable = (iterationVariable ?? '').trim();
          iteratorName = (iteratorName ?? '').trim();

          const kind: 'variable' | 'expression' = /^(?!\d)\w+$/.test(
            iteratorName
          )
            ? 'variable'
            : 'expression';

          let shouldMove: boolean = false;

          const vIfValue: string =
            typeof token.val === 'string'
              ? token.val.slice(1, -1).trim()
              : String(token.val);
          if (allowUsingIterationVar) {
            // Check if `variable` in `v-for` is used in `v-if`
            if (usesVariable(iterationVariable, vIfValue)) {
              return;
            }
          } else {
            // Check if `variable` in `v-for` is not used in `v-if`
            if (!usesVariable(iterationVariable, vIfValue)) {
              shouldMove = true;
            }
          }

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
                column: columnStart,
              },
              end: {
                line: loc.end.line,
                column: columnEnd,
              },
            },
            message: shouldMove
              ? "This 'v-if' should be moved to the wrapper element."
              : "The '{{iteratorName}}' {{kind}} inside 'v-for' directive should be replaced with a computed property that returns filtered array instead. You should not mix 'v-for' with 'v-if'.",
            data: shouldMove ? undefined : { iteratorName, kind },
          });
        },
      };
    });
  },
} as Rule.RuleModule;
