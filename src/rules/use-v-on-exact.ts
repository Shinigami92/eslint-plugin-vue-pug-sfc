import type { Rule } from 'eslint';
import type { AttributeToken, Loc, Token } from 'pug-lexer';
import { checkIsVueFile, parsePugContent } from '../utils';
import { isCustomComponent } from '../utils/vue';

const SYSTEM_MODIFIERS: ReadonlyArray<string> = ['ctrl', 'shift', 'alt', 'meta'];
const GLOBAL_MODIFIERS: ReadonlyArray<string> = ['stop', 'prevent', 'capture', 'self', 'once', 'passive', 'native'];

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

function extractName(event: string): string {
  return /^(v-on:|@)(?<name>\w+)\./.exec(event)?.groups?.name ?? '';
}

function extractModifiers(event: string): string[] {
  return event.replace(/^(v-on:|@)(\w+).?/, '').split('.');
}

/**
 * Group all events in an object, with keys representing each event name.
 *
 * @returns e.g. `{ click: [], keypress: [] }`
 */
function groupEvents(events: AttributeToken[]): Record<string, AttributeToken[]> {
  return events.reduce<Record<string, AttributeToken[]>>((acc, event) => {
    const name: string = extractName(event.name);
    if (acc[name]) {
      acc[name]!.push(event);
    } else {
      acc[name] = [event];
    }
    return acc;
  }, {});
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

/**
 * Compares two events based on their modifiers to detect possible event leakage.
 */
function hasConflictedModifiers(baseEvent: AttributeToken, event: AttributeToken): boolean {
  if (event === baseEvent) {
    return false;
  }

  const eventModifiers: string[] = extractModifiers(event.name);
  if (eventModifiers.includes('exact')) {
    return false;
  }

  const baseEventModifiers: string[] = extractModifiers(baseEvent.name);

  const eventKeyModifiers: string = getKeyModifiersString(eventModifiers);
  const baseEventKeyModifiers: string = getKeyModifiersString(baseEventModifiers);

  if (eventKeyModifiers && baseEventKeyModifiers && eventKeyModifiers !== baseEventKeyModifiers) {
    return false;
  }

  const eventSystemModifiers: string = getSystemModifiersString(eventModifiers);
  const baseEventSystemModifiers: string = getSystemModifiersString(baseEventModifiers);

  return (
    baseEventModifiers.length >= 1 &&
    baseEventSystemModifiers !== eventSystemModifiers &&
    baseEventSystemModifiers.indexOf(eventSystemModifiers) > -1
  );
}

/**
 * Searches for events that might conflict with each other.
 *
 * @returns Conflicted events, without duplicates.
 */
function findConflictedEvents(events: AttributeToken[]): AttributeToken[] {
  return events.reduce<AttributeToken[]>((acc, event) => {
    return [
      ...acc,
      ...events
        .filter((evt) => !acc.find((e) => evt === e)) // No duplicates
        .filter(hasConflictedModifiers.bind(null, event))
    ];
  }, []);
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

    let tagIsCustomComponent: boolean = false;
    let eventAttributes: AttributeToken[] = [];

    for (let index: number = 0; index < tokens.length; index++) {
      const token: Token = tokens[index]!;

      // For components consider only events with `native` modifier
      if (token.type === 'tag') {
        tagIsCustomComponent = isCustomComponent(token, tokens);
        continue;
      }

      // Reset attributes cache
      if (token.type === 'start-attributes') {
        eventAttributes = [];
        continue;
      }

      // Add only event attributes
      if (token.type === 'attribute' && (token.name.startsWith('v-on:') || token.name.startsWith('@'))) {
        if (tagIsCustomComponent && !token.name.includes('.native')) {
          // For components consider only events with `native` modifier
          continue;
        }

        eventAttributes.push(token);
        continue;
      }

      // Check if there are similar event attributes
      if (token.type === 'end-attributes' && eventAttributes.length > 1) {
        const groupedEvents: Record<string, AttributeToken[]> = groupEvents(eventAttributes);
        Object.entries(groupedEvents).forEach(([eventName, eventsInGroup]) => {
          const hasEventWithKeyModifiers: boolean = eventsInGroup.some((event) =>
            hasSystemModifier(extractModifiers(event.name))
          );

          if (!hasEventWithKeyModifiers) {
            return;
          }

          const conflictedEvents: AttributeToken[] = findConflictedEvents(eventsInGroup);

          conflictedEvents.forEach((event) => {
            const loc: Loc = event.loc;

            const columnStart: number = loc.start.column - 1;
            const columnEnd: number = columnStart + event.name.length;

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
          });
        });
      }
    }

    return {};
  }
} as Rule.RuleModule;
