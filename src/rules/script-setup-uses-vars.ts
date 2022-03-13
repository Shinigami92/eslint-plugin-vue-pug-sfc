import type { Rule, Scope } from 'eslint';
import { processRule } from '../utils';
import { capitalize } from '../utils/casing';
import { isCustomComponent, isScriptSetup } from '../utils/vue';

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'prevent `<script setup>` variables used in `<template lang="pug">` to be marked as unused',
      categories: ['base'],
      url: 'https://eslint.vuejs.org/rules/script-setup-uses-vars.html',
    },
    schema: [],
  },
  create(context) {
    if (!isScriptSetup(context)) {
      return {};
    }
    const scriptVariableNames: Set<string> = new Set();
    const globalScope: Scope.Scope =
      context.getSourceCode().scopeManager.globalScope!;
    if (globalScope) {
      for (const variable of globalScope.variables) {
        scriptVariableNames.add(variable.name);
      }
      const moduleScope: Scope.Scope = globalScope.childScopes.find(
        (scope) => scope.type === 'module',
      )!;
      for (const variable of moduleScope?.variables || []) {
        scriptVariableNames.add(variable.name);
      }
    }

    /**
     * `casing.camelCase()` converts the beginning to lowercase,
     * but does not convert the case of the beginning character when converting with Vue3.
     * @see https://github.com/vuejs/vue-next/blob/2749c15170ad4913e6530a257db485d4e7ed2283/packages/shared/src/index.ts#L116
     * @param {string} str
     */
    function camelize(str: string): string {
      return str.replace(/-(\w)/g, (_, c) =>
        c ? (c as string).toUpperCase() : '',
      );
    }
    /**
     * @see https://github.com/vuejs/vue-next/blob/2749c15170ad4913e6530a257db485d4e7ed2283/packages/compiler-core/src/transforms/transformElement.ts#L333
     * @param {string} name
     */
    function markSetupReferenceVariableAsUsed(name: string): boolean {
      if (scriptVariableNames.has(name)) {
        console.log(name, scriptVariableNames.has(name))
        context.markVariableAsUsed(name);
        return true;
      }
      const camelName: string = camelize(name);
      if (scriptVariableNames.has(camelName)) {
        context.markVariableAsUsed(camelName);
        return true;
      }
      const pascalName: string = capitalize(camelName);
      if (scriptVariableNames.has(pascalName)) {
        context.markVariableAsUsed(pascalName);
        return true;
      }
      return false;
    }

    return processRule(context, () => {
      return {
        // mark components as used
        tag(token, { index, tokens }) {
          console.log(token);
          if (!isCustomComponent(token, tokens)) {
            return;
          }
          if (!markSetupReferenceVariableAsUsed(token.val)) {
            // Check namespace
            // https://github.com/vuejs/vue-next/blob/2749c15170ad4913e6530a257db485d4e7ed2283/packages/compiler-core/src/transforms/transformElement.ts#L304
            const dotIndex: number = token.val.indexOf('.');
            if (dotIndex > 0) {
              markSetupReferenceVariableAsUsed(token.val.slice(0, dotIndex));
            }
          }
        },
      };
    });
  },
} as Rule.RuleModule;
