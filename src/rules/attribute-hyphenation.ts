import type { AST, Rule } from 'eslint';
import type { Loc } from 'pug-lexer';
import { processRule } from '../utils';
import { getExactConverter } from '../utils/casing';
import { isHtmlWellKnownElementName } from '../utils/html-element';
import { isMathMlWellKnownElementName } from '../utils/math-ml-element';
import { previousTagToken } from '../utils/pug-utils';
import { SVG_ATTRIBUTES_WEIRD_CASE } from '../utils/svg-attributes-weird-case';
import { isSvgWellKnownElementName } from '../utils/svg-element';

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce attribute naming style on custom components in template',
      categories: ['vue3-strongly-recommended', 'strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/attribute-hyphenation.html'
    },
    fixable: 'code',
    schema: [
      {
        enum: ['always', 'never']
      },
      {
        type: 'object',
        properties: {
          ignore: {
            type: 'array',
            items: {
              allOf: [
                { type: 'string' },
                { not: { type: 'string', pattern: ':exit$' } },
                { not: { type: 'string', pattern: '^\\s*$' } }
              ]
            },
            uniqueItems: true,
            additionalItems: false
          }
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    return processRule(context, () => {
      const useHyphenated: boolean = context.options[0] !== 'never';
      const { ignore = [] } = context.options[1] ?? {};
      const ignoredAttributes: string[] = ['data-', 'aria-', 'slot-scope', ...SVG_ATTRIBUTES_WEIRD_CASE, ...ignore];

      const caseConverter: (str: string) => string = getExactConverter(useHyphenated ? 'kebab-case' : 'camelCase');

      function isIgnoredAttribute(value: string): boolean {
        const isIgnored: boolean = ignoredAttributes.some((attr) => value.includes(attr));

        if (isIgnored) {
          return true;
        }

        // Check if attribute is a variable binding
        if (/^(v-bind)?:\[.+\]$/.test(value)) {
          return true;
        }

        if (useHyphenated) {
          return value.toLowerCase() === value;
        }

        // Check if attribute contains a hyphen
        return !value.includes('-');
      }

      return {
        attribute(token, { index, tokens }) {
          const attributeName: string = token.name;

          // TODO: Theoretically this could be optimized with saving the previous `tag` token on `start-attributes` token.
          const tagName: string = previousTagToken(tokens, index)?.val ?? '';
          if (
            tagName &&
            (isHtmlWellKnownElementName(tagName) ||
              isSvgWellKnownElementName(tagName) ||
              isMathMlWellKnownElementName(tagName))
          ) {
            return;
          }

          if (!attributeName || isIgnoredAttribute(attributeName)) {
            return;
          }

          const loc: Loc = token.loc;

          // @ts-expect-error: Access range from token
          const range: AST.Range = token.range;
          const columnStart: number = loc.start.column - 1;
          const columnEnd: number = columnStart + attributeName.length;

          context.report({
            node: {
              type: /^(v-bind)?:/.test(attributeName) ? 'VDirectiveKey' : 'VIdentifier'
            } as unknown as Rule.Node,
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
            message: useHyphenated
              ? "Attribute '{{text}}' must be hyphenated."
              : "Attribute '{{text}}' can't be hyphenated.",
            data: {
              text: attributeName
            },
            fix(fixer) {
              let converted: string;
              const parts: string[] = attributeName.split(':');
              if (parts.length > 1 && (parts[0] === '' || parts[0] === 'v-bind')) {
                const name: string = parts.slice(1).join('');
                converted = `${parts[0]}:${caseConverter(name)}`;
              } else {
                converted = caseConverter(attributeName);
              }
              return fixer.replaceTextRange([range[0], range[0] + attributeName.length], converted);
            }
          });
        }
      };
    });
  }
} as Rule.RuleModule;
