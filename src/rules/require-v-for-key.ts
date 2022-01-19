import type { Rule } from 'eslint';
import type { AttributeToken, Loc, TagToken, Token } from 'pug-lexer';
import { processRule } from '../utils';
import { getAttributeTokens, getChildTags } from '../utils/pug-utils';
import { isCustomComponent } from '../utils/vue';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'require `v-bind:key` with `v-for` directives',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/require-v-for-key.html',
    },
    fixable: undefined,
    schema: [],
  },
  create(context) {
    return processRule(context, () => {
      let lastTagTokenIndex: number | undefined;
      let lastStartAttributesTokenIndex: number | undefined;

      return {
        tag(_, { index }) {
          lastTagTokenIndex = index;
        },
        'start-attributes'(_, { index }) {
          lastStartAttributesTokenIndex = index;
        },
        attribute(token, { index, tokens }) {
          if (token.name !== 'v-for') {
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

          // Find key attribute in attributes
          const attributeTokens: AttributeToken[] = tokens.slice(
            lastStartAttributesTokenIndex! + 1,
            endAttributesTokenIndex
          ) as AttributeToken[];
          if (
            attributeTokens.some((attr) => /^(v-bind)?:key$/.test(attr.name))
          ) {
            return;
          }

          const lastTagToken: TagToken | undefined = tokens[
            lastTagTokenIndex!
          ] as TagToken | undefined;

          // `template` and `slot` doesn't need a key directly but a child of them
          if (
            lastTagToken &&
            (lastTagToken.val === 'template' || lastTagToken.val === 'slot')
          ) {
            const childTagTokens: TagToken[] = getChildTags(
              lastTagToken,
              tokens
            );
            if (
              childTagTokens.every(
                (tag) => tag.val === 'template' || tag.val === 'slot'
              )
            ) {
              return;
            }

            let foundChildTagWithKey: boolean = false;
            for (const childTag of childTagTokens) {
              const attributeTokens: AttributeToken[] = getAttributeTokens(
                childTag,
                tokens
              );
              if (
                attributeTokens.some((attr) =>
                  /^(v-bind)?:key$/.test(attr.name)
                )
              ) {
                foundChildTagWithKey = true;
                break;
              }
            }
            if (foundChildTagWithKey) {
              return;
            }
          }

          // A custom component could handle it by itself
          if (lastTagToken && isCustomComponent(lastTagToken, tokens)) {
            return;
          }

          const loc: Loc = token.loc;

          const columnStart: number = loc.start.column - 1;
          const columnEnd: number = columnStart + 'v-for'.length;

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
            message:
              "Elements in iteration expect to have 'v-bind:key' directives.",
          });
        },
      };
    });
  },
} as Rule.RuleModule;
