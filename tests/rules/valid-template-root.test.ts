import { RuleTester } from 'eslint';
import rule from '../../src/rules/valid-template-root';

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
});

ruleTester.run('valid-template-root', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div abc</template>'
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
      code: `<template>
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
    {
      filename: 'test.vue',
      code: '<template lang="pug" src="foo.pug"></template>'
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
  textarea
  | test
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
table
  custom-thead
</template>`
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">test</template>'
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
div
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
| {{ a b c }}
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div
| aaaaaa
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
| aaaaaa
div
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-for="x in list")
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
slot
</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
template
</template>`
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template lang="pug"></template>',
      errors: [
        {
          message: 'The template requires child element.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug" src="foo.pug">
| abc
</template>`,
      errors: [
        {
          message: "The template root with 'src' attribute is required to be empty.",
          line: 1,
          column: 36,
          endLine: 3,
          endColumn: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug" src="foo.pug">div</template>',
      errors: [
        {
          message: "The template root with 'src' attribute is required to be empty.",
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 39
        }
      ]
    }
  ]
});
