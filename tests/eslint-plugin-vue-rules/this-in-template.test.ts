// Onetime generated from https://github.com/vuejs/eslint-plugin-vue/blob/8f094200664a2b10bc597016f5486066a174e098/tests/lib/rules/this-in-template.js

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import type { Rule } from 'eslint';
import { RuleTester } from 'eslint';
import * as vuePlugin from 'eslint-plugin-vue';

const rule: Rule.RuleModule = vuePlugin.rules['this-in-template']!;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    templateTokenizer: { pug: 'vue-eslint-parser-template-tokenizer-pug' },
  },
});

function createValidTests(
  prefix: string,
  options: string[],
): RuleTester.ValidTestCase[] {
  const comment: string = options.join('');
  return [
    {
      code: `<template lang="pug">div {{ ${prefix}foo.bar }}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div(v-for="foo in ${prefix}bar") {{ foo }}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div(v-if="${prefix}foo") {{ ${prefix}foo }}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div(:class="${prefix}foo") {{ ${prefix}foo }}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div(:class="{this: ${prefix}foo}") {{ ${prefix}foo }}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div(v-for="bar in ${prefix}foo", v-if="bar") {{ bar }}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div(v-if="${prefix}foo()") {{ ${prefix}bar }}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div(:parent="this")</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div(v-for="x of ${prefix}xs") {{this.x}}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div(v-for="x of ${prefix}xs") {{this.x()}}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div(v-for="x of ${prefix}xs") {{this.x.y()}}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div(v-for="x of ${prefix}xs") {{this.x['foo']}}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div(v-for="x of ${prefix}xs") {{this['x']}}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div {{ this.class }}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div {{ this['0'] }}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div {{ this['this'] }}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div {{ this['foo bar'] }}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">div {{ }}</template><!-- ${comment} -->`,
      options,
    },
    {
      code: `<template lang="pug">
div
  div(v-for="bar in ${prefix}foo", v-if="bar") {{ bar }}
  div(v-for="ssa in ${prefix}sss", v-if="ssa")
    div(v-for="ssf in ssa", v-if="ssa") {{ ssf }}
</template><!-- ${comment} -->`,
      options,
    },

    // We cannot use `.` in dynamic arguments because the right of the `.` becomes a modifier.
    {
      code: `<template lang="pug">div(v-on:[x]="1")</template><!-- ${comment} -->`,
      options,
    },
  ];
}

