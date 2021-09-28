import { RuleTester } from 'eslint';
import rule from '../../src/rules/require-v-for-key';

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
});

ruleTester.run('require-v-for-key', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(v-for="x in list" v-bind:key="x")</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(v-for="x in list" :key="x.foo")</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: custom-component(v-for="x in list")</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: template(v-for="x in list"): div(:key="x")</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: slot(v-for="x in list" :name="x")</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: slot(v-for="x in list" :name="x"): div(:key="x")</template>'
    },
    // key on <template lang="pug"> : In Vue.js 3.x, you can place key on <template lang="pug">.
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: template(v-for="x in list" v-bind:key="x"): div</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: template(v-for="x in list" v-bind:key="x"): MyComp</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: template(v-for="x in list" :key="x"): div</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: template(v-for="x in list" :key="x"): MyComp</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: template(v-for="x in list" :key="x.id"): div</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: template(v-for="x in list" :key="x.id"): MyComp</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: template(v-for="(x, i) in list" :key="i"): div</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: template(v-for="(x, i) in list" :key="i"): MyComp</template>'
    },
    // key on <slot> : In Vue.js 3.x, you can place key on <slot>.
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: slot(v-for="x in list" :key="x"): div</template>'
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: slot(v-for="x in list" :key="x"): MyComp</template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(v-for="x in list")</template>',
      errors: ["Elements in iteration expect to have 'v-bind:key' directives."]
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: div(v-for="x in list" key="100")</template>',
      errors: ["Elements in iteration expect to have 'v-bind:key' directives."]
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: template(v-for="x in list"): div</template>',
      errors: ["Elements in iteration expect to have 'v-bind:key' directives."]
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div: slot(v-for="x in list" :name="x"): div</template>',
      errors: ["Elements in iteration expect to have 'v-bind:key' directives."]
    }
  ]
});
