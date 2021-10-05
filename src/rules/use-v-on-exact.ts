import type { Rule } from 'eslint';
import type { AttributeToken, Loc, Token } from 'pug-lexer';
import { checkIsVueFile, parsePugContent } from '../utils';

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of `exact` modifier on `v-on`',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/use-v-on-exact.html'
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

    let eventAttributes: AttributeToken[] = [];

    for (let index: number = 0; index < tokens.length; index++) {
      const token: Token = tokens[index]!;

      // Reset attributes cache
      if (token.type === 'start-attributes') {
        eventAttributes = [];
        continue;
      }

      // Add only event attributes
      if (token.type === 'attribute' && (token.name.startsWith('v-on:') || token.name.startsWith('@'))) {
        eventAttributes.push(token);
        continue;
      }

      // Check if there are similar event attributes
      if (token.type === 'end-attributes' && eventAttributes.length > 1) {
        const eventAttributeMatches: RegExpExecArray[] = eventAttributes.map(
          (attr) => /^(v-on:|@)(?<name>[\w[\]]+)\.?(?<modifiers>(.+))?/.exec(attr.name)!
        );
        // Start at index 1 / skip first element
        for (let outerIndex: number = 1; outerIndex < eventAttributes.length; outerIndex++) {
          const eventAttributeToken: AttributeToken = eventAttributes[outerIndex]!;
          const { name: eventName, modifiers: eventModifiersGroup } = eventAttributeMatches[outerIndex]!.groups!;

          for (let matchIndex: number = 0; matchIndex < eventAttributeMatches.length; matchIndex++) {
            if (matchIndex === outerIndex) {
              // Don't compare attribute with itself
              continue;
            }

            const { name: otherName, modifiers: otherModifiersGroup } = eventAttributeMatches[matchIndex]!.groups!;

            if (eventName === otherName) {
              const eventModifiers: string[] = eventModifiersGroup?.split('.') ?? [];

              if (!eventModifiers.includes('exact')) {
                const otherModifiers: string[] = otherModifiersGroup?.split('.') ?? [];
                if (
                  otherModifiers.length === 0 ||
                  !eventModifiers.every((modifier) => otherModifiers.includes(modifier))
                ) {
                  continue;
                }

                const loc: Loc = eventAttributeToken.loc;

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
                  message: "Consider to use '.exact' modifier."
                });
              }
            }
          }
        }
      }
    }

    return {};
  }
} as Rule.RuleModule;
