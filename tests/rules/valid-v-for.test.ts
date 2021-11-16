import { RuleTester } from 'eslint';
import rule from '../../src/rules/valid-v-for';

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
});

ruleTester.run('valid-v-for', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
 div(v-for="x in list")
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="x of list")
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="(x, i, k) in list")
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="(x, i, k) of list")
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="({id, name}, i, k) of list")
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="([id, name], i, k) of list")
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  your-component(v-for="x in list" :key="x.id")
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(is="your-component" v-for="x in list" :key="x.id")
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(:is="your-component" v-for="x in list" :key="x.id")
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(v-for="x in list")
    custom-component(:key="x")
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(v-for="x in list")
    div(:key="x")
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(v-for="x in list")
    div
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
template(v-for="x of list")
  slot(name="item")
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
template(v-for="x of list")
  | foo
  div
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(v-for="x of list")
    div(v-for="foo of x" :key="foo")
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
template(v-for="x in xs")
  template(v-for="y in x.ys")
    li(v-for="z in y.zs" :key="z.id") 123
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
template(v-for="x in xs")
  template(v-for="y in ys")
    li(v-for="z in zs" :key="x.id + y.id + z.id") 123
</template>`
    },
    // `key` on `template` : In Vue.js 3.x, you can place `key` on `template`.
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(v-for="x in list" v-bind:key="x")
    div
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(v-for="x in list" v-bind:key="x")
    MyComp
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(v-for="x in list" :key="x")
    div
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(v-for="x in list" :key="x")
    MyComp
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(v-for="x in list" :key="x.id")
    div
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(v-for="x in list" :key="x.id")
    MyComp
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(v-for="(x, i) in list" :key="i")
    div
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(v-for="(x, i) in list" :key="i")
    MyComp
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(v-for="x in list" :key="x")
    custom-component
</template>`
    },
    // `key` on `slot` : In Vue.js 3.x, you can place `key` on `slot`.
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  slot(v-for="x in list" :key="x")
    div
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  slot(v-for="x in list" :key="x")
    MyComp
</template>`
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: `<template lang="pug">
div(v-for=".")
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(v-for="xin list")
    div
</template>`
    },
    // comment value (parsing error)
    {
      filename: 'comment-value.vue',
      code: `<template lang="pug">
div(v-for="/**/")
</template>`
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for:aaa="x in list")
</template>`,
      errors: ["'v-for' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for.aaa="x in list")
</template>`,
      errors: ["'v-for' directives require no modifier."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for)
</template>`,
      errors: ["'v-for' directives require that attribute value."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="(,a,b) in list")
</template>`,
      errors: ["Invalid alias ''."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="(a,,b) in list")
</template>`,
      errors: ["Invalid alias ''."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="(a,b,,) in list")
</template>`,
      errors: ["Invalid alias ''."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="(a,{b,c}) in list")
</template>`,
      errors: ["Invalid alias '{b,c}'."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="(a,b,{c,d}) in list")
</template>`,
      errors: ["Invalid alias '{c,d}'."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  your-component(v-for="x in list")
</template>`,
      errors: ["Custom elements in iteration require 'v-bind:key' directives."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(is="your-component" v-for="x in list")
</template>`,
      errors: ["Custom elements in iteration require 'v-bind:key' directives."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(:is="your-component" v-for="x in list")
</template>`,
      errors: ["Custom elements in iteration require 'v-bind:key' directives."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-bind:is="your-component" v-for="x in list")
</template>`,
      errors: ["Custom elements in iteration require 'v-bind:key' directives."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="x in list" :key="100")
</template>`,
      errors: ["Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  custom-component(v-for="x in list" :key="100")
</template>`,
      errors: ["Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="x in list" :key="foo")
</template>`,
      errors: ["Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  custom-component(v-for="x in list" :key="foo")
</template>`,
      errors: ["Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-for="(item, index) in suggestions" :key)
</template>`,
      errors: ["Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  template(v-for="x of list")
    div(v-for="foo of y" :key="foo")
</template>`,
      errors: ["Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."]
    },
    {
      filename: 'test.vue',
      errors: ["Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."],
      code: `<template lang="pug">
template(v-for="x in xs")
  template(v-for="y in a.ys")
    li(v-for="z in y.zs" :key="z.id") 123
</template>`
    },
    {
      filename: 'test.vue',
      errors: ["Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."],
      code: `<template lang="pug">
template(v-for="x in xs")
  template(v-for="y in x.ys")
    li(v-for="z in a.zs" :key="z.id") 123
</template>`
    },
    {
      filename: 'test.vue',
      errors: ["Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."],
      code: `<template lang="pug">
template(v-for="x in xs")
  template(v-for="y in x.ys")
    li(v-for="z in x.zs" :key="z.id") 123
</template>`
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: `<template lang="pug">
div(v-for="")
</template>`,
      errors: ["'v-for' directives require that attribute value."]
    }
  ]
});
