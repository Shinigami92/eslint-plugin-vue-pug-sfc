// Partial copy of https://github.com/prettier/plugin-pug/blob/main/src/utils/common.ts

import type { AttributeToken, TagToken, Token } from 'pug-lexer';
import { findIndexFrom } from './index';

/**
 * Returns the previous tag token if there was one.
 *
 * @param tokens The token array.
 * @param index The current index within the token array..
 * @returns Previous tag token if there was one.
 */
export function previousTagToken(tokens: ReadonlyArray<Token>, index: number): TagToken | undefined {
  for (let i: number = index - 1; i >= 0; i--) {
    const token: Token | undefined = tokens[i];
    if (!token) {
      return;
    }
    if (token.type === 'tag') {
      return token;
    }
  }
  return;
}

/**
 * Returns the previous attribute token between the current token and the last occurrence of a `start-attributes` token.
 *
 * @param tokens A reference to the whole token array.
 * @param index The current index on which the cursor is in the token array.
 * @returns Previous attribute token if there was one.
 */
export function previousNormalAttributeToken(tokens: ReadonlyArray<Token>, index: number): AttributeToken | undefined {
  for (let i: number = index - 1; i > 0; i--) {
    const token: Token | undefined = tokens[i];
    if (!token || token.type === 'start-attributes') {
      return;
    }
    if (token.type === 'attribute') {
      if (token.name !== 'class' && token.name !== 'id') {
        return token;
      }
    }
  }
  return;
}

/**
 * Returns the previous type attribute token or undefined if no attribute is present.
 *
 * @param tokens A reference to the whole token array.
 * @param index The current index on which the cursor is in the token array.
 * @returns Previous attribute token if there was one.
 */
export function previousTypeAttributeToken(tokens: ReadonlyArray<Token>, index: number): AttributeToken | undefined {
  for (let i: number = index - 1; i > 0; i--) {
    const token: Token | undefined = tokens[i];
    if (!token || token.type === 'start-attributes' || token.type === 'tag') {
      return;
    }
    if (token.type === 'attribute') {
      if (token.name === 'type') {
        return token;
      }
    }
  }
  return;
}

export function getAttributeTokens(tag: TagToken, tokens: ReadonlyArray<Token>): AttributeToken[] {
  const tagIndex: number = tokens.indexOf(tag);
  const startAttributesIndex: number = findIndexFrom(tokens, ({ type }) => type === 'start-attributes', tagIndex);
  const endAttributesIndex: number = findIndexFrom(
    tokens,
    ({ type }) => type === 'end-attributes',
    startAttributesIndex
  );

  return tokens.slice(startAttributesIndex + 1, endAttributesIndex) as AttributeToken[];
}

export function getChildTags(tag: TagToken, tokens: ReadonlyArray<Token>): TagToken[] {
  const tagIndex: number = tokens.indexOf(tag);

  const children: TagToken[] = [];

  let indentLevel: number = 0;
  for (let index: number = tagIndex + 1; index < tokens.length; index++) {
    const token: Token = tokens[index]!;

    if (token.type === 'tag') {
      children.push(token);
    }

    if (token.type === 'indent') {
      indentLevel++;
    } else if (token.type === 'outdent') {
      indentLevel--;
    }

    if (indentLevel < 0) {
      break;
    }
  }

  return children;
}

/**
 * Indicates whether the attribute is a `style` normal attribute.
 *
 * ---
 *
 * Example style tag:
 * ```
 * span(style="color: red")
 * ```
 *
 * In this case `name` is `style` and `val` is `"color: red"`.
 *
 * ---
 *
 * @param name Name of tag attribute.
 * @param val Value of `style` tag attribute.
 * @returns Whether it's a style attribute that is quoted or not.
 */
export function isStyleAttribute(name: string, val: string): boolean {
  return name === 'style' && isQuoted(val);
}

/**
 * Indicates whether the value is surrounded by the `start` and `end` parameters.
 *
 * @param val Value of a tag attribute.
 * @param start The left hand side of the wrapping.
 * @param end The right hand side of the wrapping.
 * @param offset The offset from left and right where to search from.
 * @returns Whether the value is wrapped wit start and end from the offset or not.
 */
export function isWrappedWith(val: string, start: string, end: string, offset: number = 0): boolean {
  return val.startsWith(start, offset) && val.endsWith(end, val.length - offset);
}

/**
 * Indicates whether the value is surrounded by quotes.
 *
 * ---
 *
 * Example with double quotes:
 * ```
 * a(href="#")
 * ```
 *
 * In this case `val` is `"#"`.
 *
 * ---
 *
 * Example with single quotes:
 * ```
 * a(href='#')
 * ```
 *
 * In this case `val` is `'#'`.
 *
 * ---
 *
 * Example with no quotes:
 * ```
 * - const route = '#';
 * a(href=route)
 * ```
 *
 * In this case `val` is `route`.
 *
 * ---
 *
 * Special cases:
 * ```
 * a(href='/' + '#')
 * a(href="/" + "#")
 * ```
 *
 * These cases should not be treated as quoted.
 *
 * ---
 *
 * @param val Value of tag attribute.
 * @returns Whether the value is quoted or not.
 */
export function isQuoted(val: string): boolean {
  if (/^(["'`])(.*)\1$/.test(val)) {
    // Regex for checking if there are any unescaped quotations.
    const regex: RegExp = new RegExp(`${val[0]}(?<!\\\\${val[0]})`);
    return !regex.test(val.slice(1, -1));
  }
  return false;
}

/**
 * Detects whether the given value is a single line interpolation or not.
 *
 * @param val The value to check.
 * @returns `true` if it's a single line interpolation, otherwise `false`.
 */
export function isSingleLineWithInterpolation(val: string): boolean {
  return /^`[\s\S]*`$/.test(val) && val.includes('${');
}

/**
 * Detects whether the given value is a multiline interpolation or not.
 *
 * @param val The value to check.
 * @returns `true` if it's a multiline interpolation, otherwise `false`.
 */
export function isMultilineInterpolation(val: string): boolean {
  return /^`[\s\S]*`$/m.test(val) && val.includes('\n');
}
