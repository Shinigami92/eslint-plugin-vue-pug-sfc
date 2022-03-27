// Onetime generated from https://github.com/vuejs/eslint-plugin-vue/blob/8f094200664a2b10bc597016f5486066a174e098/tests/lib/rules/no-textarea-mustache.js

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import type { Rule } from 'eslint';
import { RuleTester } from 'eslint';
import * as vuePlugin from 'eslint-plugin-vue';

const rule: Rule.RuleModule = vuePlugin.rules['no-textarea-mustache']!;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2015,
    templateTokenizer: { pug: 'vue-eslint-parser-template-tokenizer-pug' },
  },
});

tester.run('no-textarea-mustache', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '',
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  textarea(v-model="text")
</template>`,
    },
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  textarea {{text}}
</template>`,
      errors: ["Unexpected mustache. Use 'v-model' instead."],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  textarea {{text}}
    | and
    | {{text}}
</template>`,
      errors: [
        "Unexpected mustache. Use 'v-model' instead.",
        "Unexpected mustache. Use 'v-model' instead.",
      ],
    },
  ],
});
