// Onetime generated from https://github.com/vuejs/eslint-plugin-vue/blob/8f094200664a2b10bc597016f5486066a174e098/tests/lib/rules/no-deprecated-filter.js

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import type { Rule } from 'eslint';
import { RuleTester } from 'eslint';
import * as vuePlugin from 'eslint-plugin-vue';

const rule: Rule.RuleModule = vuePlugin.rules['no-deprecated-filter']!;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2015,
    templateTokenizer: { pug: 'vue-eslint-parser-template-tokenizer-pug' },
  },
});

ruleTester.run('no-deprecated-filter', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template lang="pug">| {{ msg }}</template>',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">| {{ method(msg) }}</template>',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">| {{ msg | filter }}</template>',
      parserOptions: {
        vueFeatures: {
          filter: false,
          templateTokenizer: {
            pug: 'vue-eslint-parser-template-tokenizer-pug',
          },
        },
      },
    },
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template lang="pug">| {{ msg | filter }}</template>',
      errors: ['Filters are deprecated.'],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">| {{ msg | filter(x) }}</template>',
      errors: ['Filters are deprecated.'],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">| {{ msg | filterA | filterB }}</template>',
      errors: ['Filters are deprecated.'],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-for="msg in messages") {{ msg | filter }}</template>',
      errors: ['Filters are deprecated.'],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-bind:id="msg | filter")</template>',
      errors: ['Filters are deprecated.'],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-bind:id="msg | filter(aaa)")</template>',
      errors: ['Filters are deprecated.'],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-bind:id="msg | filterA | filterB")</template>',
      errors: ['Filters are deprecated.'],
    },
  ],
});
