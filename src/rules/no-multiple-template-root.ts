import type { Rule } from 'eslint';
import { Loc } from 'pug-lexer';
import { processRule } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow adding multiple root nodes to the template',
      categories: ['essential'],
      url: 'https://eslint.vuejs.org/rules/no-multiple-template-root.html'
    },
    fixable: undefined,
    schema: []
  },
  create(context) {
    return processRule(context, () => {
      let hasTagBefore: boolean = false;
      let indentLevel: number = 0;
      let rootTokenCount: number = 0;

      return {
        indent() {
          indentLevel++;
        },
        outdent() {
          indentLevel--;
          hasTagBefore = false;
        },
        tag(token) {
          hasTagBefore = true;

          if (indentLevel > 0) {
            return;
          }

          rootTokenCount++;

          let message: string | undefined;

          if (token.val === 'template') {
            message = "The template root disallows 'template' elements.";
          } else if (token.val === 'slot') {
            message = "The template root disallows 'slot' elements.";
          }
          // else if (rootTokenCount >= 2) {
          //   message = 'The template root requires exactly one element.';
          // }

          if (message) {
            const loc: Loc = token.loc;

            const columnStart: number = loc.start.column - 1;
            const columnEnd: number = columnStart + token.val.length;

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
              message
            });
          }
        },
        text(token) {
          if (indentLevel > 0) {
            return;
          }

          if (hasTagBefore) {
            return;
          }

          const loc: Loc = token.loc;

          const columnStart: number = loc.start.column - 1;
          const columnEnd: number = columnStart + token.val.length;

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
            message: 'The template root requires an element rather than texts.'
          });
        },
        attribute(token) {
          if (indentLevel > 0) {
            return;
          }

          if (token.name === 'v-for') {
            const loc: Loc = token.loc;

            const columnStart: number = loc.start.column - 1;
            const columnEnd: number = columnStart + token.name.length;

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
              message: "The template root disallows 'v-for' directives."
            });
          }
        }
      };
    });
  }
} as Rule.RuleModule;
