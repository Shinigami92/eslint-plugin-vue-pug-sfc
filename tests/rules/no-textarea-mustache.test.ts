import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-textarea-mustache';

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 },
});

ruleTester.run('no-textarea-mustache', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: textarea(v-model="text")</template>',
    },
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: textarea {{text}}</template>',
      errors: ["Unexpected mustache. Use 'v-model' instead."],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: textarea {{text}} and {{text}}</template>',
      errors: [
        "Unexpected mustache. Use 'v-model' instead.",
        // TODO: Original rule reports 2 errors. One for each `{{...}}`.
        //"Unexpected mustache. Use 'v-model' instead."
      ],
    },
  ],
});
