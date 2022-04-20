// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import type { Rule } from 'eslint';
import utils from 'eslint-plugin-vue/lib/utils';
import casing from 'eslint-plugin-vue/lib/utils/casing';
import { toRegExp } from 'eslint-plugin-vue/lib/utils/regexp';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const allowedCaseOptions = ['PascalCase', 'kebab-case'];
const defaultCase = 'PascalCase';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce specific casing for the component naming style in template',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/component-name-in-template-casing.html',
      dropIn: true,
    },
    fixable: 'code',
    schema: [
      {
        enum: allowedCaseOptions,
      },
      {
        type: 'object',
        properties: {
          ignores: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            additionalItems: false,
          },
          registeredComponentsOnly: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const caseOption = context.options[0];
    const options = context.options[1] || {};
    const caseType =
      allowedCaseOptions.indexOf(caseOption) !== -1 ? caseOption : defaultCase;

    const ignores: RegExp[] = (options.ignores || []).map(toRegExp);
    const registeredComponentsOnly = options.registeredComponentsOnly !== false;
    const tokens =
      context.parserServices.getTemplateBodyTokenStore &&
      context.parserServices.getTemplateBodyTokenStore();

    const registeredComponents: string[] = [];

    /**
     * Checks whether the given node is the verification target node.
     * @param {VElement} node element node
     * @returns {boolean} `true` if the given node is the verification target node.
     */
    function isVerifyTarget(node): boolean {
      if (ignores.some((re) => re.test(node.rawName))) {
        // ignore
        return false;
      }

      if (!registeredComponentsOnly) {
        // If the user specifies registeredComponentsOnly as false, it checks all component tags.
        if (
          (!utils.isHtmlElementNode(node) && !utils.isSvgElementNode(node)) ||
          utils.isHtmlWellKnownElementName(node.rawName) ||
          utils.isSvgWellKnownElementName(node.rawName)
        ) {
          return false;
        }
        return true;
      }
      // We only verify the components registered in the component.
      if (
        registeredComponents
          .filter((name) => casing.isPascalCase(name)) // When defining a component with PascalCase, you can use either case
          .some(
            (name) =>
              node.rawName === name || casing.pascalCase(node.rawName) === name,
          )
      ) {
        return true;
      }

      return false;
    }

    let hasInvalidEOF = false;

    return utils.defineTemplateBodyVisitor(
      context,
      {
        VElement(node) {
          if (hasInvalidEOF) {
            return;
          }

          if (!isVerifyTarget(node)) {
            return;
          }

          const name = node.rawName;
          if (!casing.getChecker(caseType)(name)) {
            const startTag = node.startTag;
            const open = tokens.getFirstToken(startTag);
            const casingName = casing.getExactConverter(caseType)(name);
            context.report({
              node: open,
              loc: open.loc,
              message: 'Component name "{{name}}" is not {{caseType}}.',
              data: {
                name,
                caseType,
              },
              *fix(fixer) {
                yield fixer.replaceText(open, `${casingName}`);
              },
            });
          }
        },
      },
      {
        Program(node) {
          hasInvalidEOF = utils.hasInvalidEOF(node);
        },
        ...(registeredComponentsOnly
          ? utils.executeOnVue(context, (obj) => {
              registeredComponents.push(
                ...utils.getRegisteredComponents(obj).map((n) => n.name),
              );
            })
          : {}),
      },
    );
  },
} as Rule.RuleModule;
