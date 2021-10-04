import type { Rule } from 'eslint';
import type { AttributeToken, Loc, Token } from 'pug-lexer';
import { checkIsVueFile, parsePugContent } from '../utils';

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow use v-if on the same element as v-for',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/no-use-v-if-with-v-for.html'
    },
    fixable: undefined,
    schema: [
      {
        type: 'object',
        properties: {
          allowUsingIterationVar: {
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

    const { allowUsingIterationVar = false } = context.options[0] ?? {};

    let lastTagTokenIndex: number | undefined;
    let lastStartAttributesTokenIndex: number | undefined;

    for (let index: number = 0; index < tokens.length; index++) {
      const token: Token = tokens[index]!;

      if (token.type === 'tag') {
        lastTagTokenIndex = index;
        continue;
      }

      if (token.type === 'start-attributes') {
        lastStartAttributesTokenIndex = index;
        continue;
      }

      if (token.type === 'attribute' && token.name === 'v-if') {
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
        const vForAttribute: AttributeToken | undefined = attributeTokens.find((attr) => attr.name === 'v-for');
        if (!vForAttribute) {
          continue;
        }

        const loc: Loc = token.loc;

        const columnStart: number = loc.start.column - 1;
        const columnEnd: number = columnStart + token.name.length;

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
          message:
            "The '{{iteratorName}}' {{kind}} inside 'v-for' directive should be replaced with a computed property that returns filtered array instead. You should not mix 'v-for' with 'v-if'.",
          data: {
            iteratorName: '', // iteratorNode.type === 'Identifier' ? iteratorNode.name : context.getSourceCode().getText(iteratorNode),
            kind: '' // iteratorNode.type === 'Identifier' ? 'variable' : 'expression'
          }
        });
      }
    }

    return {};
  }
} as Rule.RuleModule;

// context.report({
//   node,
//   loc: node.loc,
//   message: "This 'v-if' should be moved to the wrapper element."
// })
