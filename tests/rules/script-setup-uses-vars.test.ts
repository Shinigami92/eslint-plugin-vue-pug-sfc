import { Linter, RuleTester, Rule } from 'eslint';
import rule from '../../src/rules/script-setup-uses-vars';

const ruleNoUnusedVars: Rule.RuleModule = new Linter().getRules().get('no-unused-vars')!;

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

const linter = (ruleTester as any).linter
linter.defineRule('script-setup-uses-vars', rule);

ruleTester.run('no-unused-vars', ruleNoUnusedVars, {
  valid: [
    {
      filename: 'test.vue',
      code: `<script setup>
/* eslint script-setup-uses-vars: 1 */
// imported components are also directly usable in template
import Foo from './Foo.vue'
import { ref } from 'vue'
// write Composition API code just like in a normal setup()
// but no need to manually return everything
const count = ref(0)
const inc = () => {
  count.value++
}
</script>
<template lang="pug">
Foo(:count="count" @click="inc")
</template>`,
    },
//     {
//       filename: 'test.vue',
//       code: `<script setup>
// /* eslint script-setup-uses-vars: 1 */
// const msg = 'Hello!'
// </script>
// <template lang="pug">
// div {{ msg }}
// </template>`,
//     },
//     {
//       filename: 'test.vue',
//       code: `<script setup>
// /* eslint script-setup-uses-vars: 1 */
// import Foo from './Foo.vue'
// import MyComponent from './MyComponent.vue'
// </script>
// <template lang="pug">
// Foo
// <!-- kebab-case also works -->
// my-component
// </template>`,
//     },
//     {
//       filename: 'test.vue',
//       code: `<script setup>
// /* eslint script-setup-uses-vars: 1 */
// import Foo from './Foo.vue'
// import Bar from './Bar.vue'
// </script>
// <template lang="pug">
// component(:is="Foo")
// component(:is="someCondition ? Foo : Bar")
// </template>`,
//     },
//     {
//       filename: 'test.vue',
//       code: `<script setup>
// /* eslint script-setup-uses-vars: 1 */
// import { directive as vClickOutside } from 'v-click-outside'
// </script>
// <template lang="pug">
// div(v-click-outside)
// </template>`,
//     },

//     // Resolve component name
//     {
//       filename: 'test.vue',
//       code: `<script setup>
// /* eslint script-setup-uses-vars: 1 */
// import FooPascalCase from './component.vue'
// import BarPascalCase from './component.vue'
// import BazPascalCase from './component.vue'
// </script>
// <template lang="pug">
// FooPascalCase
// bar-pascal-case
// bazPascalCase
// </template>`,
//     },
//     {
//       filename: 'test.vue',
//       code: `<script setup>
// /* eslint script-setup-uses-vars: 1 */
// import fooCamelCase from './component.vue'
// import barCamelCase from './component.vue'
// </script>
// <template lang="pug">
// fooCamelCase
// bar-camel-case
// </template>`,
//     },

//     // TopLevel await
//     {
//       filename: 'test.vue',
//       code: `<script setup>
// /* eslint script-setup-uses-vars: 1 */
// const post = await fetch(\`/api/post/1\`).then((r) => r.json())
// </script>
// <template lang="pug">
// | {{post}}
// </template>`,
//       parserOptions: {
//         ecmaVersion: 2022,
//         sourceType: 'module',
//       },
//     },

//     // ref
//     {
//       filename: 'test.vue',
//       code: `<script setup>
// /* eslint script-setup-uses-vars: 1 */
// import {ref} from 'vue'
// const v = ref(null)
// </script>
// <template lang="pug">
// div(ref="v")
// </template>`,
//     },
  ],

  invalid: [
//     {
//       filename: 'test.vue',
//       code: `<script setup>
// /* eslint script-setup-uses-vars: 1 */
// // imported components are also directly usable in template
// import Foo from './Foo.vue'
// import Bar from './Bar.vue'
// import { ref } from 'vue'
// // write Composition API code just like in a normal setup()
// // but no need to manually return everything
// const count = ref(0)
// const inc = () => {
//   count.value++
// }
// const foo = ref(42)
// console.log(foo.value)
// const bar = ref(42)
// bar.value++
// const baz = ref(42)
// </script>
// <template lang="pug">
// Foo(:count="count" @click="inc")
// </template>`,
//       errors: [
//         {
//           message: "'Bar' is defined but never used.",
//           line: 5,
//         },
//         {
//           message: "'baz' is assigned a value but never used.",
//           line: 18,
//         },
//       ],
//     },

    // Resolve component name
//     {
//       filename: 'test.vue',
//       code: `<script setup>
// /* eslint script-setup-uses-vars: 1 */
// import camelCase from './component.vue'
// </script>
// <template lang="pug">
// CamelCase
// </template>`,
//       errors: [
//         {
//           message: "'camelCase' is defined but never used.",
//           line: 3,
//         },
//       ],
//     },

//     // Scope tests
//     {
//       filename: 'test.vue',
//       code: `<script setup>
// /* eslint script-setup-uses-vars: 1 */
// if (a) {
//   const msg = 'Hello!'
// }
// </script>
// <template lang="pug">
// div {{ msg }}
// </template>`,
//       errors: [
//         {
//           message: "'msg' is assigned a value but never used.",
//           line: 4,
//         },
//       ],
//     },
//     {
//       filename: 'test.vue',
//       code: `<script setup>
// /* eslint script-setup-uses-vars: 1 */
// const i = 42
// const list = [1,2,3]
// </script>
// <template lang="pug">
// div(v-for="i in list") {{ i }}
// </template>`,
//       errors: [
//         {
//           message: "'i' is assigned a value but never used.",
//           line: 3,
//         },
//       ],
//     },

//     // Not `<script setup>`
//     {
//       filename: 'test.vue',
//       code: `<script>
// /* eslint script-setup-uses-vars: 1 */
// const msg = 'Hello!'
// </script>
// <template lang="pug">
// div {{ msg }}
// </template>`,
//       errors: [
//         {
//           message: "'msg' is assigned a value but never used.",
//           line: 3,
//         },
//       ],
//     },
  ],
});
