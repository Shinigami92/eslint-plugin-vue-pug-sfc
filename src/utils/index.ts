import type { Rule } from 'eslint';
import * as path from 'path';
import type { VDocumentFragment, VElement } from 'vue-eslint-parser/ast';

export interface TemplateListener {
  [key: string]: ((node: any) => void) | undefined;
}

export interface ParserServices {
  /**
   * Define handlers to traverse the template body.
   * @param templateBodyVisitor The template body handlers.
   * @param scriptVisitor The script handlers. This is optional.
   * @param options The options. This is optional.
   */
  defineTemplateBodyVisitor(
    templateBodyVisitor: { [key: string]: (...args: any) => void },
    scriptVisitor?: { [key: string]: (...args: any) => void },
    options?: { templateBodyTriggerSelector: 'Program' | 'Program:exit' }
  ): any;

  /**
   * Define handlers to traverse the document.
   * @param documentVisitor The document handlers.
   * @param options The options. This is optional.
   */
  defineDocumentVisitor(
    documentVisitor: { [key: string]: (...args: any) => void },
    options?: { triggerSelector: 'Program' | 'Program:exit' }
  ): any;

  /**
   * Define handlers to traverse custom blocks.
   * @param context The rule context.
   * @param parser The custom parser.
   * @param rule The custom block rule definition
   * @param scriptVisitor The script handlers. This is optional.
   */
  defineCustomBlocksVisitor(
    context: Rule.RuleContext,
    parser: any,
    rule: {
      target: string | string[] | ((lang: string | null, customBlock: VElement) => boolean);
      create: any;
    },
    scriptVisitor: { [key: string]: (...args: any) => void }
  ): { [key: string]: (...args: any) => void };

  /**
   * Get the token store of the template body.
   * @returns The token store of template body.
   */
  getTemplateBodyTokenStore(): any;

  /**
   * Get the root document fragment.
   * @returns The root document fragment.
   */
  getDocumentFragment(): VDocumentFragment | null;
}

/**
 * Register the given visitor to parser services.
 * If the parser service of `vue-eslint-parser` was not found,
 * this generates a warning.
 *
 * @param context The rule context to use parser services.
 * @returns The merged visitor.
 */
export function checkIfVueFile(context: Rule.RuleContext): Rule.RuleListener {
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

  return {};
}
