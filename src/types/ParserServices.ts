import type { VDocumentFragment } from 'vue-eslint-parser/ast';

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
   * Get the root document fragment.
   * @returns The root document fragment.
   */
  getDocumentFragment(): VDocumentFragment | null;
}
