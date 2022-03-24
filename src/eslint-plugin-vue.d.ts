declare module 'eslint-plugin-vue' {
  import type { Rule } from 'eslint';
  const plugin: {
    readonly rules: Record<string, Rule.RuleModule>;
  };
  export = plugin;
}
