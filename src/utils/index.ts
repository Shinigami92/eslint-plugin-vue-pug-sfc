import type { Rule } from 'eslint';
import * as path from 'path';
import * as lex from 'pug-lexer';
import { AST } from 'vue-eslint-parser';
import type { ParserServices } from '../types/ParserServices';

export function checkIsVueFile(context: Rule.RuleContext): boolean {
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
    return false;
  }
  return true;
}

export interface ParsePugContentReturn {
  text: string;
  tokens: lex.Token[];
}

export function parsePugContent(context: Rule.RuleContext): ParsePugContentReturn {
  const parserServices: ParserServices = context.parserServices;

  // Parse the pug content to tokens
  const df: AST.VDocumentFragment | null | undefined = parserServices.getDocumentFragment?.();
  if (!df) {
    return { text: '', tokens: [] };
  }

  const pugTemplateElement: AST.VElement | undefined = df.children.find(
    (node) =>
      node.type === 'VElement' &&
      node.name === 'template' &&
      node.startTag.attributes.some(
        (attr) => !attr.directive && attr.key.name === 'lang' && attr.value && attr.value.value === 'pug'
      )
  ) as AST.VElement | undefined;

  if (!pugTemplateElement) {
    return { text: '', tokens: [] };
  }

  const pugText: string = context
    .getSourceCode()
    .text.slice(pugTemplateElement.startTag.range[1], pugTemplateElement.endTag?.range[0]);
  // console.debug(pugText);

  const pugTokens: lex.Token[] = lex(pugText);
  // console.debug(pugTokens);

  return { text: pugText, tokens: pugTokens };
}
