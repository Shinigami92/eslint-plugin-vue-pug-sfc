// TS converted copy of https://github.com/vuejs/eslint-plugin-vue/blob/03ba30e95a625c46be0c6c58660ac9f061877a87/lib/utils/regexp.js

const RE_REGEXP_CHAR: RegExp = /[\\^$.*+?()[\]{}|]/gu;
const RE_HAS_REGEXP_CHAR: RegExp = new RegExp(RE_REGEXP_CHAR.source);

const RE_REGEXP_STR: RegExp = /^\/(.+)\/(.*)$/u;

/**
 * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
 * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
 *
 * @param str The string to escape.
 * @returns Returns the escaped string.
 */
export function escape(str: string): string {
  return str && RE_HAS_REGEXP_CHAR.test(str) ? str.replace(RE_REGEXP_CHAR, '\\$&') : str;
}

/**
 * Convert a string to the `RegExp`.
 * Normal strings (e.g. `"foo"`) is converted to `/^foo$/` of `RegExp`.
 * Strings like `"/^foo/i"` are converted to `/^foo/i` of `RegExp`.
 *
 * @param str The string to convert.
 * @returns Returns the `RegExp`.
 */
export function toRegExp(str: string): RegExp {
  const parts: RegExpExecArray | null = RE_REGEXP_STR.exec(str);
  if (parts?.[1]) {
    return new RegExp(parts[1], parts[2]);
  }
  return new RegExp(`^${escape(str)}$`);
}

/**
 * Checks whether given string is regexp string
 *
 * @param str The string to check.
 * @returns Returns `true` if given string is regexp string, otherwise `false`.
 */
export function isRegExp(str: string): boolean {
  return Boolean(RE_REGEXP_STR.exec(str));
}
