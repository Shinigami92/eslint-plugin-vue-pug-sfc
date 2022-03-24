// AUTOGENERATED FROM https://github.com/vuejs/eslint-plugin-vue/blob/8f094200664a2b10bc597016f5486066a174e098/tests/lib/rules/no-template-key.js
/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import * as vuePlugin from 'eslint-plugin-vue';

const rule = vuePlugin.rules['no-template-key'];

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

tester.run('no-template-key', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">template</template>',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(key="foo")</template>',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-bind:key="foo")</template>',
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(:key="foo")</template>',
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
template(v-for="item in list", :key="item.id")
  div
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
template(v-for="(item, i) in list", :key="i")
  div
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
template(v-for="item in list", :key="foo + item.id")
  div
</template>`,
    },
    {
      filename: 'test.vue',
      // It is probably not valid, but it works as the Vue.js 3.x compiler.
      // We can prevent it with other rules. e.g. vue/require-v-for-key
      code: `<template lang="pug">
template(v-for="item in list", key="foo")
  div
</template>`,
    },
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(key="foo")
</template>`,
      errors: [
        "'<template>' cannot be keyed. Place the key on real elements instead.",
      ],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(v-bind:key="foo")
</template>`,
      errors: [
        "'<template>' cannot be keyed. Place the key on real elements instead.",
      ],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(:key="foo")
</template>`,
      errors: [
        "'<template>' cannot be keyed. Place the key on real elements instead.",
      ],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
template(v-slot="item", :key="item.id")
  div
</template>`,
      errors: [
        "'<template>' cannot be keyed. Place the key on real elements instead.",
      ],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
template(v-for="item in list")
  template(:key="item.id")
    div
</template>`,
      errors: [
        "'<template>' cannot be keyed. Place the key on real elements instead.",
      ],
    },
  ],
});