function createInvalidTests(
  prefix: string,
  options: string[],
  message: RuleTester.TestCaseError['message'],
  type: RuleTester.TestCaseError['type'],
): RuleTester.InvalidTestCase[] {
  const comment: string = options.join('');
  return [
    {
      code: `<template lang="pug">div {{ ${prefix}foo }}</template><!-- ${comment} -->`,
      output: `<template lang="pug">div {{ ${suggestionPrefix(
        prefix,
        options,
      )}foo }}</template><!-- ${comment} -->`,
      errors: [{ message, type }],
      options,
    },
    {
      code: `<template lang="pug">div {{ ${prefix}foo() }}</template><!-- ${comment} -->`,
      output: `<template lang="pug">div {{ ${suggestionPrefix(
        prefix,
        options,
      )}foo() }}</template><!-- ${comment} -->`,
      errors: [{ message, type }],
      options,
    },
    {
      code: `<template lang="pug">div {{ ${prefix}foo.bar() }}</template><!-- ${comment} -->`,
      output: `<template lang="pug">div {{ ${suggestionPrefix(
        prefix,
        options,
      )}foo.bar() }}</template><!-- ${comment} -->`,
      errors: [{ message, type }],
      options,
    },
    {
      code: `<template lang="pug">div(:class="${prefix}foo")</template><!-- ${comment} -->`,
      output: `<template lang="pug">div(:class="${suggestionPrefix(
        prefix,
        options,
      )}foo")</template><!-- ${comment} -->`,
      errors: [{ message, type }],
      options,
    },
    {
      code: `<template lang="pug">div(:class="{foo: ${prefix}foo}")</template><!-- ${comment} -->`,
      output: `<template lang="pug">div(:class="{foo: ${suggestionPrefix(
        prefix,
        options,
      )}foo}")</template><!-- ${comment} -->`,
      errors: [{ message, type }],
      options,
    },
    {
      code: `<template lang="pug">div(:class="{foo: ${prefix}foo()}")</template><!-- ${comment} -->`,
      output: `<template lang="pug">div(:class="{foo: ${suggestionPrefix(
        prefix,
        options,
      )}foo()}")</template><!-- ${comment} -->`,
      errors: [{ message, type }],
      options,
    },
    {
      code: `<template lang="pug">div(v-if="${prefix}foo")</template><!-- ${comment} -->`,
      output: `<template lang="pug">div(v-if="${suggestionPrefix(
        prefix,
        options,
      )}foo")</template><!-- ${comment} -->`,
      errors: [{ message, type }],
      options,
    },
    {
      code: `<template lang="pug">div(v-for="foo in ${prefix}bar")</template><!-- ${comment} -->`,
      output: `<template lang="pug">div(v-for="foo in ${suggestionPrefix(
        prefix,
        options,
      )}bar")</template><!-- ${comment} -->`,
      errors: [{ message, type }],
      options,
    },

    // We cannot use `.` in dynamic arguments because the right of the `.` becomes a modifier.
    // {
    //   code: `<template><div v-on:[${prefix}name]="1"></div></template><!-- ${comment} -->`,
    //   errors: [{ message, type }],
    //   options
    // }
  ].concat(
    options[0] === 'always'
      ? []
      : [
          {
            code: `<template lang="pug">div {{ this['xs'] }}</template><!-- ${comment} -->`,
            output: `<template lang="pug">div {{ xs }}</template><!-- ${comment} -->`,
            errors: [{ message, type }],
            options,
          },
          {
            code: `<template lang="pug">div {{ this['xs0AZ_foo'] }}</template><!-- ${comment} -->`,
            output: `<template lang="pug">div {{ xs0AZ_foo }}</template><!-- ${comment} -->`,
            errors: [{ message, type }],
            options,
          },
        ],
  );
}

ruleTester.run('this-in-template', rule, {
  valid: [
    '',
    '<template></template>',
    '<template><div></div></template>',
    ...createValidTests('', []),
    ...createValidTests('', ['never']),
    ...createValidTests('this.', ['always']),
    ...createValidTests('this?.', ['always']),
  ],
  invalid: [
    ...createInvalidTests(
      'this.',
      [],
      "Unexpected usage of 'this'.",
      'ThisExpression',
    ),
    ...createInvalidTests(
      'this?.',
      [],
      "Unexpected usage of 'this'.",
      'ThisExpression',
    ),
    ...createInvalidTests(
      'this.',
      ['never'],
      "Unexpected usage of 'this'.",
      'ThisExpression',
    ),
    ...createInvalidTests(
      'this?.',
      ['never'],
      "Unexpected usage of 'this'.",
      'ThisExpression',
    ),
    ...createInvalidTests('', ['always'], "Expected 'this'.", 'Identifier'),
    {
      code: '<template lang="pug">div(v-if="fn(this.$foo)")</template><!-- never -->',
      output:
        '<template lang="pug">div(v-if="fn($foo)")</template><!-- never -->',
      errors: ["Unexpected usage of 'this'."],
      options: ['never'],
    },
    {
      code: '<template lang="pug">div(:class="{ foo: this.$foo }")</template><!-- never -->',
      output:
        '<template lang="pug">div(:class="{ foo: $foo }")</template><!-- never -->',
      errors: ["Unexpected usage of 'this'."],
      options: ['never'],
    },
  ],
});

function suggestionPrefix(prefix: string, options: string[]): string {
  if (options[0] === 'always' && !['this.', 'this?.'].includes(prefix)) {
    return 'this.';
  } else {
    return '';
  }
}
