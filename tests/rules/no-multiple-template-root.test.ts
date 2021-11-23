import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-multiple-template-root';

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
});

ruleTester.run('no-multiple-template-root', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `<template lang="pug">div abc</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div abc
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
//- comment
div abc
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
//- comment
div(v-if="foo") abc
div(v-else) abc
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
//- comment
div(v-if="foo") abc
div(v-else-if="bar") abc
div(v-else) abc
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
div(v-if="foo")
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="foo")
div(v-else-if="bar")
</template>`
    },

    // https://github.com/vuejs/eslint-plugin-vue/issues/1439
    {
      code: `<template lang="pug">
Link(:to="to" class="flex items-center")
  span(v-if="prefixIcon || $slots.prefix" class="mr-1")
    slot(name="prefix")
      FontAwesomeIcon(v-if="prefixIcon" :icon="prefixIcon" fixedWidth)
  slot
</template>`,
      filename: 'test.vue'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
div
</template>`,
      errors: ['The template root requires exactly one element.']
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
| {{a b c}}
</template>`,
      errors: ['The template root requires an element rather than texts.']
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
| aaaaaa
</template>`,
      errors: ['The template root requires an element rather than texts.']
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
| aaaaaa
div
</template>`,
      errors: ['The template root requires an element rather than texts.']
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-for="x in list")
</template>`,
      errors: ["The template root disallows 'v-for' directives."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">slot</template>`,
      errors: ["The template root disallows 'slot' elements."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">template</template>`,
      errors: ["The template root disallows 'template' elements."]
    }
  ]
});
