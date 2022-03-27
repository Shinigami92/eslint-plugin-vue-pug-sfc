// Onetime generated from https://github.com/vuejs/eslint-plugin-vue/blob/8f094200664a2b10bc597016f5486066a174e098/tests/lib/rules/no-use-v-if-with-v-for.js

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import type { Rule } from 'eslint';
import { RuleTester } from 'eslint';
import * as vuePlugin from 'eslint-plugin-vue';

const rule: Rule.RuleModule = vuePlugin.rules['no-use-v-if-with-v-for']!;

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

tester.run('no-use-v-if-with-v-for', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '',
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="x in list", v-if="x")
</template>`,
      options: [{ allowUsingIterationVar: true }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="x in list", v-if="x.foo")
</template>`,
      options: [{ allowUsingIterationVar: true }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="(x,i) in list", v-if="i%2==0")
</template>`,
      options: [{ allowUsingIterationVar: true }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="shown")
  div(v-for="(x,i) in list")
</template>`,
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">ul: li(v-for="user in activeUsers", :key="user.id") {{ user.name }}</template>',
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">ul(v-if="shouldShowUsers"): li(v-for="user in users", :key="user.id") {{ user.name }}</template>
      `,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="{x} in list", v-if="x")
</template>`,
      options: [{ allowUsingIterationVar: true }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="{x,y,z} in list", v-if="y.foo")
</template>`,
      options: [{ allowUsingIterationVar: true }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="({x,y,z},i) in list", v-if="i%2==0")
</template>`,
      options: [{ allowUsingIterationVar: true }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="shown")
  div(v-for="({x,y,z},i) in list")
</template>`,
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">ul: li(v-for="{user} in activeUsers", :key="user.id") {{ user.name }}</template>',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">ul(v-if="shouldShowUsers"): li(v-for="{user} in users", :key="user.id") {{ user.name }}</template>',
    },
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(v-for="x in list", v-if="shown")</template>',
      errors: [
        {
          message: "This 'v-if' should be moved to the wrapper element.",
          line: 1,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(v-for="x in list", v-if="list.lengt > 0")</template>',
      errors: [
        {
          message: "This 'v-if' should be moved to the wrapper element.",
          line: 1,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(v-for="x in list", v-if="x.isActive")</template>',
      errors: [
        {
          message:
            "The 'list' variable inside 'v-for' directive should be replaced with a computed property that returns filtered array instead. You should not mix 'v-for' with 'v-if'.",
          line: 1,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">ul: li(v-for="user in users", v-if="user.isActive", :key="user.id") {{ user.name }}</template>',
      errors: [
        {
          message:
            "The 'users' variable inside 'v-for' directive should be replaced with a computed property that returns filtered array instead. You should not mix 'v-for' with 'v-if'.",
          line: 1,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">ul: li(v-for="user in users", v-if="shouldShowUsers", :key="user.id") {{ user.name }}</template>',
      errors: [
        {
          message: "This 'v-if' should be moved to the wrapper element.",
          line: 1,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(v-for="{x,y,z} in list", v-if="z.isActive")</template>',
      errors: [
        {
          message:
            "The 'list' variable inside 'v-for' directive should be replaced with a computed property that returns filtered array instead. You should not mix 'v-for' with 'v-if'.",
          line: 1,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">ul: li(v-for="{foo, bar, user} in users", v-if="user.isActive", :key="user.id") {{ user.name }}</template>',
      errors: [
        {
          message:
            "The 'users' variable inside 'v-for' directive should be replaced with a computed property that returns filtered array instead. You should not mix 'v-for' with 'v-if'.",
          line: 1,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">ul: li(v-for="{foo, bar, user} in users", v-if="shouldShowUsers", :key="user.id") {{ user.name }}</template>',
      errors: [
        {
          message: "This 'v-if' should be moved to the wrapper element.",
          line: 1,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(v-for="{x} in list()", v-if="x.isActive")</template>',
      errors: [
        {
          message:
            "The 'list()' expression inside 'v-for' directive should be replaced with a computed property that returns filtered array instead. You should not mix 'v-for' with 'v-if'.",
          line: 1,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(v-for="i in 5", v-if="i")</template>',
      errors: [
        {
          message:
            "The '5' expression inside 'v-for' directive should be replaced with a computed property that returns filtered array instead. You should not mix 'v-for' with 'v-if'.",
          line: 1,
        },
      ],
    },
  ],
});
