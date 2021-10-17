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
      code: '<template lang="pug">{{ msg }}</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">{{ method(msg) }}</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">{{ msg | filter }}</template>',
      parserOptions: {
        vueFeatures: { filter: false }
      }
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template lang="pug">{{ msg | filter }}</template>',
      errors: ['Filters are deprecated.']
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">{{ msg | filter(x) }}</template>',
      errors: ['Filters are deprecated.']
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">{{ msg | filterA | filterB }}</template>',
      errors: ['Filters are deprecated.']
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-for="msg in messages") {{ msg | filter }}</template>',
      errors: ['Filters are deprecated.']
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-bind:id="msg | filter")</template>',
      errors: ['Filters are deprecated.']
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-bind:id="msg | filter(aaa)")</template>',
      errors: ['Filters are deprecated.']
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-bind:id="msg | filterA | filterB")</template>',
      errors: ['Filters are deprecated.']
    }
  ]
});
