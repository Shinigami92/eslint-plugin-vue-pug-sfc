import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-deprecated-filter';

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
});

ruleTester.run('no-deprecated-filter', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template lang="pug">| {{ msg }}</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">| {{ method(msg) }}</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">| {{ msg | filter }}</template>',
      parserOptions: {
        vueFeatures: { filter: false }
      }
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  | msg | filter
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  | text =|> {{ msg }}
</template>`
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">v-text-field(label="|my-label|")</template>'
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template lang="pug">| {{ msg | filter }}</template>',
      errors: [
        {
          message: 'Filters are deprecated.',
          line: 1,
          column: 3,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">| {{ msg | filter(x) }}</template>',
      errors: [
        {
          message: 'Filters are deprecated.',
          line: 1,
          column: 3,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">| {{ msg | filterA | filterB }}</template>',
      errors: [
        {
          message: 'Filters are deprecated.',
          line: 1,
          column: 3,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-for="msg in messages") {{ msg | filter }}</template>',
      errors: [
        {
          message: 'Filters are deprecated.',
          line: 1,
          column: 30,
          endColumn: 48
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-bind:id="msg | filter")</template>',
      errors: [
        {
          message: 'Filters are deprecated.',
          line: 1,
          column: 15,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-bind:id="msg | filter(aaa)")</template>',
      errors: [
        {
          message: 'Filters are deprecated.',
          line: 1,
          column: 15,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-bind:id="msg | filterA | filterB")</template>',
      errors: [
        {
          message: 'Filters are deprecated.',
          line: 1,
          column: 15,
          endColumn: 40
        }
      ]
    }
  ]
});
