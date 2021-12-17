import { RuleTester } from 'eslint';
import rule from '../../src/rules/valid-v-else';

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
});

ruleTester.run('valid-v-else', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-if="foo")
  div(v-else)
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
<div>
  <div v-if="foo"></div>
  <div v-else-if="foo"></div>
  <div v-else></div>
</div>
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
c1(v-if="1")
c2(v-else-if="1")
c3(v-else)
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-if="foo")
  slot
</template>`
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<template lang="pug">
template(v-else)
  div
</template>`,
      errors: ["'v-else' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-else)
</template>`,
      errors: ["'v-else' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-else)
</template>`,
      errors: ["'v-else' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div
  div(v-else)
</template>`,
      errors: ["'v-else' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(if="foo")
  div(v-else)
</template>`,
      errors: ["'v-else' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-if="foo")
  div
  div(v-else)
</template>`,
      errors: ["'v-else' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-if="foo")
  div(v-else v-if="bar")
</template>`,
      errors: ["'v-else' and 'v-if' directives can't exist on the same element. You may want 'v-else-if' directives."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-if="foo")
  div(v-else v-else-if="foo")
</template>`,
      errors: ["'v-else' and 'v-else-if' directives can't exist on the same element."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-if="foo")
  div(v-else:aaa)
</template>`,
      errors: ["'v-else' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-if="foo")
  div(v-else.aaa)
</template>`,
      errors: ["'v-else' directives require no modifier."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  div(v-if="foo")
  div(v-else="foo")
</template>`,
      errors: ["'v-else' directives require no attribute value."]
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: `<template lang="pug">
div(v-if="foo")
div(v-else=".")
</template>`,
      errors: ["'v-else' directives require no attribute value."]
    },
    // comment value
    {
      filename: 'comment-value.vue',
      code: `<template lang="pug">
div(v-if="foo")
div(v-else="/**/")
</template>`,
      errors: ["'v-else' directives require no attribute value."]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: `<template lang="pug">
div(v-if="foo")
div(v-else="")
</template>`,
      errors: ["'v-else' directives require no attribute value."]
    }
  ]
});
