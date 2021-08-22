import type { Rule } from 'eslint';
import * as path from 'path';

export interface TemplateListener {
  [key: string]: ((node: any) => void) | undefined;
}

export interface ParserServices {
  defineTemplateBodyVisitor?: (
    templateBodyVisitor: TemplateListener,
    scriptVisitor?: Rule.RuleListener,
    options?: { templateBodyTriggerSelector: 'Program' | 'Program:exit' }
  ) => Rule.RuleListener;
  getTemplateBodyTokenStore?(): { _tokens: any[] | undefined };
}

/**
 * Register the given visitor to parser services.
 * If the parser service of `vue-eslint-parser` was not found,
 * this generates a warning.
 *
 * @param context The rule context to use parser services.
 * @param templateBodyVisitor The visitor to traverse the template body.
 * @param scriptVisitor The visitor to traverse the script.
 * @param options The options.
 * @returns The merged visitor.
 */
export function defineTemplateBodyVisitor(
  context: Rule.RuleContext,
  templateBodyVisitor: TemplateListener,
  scriptVisitor?: Rule.RuleListener,
  options?: { templateBodyTriggerSelector: 'Program' | 'Program:exit' }
): Rule.RuleListener {
  const parserServices: ParserServices = context.parserServices;
  if (parserServices.defineTemplateBodyVisitor == null) {
    const filename: string = context.getFilename();
    if (path.extname(filename) === '.vue') {
      context.report({
        loc: { line: 1, column: 0 },
        message:
          'Use the latest vue-eslint-parser. See also https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error.'
      });
    }
    return {};
  }
  return parserServices.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor, options);
}
