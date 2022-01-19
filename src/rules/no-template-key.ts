import type { Rule } from 'eslint';
import type { AttributeToken, Loc } from 'pug-lexer';
import { processRule } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow `key` attribute on `<template>`',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/no-template-key.html',
    },
    fixable: undefined,
    schema: [],
    messages: {
      disallow:
        "'template' cannot be keyed. Place the key on real elements instead.",
    },
  },
  create(context) {
    return processRule(context, () => {
      let lastTagWasTemplate: boolean = false;
      let keyToken: AttributeToken | undefined;
      let hasVFor: boolean = false;

      return {
        tag(token) {
          lastTagWasTemplate = token.val === 'template';
          keyToken = undefined;
          hasVFor = false;
        },
        attribute(token) {
          if (/^(v-bind)?:?key$/.test(token.name)) {
            keyToken = token;
          } else if (token.name === 'v-for') {
            hasVFor = true;
          }
        },
        'end-attributes'() {
          if (!lastTagWasTemplate || !keyToken || hasVFor) {
            return;
          }

          const loc: Loc = keyToken.loc;

          const columnStart: number = loc.start.column - 1;
          const columnEnd: number = loc.end.column - 1;

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
            messageId: 'disallow',
          });
        },
      };
    });
  },
} as Rule.RuleModule;
