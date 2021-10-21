import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-deprecated-dollar-scopedslots-api';

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
});

ruleTester.run('no-deprecated-dollar-scopedslots-api', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-bind="$attrs")
</template>
<script>
export default {
  mounted () {
    this.$emit('start')
  }
}
</script>`
    },
    {
      filename: 'test.vue',
      code: `<script>
export default {
  methods: {
    click () {
      this.$emit('click')
    }
  }
}
</script>`
    },
    {
      filename: 'test.vue',
      code: `<script>
export default {}

const another = function () {
  console.log(this.$scopedSlots)
}
</script>`
    },
    // Ignore these false positives for now
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(foo="$scopedSlots")
    // </template>`
    //     },
    //     {
    //       filename: 'test.vue',
    //       code: `<template lang="pug">
    // div(v-on="() => { function click ($scopedSlots) { fn(foo.$scopedSlots); fn($scopedSlots) } }")
    // div(v-for="$scopedSlots in list")
    //   div(v-on="$scopedSlots")
    // VueComp
    //   template(v-slot="{$scopedSlots}")
    //     div(v-on="$scopedSlots")
    // </template>
    // <script>
    // export default {
    //   methods: {
    //     click ($scopedSlots) {
    //       foo.$scopedSlots
    //     }
    //   }
    // }
    // </script>`
    //     },
    {
      filename: 'test.vue',
      code: `<script>
export default {
  computed: {
    foo () {
      const {vm} = this
      return vm.$scopedSlots
    }
  }
}
</script>`
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-if="$scopedSlots.default")
</template>
<script>
export default {
  render() {
    return this.$scopedSlots.foo('bar')
  }
}
</script>`,
      output: `<template lang="pug">
div(v-if="$slots.default")
</template>
<script>
export default {
  render() {
    return this.$scopedSlots.foo('bar')
  }
}
</script>`,
      errors: [
        {
          line: 2,
          column: 11,
          messageId: 'deprecated',
          endLine: 2,
          endColumn: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-for="slot in $scopedSlots")
div(:foo="$scopedSlots")
</template>
<script>
export default {
  computed: {
    foo () {
      fn(this.$scopedSlots)
    }
  }
}
</script>`,
      output: `<template lang="pug">
div(v-for="slot in $slots")
div(:foo="$slots")
</template>
<script>
export default {
  computed: {
    foo () {
      fn(this.$scopedSlots)
    }
  }
}
</script>`,
      errors: [
        {
          line: 2,
          column: 20,
          messageId: 'deprecated',
          endLine: 2,
          endColumn: 32
        },
        {
          line: 3,
          column: 11,
          messageId: 'deprecated',
          endLine: 3,
          endColumn: 23
        }
      ]
    }
  ]
});
