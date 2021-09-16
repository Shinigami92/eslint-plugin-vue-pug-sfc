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

const CACHED_PUG_CONTENT_RETURN_CONTENT_MAP: Map<string, ParsePugContentReturn> = new Map();

export function parsePugContent(context: Rule.RuleContext): ParsePugContentReturn {
  const cacheKey: string = context.getSourceCode().text;
  const cachedValue: ParsePugContentReturn | undefined = CACHED_PUG_CONTENT_RETURN_CONTENT_MAP.get(cacheKey);
  if (cachedValue) {
    return cachedValue;
  }

  const result: ParsePugContentReturn = { text: '', tokens: [] };

  const parserServices: ParserServices = context.parserServices;

  // Parse the pug content to tokens
  const df: AST.VDocumentFragment | null | undefined = parserServices.getDocumentFragment?.();
  if (!df) {
    CACHED_PUG_CONTENT_RETURN_CONTENT_MAP.set(cacheKey, result);
    return result;
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
    CACHED_PUG_CONTENT_RETURN_CONTENT_MAP.set(cacheKey, result);
    return result;
  }

  const pugText: string = context
    .getSourceCode()
    .text.slice(pugTemplateElement.startTag.range[1], pugTemplateElement.endTag?.range[0]);
  // console.debug(pugText);

  const pugTokens: lex.Token[] = lex(pugText);
  // console.debug(pugTokens);

  let currentLength: number = pugTemplateElement.startTag.range[1];
  for (let index: number = 0; index < pugTokens.length; index++) {
    const token: lex.Token = pugTokens[index]!;

    const start: number = currentLength;
    const end: number = currentLength + tokenLength(token);
    // @ts-expect-error: Add range to token
    token.range = [start, end];

    currentLength = end;
  }

  result.text = pugText;
  result.tokens = pugTokens;
  CACHED_PUG_CONTENT_RETURN_CONTENT_MAP.set(cacheKey, result);
  return result;
}

function tokenLength(token: lex.Token): number {
  let length: number = 0;
  if ('val' in token) {
    if (typeof token.val === 'string') {
      if ('name' in token) {
        length += token.name.length + 1;
      }

      length += token.val.length;
    }
  }

  return length;
}
