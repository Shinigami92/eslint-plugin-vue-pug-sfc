import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-duplicate-attributes';

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 },
});

ruleTester.run('no-duplicate-attributes', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(foo :bar baz)</template>',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(@click="foo" @click="bar")</template>',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(style :style)</template>',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(class :class)</template>',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(:class="a" class="b")</template>',
      options: [{ allowCoexistStyle: true }],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(:style="a" style="b")</template>',
      options: [{ allowCoexistStyle: true }],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">my-component(foo :[foo])</template>',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">my-component(:foo :[foo])</template>',
    },
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(foo foo)</template>',
      errors: ["Duplicate attribute 'foo'."],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(foo v-bind:foo)</template>',
      errors: ["Duplicate attribute 'foo'."],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(foo :foo)</template>',
      errors: ["Duplicate attribute 'foo'."],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(style :style)</template>',
      errors: ["Duplicate attribute 'style'."],
      options: [{ allowCoexistStyle: false }],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(class :class)</template>',
      errors: ["Duplicate attribute 'class'."],
      options: [{ allowCoexistClass: false }],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(:style style)</template>',
      errors: ["Duplicate attribute 'style'."],
      options: [{ allowCoexistStyle: false }],
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(:class class)</template>',
      errors: ["Duplicate attribute 'class'."],
      options: [{ allowCoexistClass: false }],
    },
  ],
});
