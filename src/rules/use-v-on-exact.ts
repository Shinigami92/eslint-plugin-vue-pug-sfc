import type { Rule } from 'eslint';
import type { AttributeToken, Loc, Token } from 'pug-lexer';
import { checkIsVueFile, parsePugContent } from '../utils';

const SYSTEM_MODIFIERS: ReadonlyArray<string> = ['ctrl', 'shift', 'alt', 'meta'];
const GLOBAL_MODIFIERS: ReadonlyArray<string> = ['stop', 'prevent', 'capture', 'self', 'once', 'passive', 'native'];

type SystemModifier = 'ctrl' | 'shift' | 'alt' | 'meta';
type GlobalModifier = 'stop' | 'prevent' | 'capture' | 'self' | 'once' | 'passive' | 'native';

/**
 * Checks whether given modifier is a key modifier.
 */
function isKeyModifier(modifier: string): boolean {
  return !GLOBAL_MODIFIERS.includes(modifier) && !SYSTEM_MODIFIERS.includes(modifier);
}

/**
 * Checks whether given modifier is system one.
 */
function isSystemModifier(modifier: string): boolean {
  return SYSTEM_MODIFIERS.includes(modifier);
}

/**
 * Checks whether given any of provided modifiers has system modifier.
 */
function hasSystemModifier(modifiers: string[]): boolean {
  return modifiers.some(isSystemModifier);
}

/**
 * Creates alphabetically sorted string with system modifiers.
 *
 * @returns e.g. "alt,ctrl,del,shift"
 */
function getSystemModifiersString(modifiers: string[]): string {
  return modifiers.filter(isSystemModifier).sort().join(',');
}

/**
 * Creates alphabetically sorted string with key modifiers.
 *
 * @returns e.g. "enter,tab"
 */
function getKeyModifiersString(modifiers: string[]): string {
  return modifiers.filter(isKeyModifier).sort().join(',');
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of `exact` modifier on `v-on`',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/use-v-on-exact.html'
    },
    fixable: undefined,
    schema: []
  },
  create(context) {
    if (!checkIsVueFile(context)) {
      return {};
    }

    const { tokens } = parsePugContent(context);

    if (tokens.length === 0) {
      return {};
    }

    let eventAttributes: AttributeToken[] = [];

    for (let index: number = 0; index < tokens.length; index++) {
      const token: Token = tokens[index]!;

      // TODO: For components consider only events with `native` modifier

      // Reset attributes cache
      if (token.type === 'start-attributes') {
        eventAttributes = [];
        continue;
      }

      // Add only event attributes
      if (token.type === 'attribute' && (token.name.startsWith('v-on:') || token.name.startsWith('@'))) {
        eventAttributes.push(token);
        continue;
      }

      // Check if there are similar event attributes
      if (token.type === 'end-attributes' && eventAttributes.length > 1) {
        const eventAttributeMatches: RegExpExecArray[] = eventAttributes.map(
          (attr) => /^(v-on:|@)(?<name>[\w[\]]+)\.?(?<modifiers>(.+))?/.exec(attr.name)!
        );
        // Start at index 1 / skip first element
        for (let outerIndex: number = 1; outerIndex < eventAttributes.length; outerIndex++) {
          const eventAttributeToken: AttributeToken = eventAttributes[outerIndex]!;
          const { name: eventName, modifiers: eventModifiersGroup } = eventAttributeMatches[outerIndex]!.groups!;
          const eventModifiers: string[] = eventModifiersGroup?.split('.') ?? [];

          if (eventModifiers.includes('exact')) {
            // No need to check if `exact` modifier is already present
            continue;
          }

          for (let matchIndex: number = 0; matchIndex < eventAttributeMatches.length; matchIndex++) {
            if (matchIndex === outerIndex) {
              // Don't compare attribute with itself
              continue;
            }

            const { name: otherName, modifiers: otherModifiersGroup } = eventAttributeMatches[matchIndex]!.groups!;

            if (eventName === otherName) {
              const otherModifiers: string[] = otherModifiersGroup?.split('.') ?? [];

              const eventKeyModifiers: string = getKeyModifiersString(eventModifiers);
              const otherKeyModifiers: string = getKeyModifiersString(otherModifiers);

              if (eventKeyModifiers && otherKeyModifiers && eventKeyModifiers !== otherKeyModifiers) {
                continue;
              }

              const eventSystemModifiers: string = getSystemModifiersString(eventModifiers);
              const otherSystemModifiers: string = getSystemModifiersString(otherModifiers);

              if (
                !(
                  otherModifiers.length >= 1 &&
                  otherSystemModifiers !== eventSystemModifiers &&
                  otherSystemModifiers.indexOf(eventSystemModifiers) > -1
                )
              ) {
                continue;
              }

              const loc: Loc = eventAttributeToken.loc;

              const columnStart: number = loc.start.column - 1;
              const columnEnd: number = loc.end.column - 1;

              context.report({
                node: {} as unknown as Rule.Node,
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
                message: "Consider to use '.exact' modifier."
              });
            }
          }
        }
      }
    }

    return {};
  }
} as Rule.RuleModule;
