import { RuleTester } from 'eslint';
import rule from '../../src/rules/this-in-template';

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser')
});

ruleTester.run('this-in-template', rule, {
  valid: [
    '',
    '<template lang="pug"></template>',
    `<template lang="pug">
div
</template>`
  ],
  invalid: []
});
