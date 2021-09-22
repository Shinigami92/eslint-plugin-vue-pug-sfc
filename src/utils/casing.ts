// TS converted copy of https://github.com/vuejs/eslint-plugin-vue/blob/03ba30e95a625c46be0c6c58660ac9f061877a87/lib/utils/casing.js

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Capitalize a string.
 *
 * @param str The string to capitalize.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Checks whether the given string has symbols.
 *
 * @param str The string to check.
 */
export function hasSymbols(str: string): RegExpExecArray | null {
  return /[!"#%&'()*+,./:;<=>?@[\\\]^`{|}]/u.exec(str); // without " ", "$", "-" and "_"
}
/**
 * Checks whether the given string has upper.
 *
 * @param str The string to check.
 */
export function hasUpper(str: string): RegExpExecArray | null {
  return /[A-Z]/u.exec(str);
}

/**
 * Convert text to kebab-case.
 *
 * @param str Text to be converted.
 */
export function kebabCase(str: string): string {
  return str
    .replace(/_/gu, '-')
    .replace(/\B([A-Z])/gu, '-$1')
    .toLowerCase();
}

/**
 * Checks whether the given string is kebab-case.
 *
 * @param str The string to check.
 */
export function isKebabCase(str: string): boolean {
  if (
    hasUpper(str) ||
    hasSymbols(str) ||
    /^-/u.exec(str) || // starts with hyphen is not kebab-case
    /_|--|\s/u.exec(str)
  ) {
    return false;
  }
  return true;
}

/**
 * Convert text to snake_case.
 *
 * @param str Text to be converted.
 */
export function snakeCase(str: string): string {
  return str
    .replace(/\B([A-Z])/gu, '_$1')
    .replace(/-/gu, '_')
    .toLowerCase();
}

/**
 * Checks whether the given string is snake_case.
 *
 * @param str The string to check.
 */
export function isSnakeCase(str: string): boolean {
  if (hasUpper(str) || hasSymbols(str) || /-|__|\s/u.exec(str)) {
    return false;
  }
  return true;
}

/**
 * Convert text to camelCase.
 *
 * @param str Text to be converted.
 */
export function camelCase(str: string): string {
  if (isPascalCase(str)) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }
  return str.replace(/[-_](\w)/gu, (_, c: string) => (c ? c.toUpperCase() : ''));
}

/**
 * Checks whether the given string is camelCase.
 *
 * @param str The string to check.
 */
export function isCamelCase(str: string): boolean {
  if (
    hasSymbols(str) ||
    /^[A-Z]/u.exec(str) ||
    /-|_|\s/u.exec(str) // kebab or snake or space
  ) {
    return false;
  }
  return true;
}

/**
 * Convert text to PascalCase.
 *
 * @param str Text to be converted.
 * @return Converted string.
 */
export function pascalCase(str: string): string {
  return capitalize(camelCase(str));
}

/**
 * Checks whether the given string is PascalCase.
 *
 * @param str The string to check.
 */
export function isPascalCase(str: string): boolean {
  if (
    hasSymbols(str) ||
    /^[a-z]/u.exec(str) ||
    /-|_|\s/u.exec(str) // kebab or snake or space
  ) {
    return false;
  }
  return true;
}

export type CaseType = 'camelCase' | 'kebab-case' | 'PascalCase' | 'snake_case';

export const checkersMap: Record<CaseType, (str: string) => boolean> = {
  'kebab-case': isKebabCase,
  snake_case: isSnakeCase,
  camelCase: isCamelCase,
  PascalCase: isPascalCase
};

/**
 * Return case checker.
 *
 * @param { 'camelCase' | 'kebab-case' | 'PascalCase' | 'snake_case' } name type of checker to return ('camelCase', 'kebab-case', 'PascalCase')
 * @return {isKebabCase|isCamelCase|isPascalCase|isSnakeCase}
 */
export function getChecker(name: CaseType): (str: string) => boolean {
  return checkersMap[name] || isPascalCase;
}

export const convertersMap: Record<CaseType, (str: string) => string> = {
  'kebab-case': kebabCase,
  snake_case: snakeCase,
  camelCase,
  PascalCase: pascalCase
};

/**
 * Return case converter
 *
 * @param name type of converter to return ('camelCase', 'kebab-case', 'PascalCase')
 * @return kebabCase | camelCase | pascalCase | snakeCase
 */
export function getConverter(name: CaseType): (str: string) => string {
  return convertersMap[name] || pascalCase;
}

export const allowedCaseOptions: ['camelCase', 'kebab-case', 'PascalCase'] = ['camelCase', 'kebab-case', 'PascalCase'];

/**
 * Return case exact converter.
 * If the converted result is not the correct case, the original value is returned.
 *
 * @param name type of converter to return ('camelCase', 'kebab-case', 'PascalCase')
 * @return kebabCase | camelCase | pascalCase | snakeCase
 */
export function getExactConverter(name: CaseType): (str: string) => string {
  const converter: (str: string) => string = getConverter(name);
  const checker: (str: string) => boolean = getChecker(name);
  return (str) => {
    const result: string = converter(str);
    return checker(result) ? result : str; /* cannot convert */
  };
}
