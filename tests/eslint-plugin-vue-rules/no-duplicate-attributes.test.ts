// Onetime generated from https://github.com/vuejs/eslint-plugin-vue/blob/8f094200664a2b10bc597016f5486066a174e098/tests/lib/rules/no-duplicate-attributes.js

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import type { Rule } from 'eslint';
import { RuleTester } from 'eslint';
import * as vuePlugin from 'eslint-plugin-vue';

const rule: Rule.RuleModule = vuePlugin.rules['no-duplicate-attributes']!;

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

tester.run('no-duplicate-attributes', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '',
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(foo, :bar, baz)
</template>`,
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(@click="foo", @click="bar")</template>',
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(style, :style)
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(class, :class)
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  .b(:class="a")
</template>`,
      options: [{ allowCoexistStyle: true }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(:style="a", style="b")
</template>`,
      options: [{ allowCoexistStyle: true }],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">my-component(foo, :[foo])</template>',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">my-component(:foo, :[foo])</template>',
    },
  ],
  invalid: [
    // {
    //   filename: 'test.vue',
    //   code: '<template><div><div foo foo></div></div></template>',
    //   errors: ["Duplicate attribute 'foo'."]
    // },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(foo, v-bind:foo)
</template>`,
      errors: ["Duplicate attribute 'foo'."],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(foo, :foo)
</template>`,
      errors: ["Duplicate attribute 'foo'."],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(style, :style)
</template>`,
      errors: ["Duplicate attribute 'style'."],
      options: [{ allowCoexistStyle: false }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(class, :class)
</template>`,
      errors: ["Duplicate attribute 'class'."],
      options: [{ allowCoexistClass: false }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(:style, style)
</template>`,
      errors: ["Duplicate attribute 'style'."],
      options: [{ allowCoexistStyle: false }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(:class, class)
</template>`,
      errors: ["Duplicate attribute 'class'."],
      options: [{ allowCoexistClass: false }],
    },
  ],
});
