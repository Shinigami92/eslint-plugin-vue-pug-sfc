import type { Rule } from 'eslint';
import type { Loc } from 'pug-lexer';
import { checkIsVueFile, parsePugContent } from '../utils';
import { getChecker, getExactConverter, isPascalCase, pascalCase } from '../utils/casing';
import { isHtmlWellKnownElementName } from '../utils/html-element';
import { isMathMlWellKnownElementName } from '../utils/math-ml-element';
import { toRegExp } from '../utils/regexp';
import { isSvgWellKnownElementName } from '../utils/svg-element';
import { executeOnVue, getRegisteredVueComponents } from '../utils/vue';

type AllowedCaseOptions = 'PascalCase' | 'kebab-case';
interface RuleOptions {
  registeredComponentsOnly: boolean;
  ignores: string[];
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce specific casing for the component naming style in template',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/component-name-in-template-casing.html'
    },
    fixable: 'code',
    schema: [
      {
        enum: ['PascalCase', 'kebab-case']
      },
      {
        type: 'object',
        properties: {
          ignores: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            additionalItems: false
          },
          registeredComponentsOnly: {
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

    const caseOption: AllowedCaseOptions = context.options[0] === 'kebab-case' ? 'kebab-case' : 'PascalCase';
    const { registeredComponentsOnly = true, ignores = [] }: RuleOptions = context.options[1] ?? {};
    const ignoresRE: RegExp[] = ignores.map(toRegExp);

    const registeredComponents: string[] = [];

    /**
     * Checks whether the given tag is the verification target.
     *
     * @param tagName Name of the tag.
     * @returns `true` if the given node is the verification target node.
     */
    function isVerifyTarget(tagName: string): boolean {
      if (ignoresRE.some((re) => re.test(tagName))) {
        // ignore
        return false;
      }

      if (!registeredComponentsOnly) {
        // Checks all component tags.
        if (
          isHtmlWellKnownElementName(tagName) ||
          isSvgWellKnownElementName(tagName) ||
          isMathMlWellKnownElementName(tagName)
        ) {
          return false;
        }
        return true;
      }

      // When defining a component with PascalCase, we can use either case.
      if (registeredComponents.some((name) => tagName === name || pascalCase(tagName) === name)) {
        return true;
      }

      return false;
    }

    return {
      ...(registeredComponentsOnly
        ? executeOnVue(context, (obj) => {
            registeredComponents.push(
              ...getRegisteredVueComponents(obj)
                .map((n) => n!.name)
                .filter(isPascalCase)
            );
          })
        : {}),
      'Program:exit'() {
        for (const token of tokens) {
          if (token.type === 'tag') {
            const tagName: string = token.val;

            if (!isVerifyTarget(tagName)) {
              continue;
            }

            if (!getChecker(caseOption)(tagName)) {
              const loc: Loc = token.loc;

              // @ts-expect-error: Access range from token
              const range: [number, number] = token.range;
              const columnStart: number = loc.start.column - 1;
              const columnEnd: number = columnStart + tagName.length;

              context.report({
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
                message: 'Component name "{{name}}" is not {{caseType}}.',
                data: {
                  name: tagName,
                  caseType: caseOption
                },
                fix(fixer) {
                  const casingTagName: string = getExactConverter(caseOption)(tagName);
                  return fixer.replaceTextRange(range, casingTagName);
                }
              });
            }
          }
        }
      }
    };
  }
} as Rule.RuleModule;
