import { RuleTester } from 'eslint';
import rule from '../../src/rules/require-component-is';

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 },
});

ruleTester.run('require-component-is', rule, {
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
      errors: ["Expected 'component' elements to have 'v-bind:is' attribute."],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">component(v-foo:is="type")</template>',
      errors: ["Expected 'component' elements to have 'v-bind:is' attribute."],
    },
  ],
});
