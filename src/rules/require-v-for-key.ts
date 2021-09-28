import type { Rule } from 'eslint';
import * as lex from 'pug-lexer';
import { checkIsVueFile, parsePugContent } from '../utils';
import { isCustomComponent } from '../utils/vue';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'require `v-bind:key` with `v-for` directives',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/require-v-for-key.html'
    },
    fixable: undefined,
    schema: []
  },
  create(context) {
    if (!checkIsVueFile(context)) {
      return {};
    }

    const { tokens } = parsePugContent(context);

    if (tokens.length === 0) {
      return {};
    }

    let lastTagTokenIndex: number | undefined;
    let lastStartAttributesTokenIndex: number | undefined;

    for (let index: number = 0; index < tokens.length; index++) {
      const token: lex.Token = tokens[index]!;

      if (token.type === 'tag') {
        lastTagTokenIndex = index;
        continue;
      }

      if (token.type === 'start-attributes') {
        lastStartAttributesTokenIndex = index;
        continue;
      }

      if (token.type === 'attribute' && token.name === 'v-for') {
        let endAttributesTokenIndex: number = index;
        for (let index2: number = index; index2 < tokens.length; index2++) {
          endAttributesTokenIndex = index2;
          const element: lex.Token = tokens[index2]!;
          if (element.type === 'end-attributes') {
            break;
          }
        }

        // Find key attribute in attributes
        const attributeTokens: lex.AttributeToken[] = tokens.slice(
          lastStartAttributesTokenIndex! + 1,
          endAttributesTokenIndex
        ) as lex.AttributeToken[];
        if (attributeTokens.some((attr) => /^(v-bind)?:key$/.test(attr.name))) {
          continue;
        }

        const lastTagToken: lex.TagToken = tokens[lastTagTokenIndex!] as lex.TagToken;

        // `template` and `slot` doesn't need a key directly but a child of them
        if (lastTagToken.val === 'template' || lastTagToken.val === 'slot') {
          // TODO: Check if any child has :key attribute
          continue;
        }

        // A custom component could handle it by itself
        if (isCustomComponent(lastTagToken, tokens)) {
          continue;
        }

        const loc: lex.Loc = token.loc;

        const columnStart: number = loc.start.column - 1;
        const columnEnd: number = columnStart + 'v-for'.length;

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
          message: "Elements in iteration expect to have 'v-bind:key' directives."
        });
      }
    }

    return {};
  }
} as Rule.RuleModule;
