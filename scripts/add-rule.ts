import { readdirSync, writeFileSync } from 'node:fs';
import type { Options } from 'prettier';
import { format } from 'prettier';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const prettierConfig: Options = require('../.prettierrc.cjs');

const ruleName: string = process.argv[2];

const camelize: (str: string) => string = (str) =>
  str.replace(/-./g, (x) => x[1].toUpperCase());

// Write rule source code
writeFileSync(
  `./src/rules/${ruleName}.ts`,
  `import type { Rule } from 'eslint';
import type { Loc } from 'pug-lexer';
import { processRule } from '../utils';

export default {
  meta: {},
  create(context) {
    return processRule(context, () => {
      return {};
    });
  }
} as Rule.RuleModule;
`
);

// Write rule test code
writeFileSync(
  `./tests/rules/${ruleName}.test.ts`,
  `import { RuleTester } from 'eslint';
import rule from '../../src/rules/${ruleName}';

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
});

ruleTester.run('${ruleName}', rule, {
  valid: [],
  invalid: []
});
`
);

// Add rule to src/rules/index.ts
const rules: string[] = readdirSync('./src/rules')
  .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
  .map((file) => file.replace('.ts', ''));

writeFileSync(
  './src/rules/index.ts',
  format(
    `import type { Rule } from 'eslint';
${rules.map((rule) => `import ${camelize(rule)} from './${rule}';`).join('\n')}

export default {
${rules.map((rule) => `  '${rule}': ${camelize(rule)}`).join(',\n')}
} as Record<string, Rule.RuleModule>;
`,
    { parser: 'typescript', ...prettierConfig }
  )
);

console.log(
  `Don't forget to add rule ${ruleName} to related src/configs file(s).`
);
