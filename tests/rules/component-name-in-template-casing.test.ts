import { RuleTester } from 'eslint';
import rule from '../../src/rules/component-name-in-template-casing';

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser')
});

ruleTester.run('component-name-in-template-casing', rule, {
  valid: [
    // default
    {
      code: `<template lang="pug">
//- ✓ GOOD
CoolComponent
UnregisteredComponent
unregistered-component
</template>
<script>
export default {
  components: {
    CoolComponent
  }
}
</script>`,
      filename: 'test.vue'
    },

    // element types test
    {
      code: '<template lang="pug">div</template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template lang="pug">img</template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template lang="pug">TheComponent</template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template lang="pug">svg: path</template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template lang="pug">math: mspace</template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template lang="pug">div: slot</template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template lang="pug">h1 Title</template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template lang="pug">h1(:is="customTitle") Title</template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template lang="pug">svg: TheComponent</template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template lang="pug">text</template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template lang="pug">circle(cx="0" cy="0" :d="radius")</template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },

    // kebab-case
    {
      code: '<template lang="pug">the-component</template>',
      options: ['kebab-case', { registeredComponentsOnly: false }]
    },
    {
      code: '<template lang="pug">div</template>',
      options: ['kebab-case', { registeredComponentsOnly: false }]
    },
    {
      code: '<template lang="pug">img</template>',
      options: ['kebab-case', { registeredComponentsOnly: false }]
    },
    {
      code: '<template lang="pug">svg: path</template>',
      options: ['kebab-case', { registeredComponentsOnly: false }]
    },
    {
      code: '<template lang="pug">math: mspace</template>',
      options: ['kebab-case', { registeredComponentsOnly: false }]
    },

    // ignores
    {
      code: '<template lang="pug">custom-element</template>',
      options: ['PascalCase', { ignores: ['custom-element'], registeredComponentsOnly: false }]
    },
    {
      code: '<template lang="pug">custom-element: TheComponent</template>',
      options: ['PascalCase', { ignores: ['custom-element'], registeredComponentsOnly: false }]
    },
    // regexp ignores
    {
      code: `<template lang="pug">
global-button
globalCard
global-grid
</template>`,
      filename: 'test.vue',
      options: ['PascalCase', { registeredComponentsOnly: false, ignores: ['/^global/'] }]
    }
  ],
  invalid: [
    {
      code: `<template lang="pug">
//- ✗ BAD
cool-component
coolComponent
Cool-component
</template>
<script>
export default {
  components: {
    CoolComponent
  }
}
</script>`,
      filename: 'test.vue',
      output: `<template lang="pug">
//- ✗ BAD
CoolComponent
CoolComponent
CoolComponent
</template>
<script>
export default {
  components: {
    CoolComponent
  }
}
</script>`,
      errors: [
        {
          message: 'Component name "cool-component" is not PascalCase.',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 26
        },
        {
          message: 'Component name "coolComponent" is not PascalCase.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 25
        },
        {
          message: 'Component name "Cool-component" is not PascalCase.',
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 26
        }
      ]
    },
    {
      code: `<template lang="pug">
//- ✗ BAD
CoolComponent
coolComponent
Cool-component
</template>
<script>
export default {
  components: {
    CoolComponent
  }
}
</script>`,
      filename: 'test.vue',
      options: ['kebab-case'],
      output: `<template lang="pug">
//- ✗ BAD
cool-component
cool-component
cool-component
</template>
<script>
export default {
  components: {
    CoolComponent
  }
}
</script>`,
      errors: [
        {
          message: 'Component name "CoolComponent" is not kebab-case.',
          line: 4
        },
        {
          message: 'Component name "coolComponent" is not kebab-case.',
          line: 5
        },
        {
          message: 'Component name "Cool-component" is not kebab-case.',
          line: 6
        }
      ]
    },
    {
      code: `<template lang="pug">
svg
  the-component
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      filename: 'test.vue',
      options: ['PascalCase'],
      output: `<template lang="pug">
svg
  TheComponent
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `<template lang="pug">
the-component(id="id")
  //- comment
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      filename: 'test.vue',
      options: ['PascalCase'],
      output: `<template lang="pug">
TheComponent(id="id")
  //- comment
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `<template lang="pug">
the-component(:is="componentName")
  content
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      filename: 'test.vue',
      options: ['PascalCase'],
      output: `<template lang="pug">
TheComponent(:is="componentName")
  content
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `<template lang="pug">
the-component(id="id")
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      filename: 'test.vue',
      options: ['PascalCase'],
      output: `<template lang="pug">
TheComponent(id="id")
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `<template lang="pug">
TheComponent(id="id")
  //- comment
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      filename: 'test.vue',
      options: ['kebab-case'],
      output: `<template lang="pug">
the-component(id="id")
  //- comment
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      errors: ['Component name "TheComponent" is not kebab-case.']
    },
    {
      code: `<template lang="pug">
TheComponent(id="id")
</template>`,
      options: ['kebab-case', { registeredComponentsOnly: false }],
      output: `<template lang="pug">
the-component(id="id")
</template>`,
      errors: ['Component name "TheComponent" is not kebab-case.']
    },
    {
      code: `<template lang="pug">
the-component(
  id="id"
)
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      filename: 'test.vue',
      options: ['PascalCase'],
      output: `<template lang="pug">
TheComponent(
  id="id"
)
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `<template lang="pug">
the-component
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      filename: 'test.vue',
      options: ['PascalCase'],
      output: `<template lang="pug">
TheComponent
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `<template lang="pug">
the-component
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      filename: 'test.vue',
      options: ['PascalCase'],
      output: `<template lang="pug">
TheComponent
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `<template lang="pug">
theComponent
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      filename: 'test.vue',
      options: ['PascalCase'],
      output: `<template lang="pug">
TheComponent
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      errors: ['Component name "theComponent" is not PascalCase.']
    },
    {
      code: `<template lang="pug">
theComponent
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      filename: 'test.vue',
      options: ['kebab-case'],
      output: `<template lang="pug">
the-component
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      errors: ['Component name "theComponent" is not kebab-case.']
    },
    {
      code: `<template lang="pug">
The-component
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      filename: 'test.vue',
      options: ['PascalCase'],
      output: `<template lang="pug">
TheComponent
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      errors: ['Component name "The-component" is not PascalCase.']
    },
    {
      code: `<template lang="pug">
The-component
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      filename: 'test.vue',
      options: ['kebab-case'],
      output: `<template lang="pug">
the-component
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      errors: ['Component name "The-component" is not kebab-case.']
    },
    {
      code: `<template lang="pug">
Thecomponent
</template>`,
      options: ['kebab-case', { registeredComponentsOnly: false }],
      output: `<template lang="pug">
thecomponent
</template>`,
      errors: ['Component name "Thecomponent" is not kebab-case.']
    },
    {
      code: `<template lang="pug">
the-component
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      filename: 'test.vue',
      options: ['PascalCase'],
      output: `<template lang="pug">
TheComponent
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `<template lang="pug">
the-component
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      filename: 'test.vue',
      options: ['PascalCase'],
      output: `<template lang="pug">
TheComponent
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `<template lang="pug">
the-component
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      filename: 'test.vue',
      options: ['PascalCase'],
      output: `<template lang="pug">
TheComponent
</template>
<script>
export default {
  components: {TheComponent}
}
</script>`,
      errors: ['Component name "the-component" is not PascalCase.']
    },

    // ignores
    {
      code: `<template lang="pug">
custom-element1
  the-component
custom-element2
the-component
</template>`,
      output: `<template lang="pug">
custom-element1
  TheComponent
custom-element2
TheComponent
</template>`,
      options: [
        'PascalCase',
        {
          ignores: ['custom-element1', 'custom-element2'],
          registeredComponentsOnly: false
        }
      ],
      errors: ['Component name "the-component" is not PascalCase.', 'Component name "the-component" is not PascalCase.']
    },
    {
      code: `<template lang="pug">
custom-element1
  the-component
custom-element2
the-component
</template>`,
      output: `<template lang="pug">
custom-element1
  TheComponent
custom-element2
TheComponent
</template>`,
      options: [
        'PascalCase',
        {
          ignores: ['/^custom-element/'],
          registeredComponentsOnly: false
        }
      ],
      errors: ['Component name "the-component" is not PascalCase.', 'Component name "the-component" is not PascalCase.']
    },
    {
      code: `<template lang="pug">
foo--bar
Foo--Bar
FooBar
FooBar_Baz-qux
</template>`,
      output: `<template lang="pug">
foo--bar
Foo--Bar
foo-bar
foo-bar-baz-qux
</template>`,
      options: [
        'kebab-case',
        {
          registeredComponentsOnly: false
        }
      ],
      errors: [
        'Component name "foo--bar" is not kebab-case.',
        'Component name "Foo--Bar" is not kebab-case.',
        'Component name "FooBar" is not kebab-case.',
        'Component name "FooBar_Baz-qux" is not kebab-case.'
      ]
    }
  ]
});
