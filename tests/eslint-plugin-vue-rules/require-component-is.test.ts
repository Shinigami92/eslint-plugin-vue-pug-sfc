// Onetime generated from https://github.com/vuejs/eslint-plugin-vue/blob/8f094200664a2b10bc597016f5486066a174e098/tests/lib/rules/require-component-is.js

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import type { Rule } from 'eslint';
import { RuleTester } from 'eslint';
import * as vuePlugin from 'eslint-plugin-vue';

const rule: Rule.RuleModule = vuePlugin.rules['require-component-is']!;

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

tester.run('require-component-is', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">component(v-bind:is="type")</template>',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">component(:is="type")</template>',
    },
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template lang="pug">component(is="type")</template>',
      errors: [
        "Expected '<component>' elements to have 'v-bind:is' attribute.",
      ],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">component(v-foo:is="type")</template>',
      errors: [
        "Expected '<component>' elements to have 'v-bind:is' attribute.",
      ],
    },
  ],
});
