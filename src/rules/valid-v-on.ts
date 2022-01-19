import type { Rule } from 'eslint';
import type { Loc } from 'pug-lexer';
import { processRule } from '../utils';
import { JS_RESERVED } from '../utils/js-reserved';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid `v-on` directives',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/valid-v-on.html',
    },
    fixable: undefined,
    schema: [
      {
        type: 'object',
        properties: {
          modifiers: {
            type: 'array',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unsupportedModifier:
        "'v-on' directives don't support the modifier '{{modifier}}'.",
      avoidKeyword:
        'Avoid using JavaScript keyword as "v-on" value: {{value}}.',
      expectedValueOrVerb:
        "'v-on' directives require a value or verb modifier (like 'stop' or 'prevent').",
    },
  },
  create(context) {
    return processRule(context, () => {
      const { modifiers = [] } = context.options[0] || {};

      return {
        attribute(token) {
          if (!/^(v-on|@)/.test(token.name)) {
            return;
          }

          let messageId: string = '';

          let val: string = '';
          if (
            token.name.startsWith('v-on') &&
            !token.name.startsWith('v-on:')
          ) {
            if (
              typeof token.val === 'string' &&
              token.val.slice(1, -1).trim().length === 0
            ) {
              messageId = 'expectedValueOrVerb';
            } else if (typeof token.val === 'boolean') {
              messageId = 'expectedValueOrVerb';
            }
          } else if (typeof token.val === 'string') {
            val = token.val.slice(1, -1).trim();
            if (val.length === 0) {
              messageId = 'expectedValueOrVerb';
            } else if (JS_RESERVED.includes(val)) {
              messageId = 'avoidKeyword';
            }
          } else if (
            /^(v-on:|@)/.test(token.name) &&
            typeof token.val === 'boolean'
          ) {
            messageId = 'expectedValueOrVerb';
          }

          const loc: Loc = token.loc;

          const columnStart: number = loc.start.column - 1;
          const columnEnd: number = columnStart + token.name.length;

          if (!messageId) {
            const result: RegExpExecArray | null = /^(v-on:|@)\w+\.(.*)/.exec(
              token.name
            );
            if (result?.[2]) {
              const eventModifiers: string[] = result[2].split('.');
              const VALID_MODIFIERS: string[] = [
                'stop',
                'prevent',
                'capture',
                'self',
                'ctrl',
                'shift',
                'alt',
                'meta',
                'native',
                'once',
                'left',
                'right',
                'middle',
                'passive',
                'esc',
                'tab',
                'enter',
                'space',
                'up',
                'left',
                'right',
                'down',
                'delete',
                'exact',
              ];
              for (const eventModifier of eventModifiers) {
                if (
                  ![...VALID_MODIFIERS, ...modifiers].includes(eventModifier)
                ) {
                  context.report({
                    node: {} as unknown as Rule.Node,
                    loc: {
                      line: loc.start.line,
                      column: loc.start.column - 1,
                      start: {
                        line: loc.start.line,
                        column: columnStart,
                      },
                      end: {
                        line: loc.end.line,
                        column: columnEnd,
                      },
                    },
                    messageId: 'unsupportedModifier',
                    data: { modifier: eventModifier },
                  });
                }
              }
            }
          }

          if (!messageId) {
            return;
          }

          if (messageId !== 'unsupportedModifier') {
            context.report({
              node: {} as unknown as Rule.Node,
              loc: {
                line: loc.start.line,
                column: loc.start.column - 1,
                start: {
                  line: loc.start.line,
                  column: columnStart,
                },
                end: {
                  line: loc.end.line,
                  column: columnEnd,
                },
              },
              messageId,
              data:
                messageId === 'avoidKeyword'
                  ? { value: `"${val}"` }
                  : undefined,
            });
          }
        },
      };
    });
  },
} as Rule.RuleModule;
