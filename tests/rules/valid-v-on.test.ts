import { RuleTester } from 'eslint';
import rule from '../../src/rules/valid-v-on';

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 },
});

ruleTester.run('valid-v-on', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '',
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-on:click="foo")
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(@click="foo")
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(@click.prevent.ctrl.left="foo")
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(@keydown.27="foo")
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(@keydown.enter="foo")
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(@keydown.arrow-down="foo")
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(@keydown.esc="foo")
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(@keydown.a="foo")
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(@keydown.b="foo")
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(@keydown.a.b.c="foo")
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
el-from(@submit.native.prevent)
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-on:click.prevent)
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-on:click.native.stop)
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-on="$listeners")
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-on="{a, b, c: d}")
</template>`,
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(@keydown.bar="foo")
</template>`,
      options: [{ modifiers: ['bar'] }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-on:keydown.bar.aaa="foo")
</template>`,
      options: [{ modifiers: ['bar', 'aaa'] }],
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: `<template lang="pug">
MyComponent(v-on:keydown=".")
</template>`,
    },
    // comment value (valid)
    {
      filename: 'comment-value.vue',
      code: `<template lang="pug">
MyComponent(v-on:keydown="/**/")
</template>`,
    },
    {
      filename: 'comment-value.vue',
      code: `<template lang="pug">
MyComponent(v-on:keydown=/**/)
</template>`,
    },
    {
      filename: 'comment-value.vue',
      code: `<template lang="pug">
MyComponent(v-on:keydown.stop="/**/")
</template>`,
    },
    {
      filename: 'comment-value.vue',
      code: `<template lang="pug">
MyComponent(v-on:keydown.stop=/**/)
</template>`,
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: `<template lang="pug">
MyComponent(v-on:keydown.stop="")
</template>`,
    },
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-on:click.aaa="foo")
</template>`,
      errors: ["'v-on' directives don't support the modifier 'aaa'."],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-on:click)
</template>`,
      errors: [
        "'v-on' directives require a value or verb modifier (like 'stop' or 'prevent').",
      ],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(@click)
</template>`,
      errors: [
        "'v-on' directives require a value or verb modifier (like 'stop' or 'prevent').",
      ],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(@keydown.bar.aaa="foo")
</template>`,
      errors: ["'v-on' directives don't support the modifier 'aaa'."],
      options: [{ modifiers: ['bar'] }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(@keydown.bar.aaa="foo")
</template>`,
      errors: ["'v-on' directives don't support the modifier 'bar'."],
      options: [{ modifiers: ['aaa'] }],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(@click="const")
</template>`,
      errors: ['Avoid using JavaScript keyword as "v-on" value: "const".'],
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(@click="delete")
</template>`,
      errors: ['Avoid using JavaScript keyword as "v-on" value: "delete".'],
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: `<template lang="pug">
MyComponent(v-on:keydown="")
</template>`,
      errors: [
        "'v-on' directives require a value or verb modifier (like 'stop' or 'prevent').",
      ],
    },
  ],
});
