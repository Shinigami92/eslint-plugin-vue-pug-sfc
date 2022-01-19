# How to contribute

At first: Thank you for being interested and using my plugin. :smiley_cat:

# Basic steps

1. Create a fork and checkout your fork.
2. Run `./release.sh` or at least the `Cleanup` and `Prepare` steps in this script.
3. Create an issue for your feature or fix.
4. Create a `Draft` pull request that also references your created issue.  
   <img src="https://user-images.githubusercontent.com/7195563/94909445-78ee5e00-04a3-11eb-8c9b-8e743c6d6c0e.png" width="197px" />
5. Request me (@Shinigami92) as reviewer.  
   <img src="https://user-images.githubusercontent.com/7195563/94909295-3e84c100-04a3-11eb-9596-80e7ea52ab3f.png" width="185px" />
6. When you are finished, press the `Ready for review`.  
   <img src="https://user-images.githubusercontent.com/7195563/94908140-8d315b80-04a1-11eb-95ee-b57f23dfa885.png" width="574px" />

# Working on a pull request

- Please add tests for your implementation if necessary.
- Do not change `version` in `package.json`, that will be my part after merging.
- Before switching from `Draft` to `Request for review`, please perform `pnpm run lint` and `pnpm run format`.

# Adding/Migrating a rule from eslint-plugin-vue

- Add the rule file to `src/rules/<rulename>.ts`
- Add the rule `src/rules/index.ts`
- Add the rule to the config(s) `src/configs/`
- Add the test `tests/rules/<rulename>.test.ts`

# Content of a rule definition

```ts
import type { Rule } from 'eslint';
import type { AttributeToken, Loc } from 'pug-lexer';
import { processRule } from '../utils';

// Some outer functions and variables

export default {
  meta: {
    // Copied exactly from `eslint-plugin-vue`
  },
  create(context) {
    return processRule(context, () => {
      // Get rule options

      // Some inner functions and variables

      return {
        // Listen to a token
        tag(token, { index, tokens }) {
          // Do something with tag token
        },
        attribute(token, { index, tokens }) {
          // Do something with attribute token

          const condition = true; // Do something with condition
          if (condition) {
            const loc: Loc = token.loc;

            const columnStart: number = loc.start.column - 1;
            const columnEnd: number = columnStart + 'some length'.length;

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
              // Message related stuff from the rule
              // Maybe also the `fixer`
            });
          }
        },
      };
    });
  },
} as Rule.RuleModule;
```
