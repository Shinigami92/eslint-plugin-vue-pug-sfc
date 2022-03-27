// Onetime generated from https://github.com/vuejs/eslint-plugin-vue/blob/8f094200664a2b10bc597016f5486066a174e098/tests/lib/rules/valid-template-root.js

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import type { Rule } from 'eslint';
import { RuleTester } from 'eslint';
import * as vuePlugin from 'eslint-plugin-vue';

const rule: Rule.RuleModule = vuePlugin.rules['valid-template-root']!;

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

tester.run('valid-template-root', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div abc</template>',
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">

div abc

</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">

// comment

div abc

</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">

// comment

div(v-if="foo") abc

div(v-else) abc

</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">

// comment

div(v-if="foo") abc

div(v-else-if="bar") abc

div(v-else) abc

</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">

c1(v-if="1")

c2(v-else-if="1")

c3(v-else)

</template>`,
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-if="foo")</template>',
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="foo")
div(v-else-if="bar")
</template>`,
    },
    {
      filename: 'test.vue',
      code: '<template src="foo.html"></template>',
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  textarea
  | test
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
table
  custom-thead
</template>`,
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">test</template>',
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
div
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">

div

div

</template>`,
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">| {{a b c}}</template>',
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
| aaaaaa
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
| aaaaaa
div
</template>`,
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-for="x in list")</template>',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">slot</template>',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">template</template>',
    },
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template lang="pug"></template>',
      errors: ['The template requires child element.'],
    },
    {
      filename: 'test.vue',
      // not sure what having lang="pug" on there would even mean, separate rule for that?
      code: '<template src="foo.html">abc</template>',
      errors: [
        "The template root with 'src' attribute is required to be empty.",
      ],
    },
    {
      filename: 'test.vue',
      code: '<template src="foo.html"><div></div></template>',
      errors: [
        "The template root with 'src' attribute is required to be empty.",
      ],
    },
  ],
});
