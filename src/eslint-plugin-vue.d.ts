declare module 'eslint-plugin-vue' {
  import type { Rule } from 'eslint';
  const plugin: {
    readonly rules: Record<string, Rule.RuleModule>;
  };
  export = plugin;
}

declare module 'eslint-plugin-vue/lib/utils';
declare module 'eslint-plugin-vue/lib/utils/casing';
declare module 'eslint-plugin-vue/lib/utils/regexp';
