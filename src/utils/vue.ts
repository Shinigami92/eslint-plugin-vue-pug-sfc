// Copy of https://github.com/prettier/plugin-pug/blob/main/src/utils/vue.ts

import { Rule, SourceCode } from 'eslint';
import type { AttributeToken } from 'pug-lexer';
import {
  AssignmentProperty,
  ASTNode,
  CallExpression,
  Declaration,
  ESNode,
  Expression,
  Identifier,
  Literal,
  MemberExpression,
  MethodDefinition,
  NewExpression,
  ObjectExpression,
  PrivateIdentifier,
  Property,
  SpreadElement,
  Super,
  TemplateLiteral,
  TSAsExpression,
  VAttribute,
  VDirective,
  VDocumentFragment,
  VElement,
  VExpressionContainer,
  VText
} from '../util-types/ast';
import { Token } from '../util-types/node';
import { ParserServices, TemplateListener } from '../util-types/parser-services';
import { VueObjectType } from '../util-types/utils';

/**
 * Indicates whether the attribute name is a Vue event binding.
 *
 * ---
 *
 * Example event binding:
 * ```
 * v-btn(@click="doSomething") Do Something
 * ```
 *
 * In this case `name` is `@click`.
 *
 * ---
 *
 * Checks for: `v-on:`.
 *
 * Also shorthands like `@*` are checked.
 *
 * ---
 *
 * @param name Name of tag attribute.
 * @returns `true` if `name` passes the vue event binding check, otherwise `false`.
 */
export function isVueEventBinding(name: string): boolean {
  return /^(v-on:|@).*/.test(name);
}

/**
 * Indicates whether the attribute name is a Vue expression.
 *
 * ---
 *
 * Example expression:
 * ```
 * v-text-field(v-model="value", :label="label") Do Something
 * ```
 *
 * In this case `name` is `v-model` and `:label`.
 *
 * ---
 *
 * Checks for: `v-bind`, `v-slot`, `v-model`, `v-if`, `v-else-if`, `v-for`,
 * `v-text` and `v-html`.
 *
 * Also shorthands like `:*` are checked.
 *
 * ---
 *
 * @param name Name of tag attribute.
 * @returns `true` if `name` passes the vue expression check, otherwise `false`.
 */
export function isVueExpression(name: string): boolean {
  return /^((v-(bind|slot))?:|v-(model|slot|if|for|else-if|text|html)|#).*/.test(name);
}

/**
 * Indicates whether the attribute name is a Vue v-for and includes a `of`.
 *
 * ---
 *
 * Example expression:
 * ```
 * tr(v-for="item of items", :key="item.id")
 * ```
 *
 * In this case `name` is `v-for` and it includes a `of`.
 *
 * ---
 *
 * Checks for: `v-for` and `of`.
 *
 * ---
 *
 * @param name Name of tag attribute.
 * @param val Value of tag attribute.
 * @returns `true` if `name` and `val` passes the vue `v-for` with `of` check, otherwise `false`.
 */
export function isVueVForWithOf(name: string, val: string): boolean {
  return 'v-for' === name && val.includes('of');
}

/**
 * Indicates whether the attribute name is a Vue v-bind.
 *
 * ---
 *
 * Example expression:
 * ```
 * v-btn(v-bind="$attrs")
 * ```
 *
 * In this case `name` is `v-bind`.
 *
 * ---
 *
 * Checks for: `v-bind`.
 *
 * ---
 *
 * @param name Name of tag attribute.
 * @returns `true` if `name` passes the vue `v-bind` check, otherwise `false`.
 */
export function isVueVBindExpression(name: string): boolean {
  return 'v-bind' === name;
}

/**
 * Indicates whether the attribute name is a Vue v-on.
 *
 * ---
 *
 * Example expression:
 * ```
 * v-btn(v-on="on")
 * ```
 *
 * In this case `name` is `v-on`.
 *
 * ---
 *
 * Checks for: `v-on`.
 *
 * ---
 *
 * @param name Name of tag attribute.
 * @returns `true` if `name` passes the vue `v-on` check, otherwise `false`.
 */
export function isVueVOnExpression(name: string): boolean {
  return 'v-on' === name;
}

export function isVueBinding(token: AttributeToken): boolean {
  return (
    isVueExpression(token.name) ||
    isVueEventBinding(token.name) ||
    (typeof token.val === 'string' && isVueVForWithOf(token.name, token.val)) ||
    isVueVBindExpression(token.name) ||
    isVueVOnExpression(token.name)
  );
}

// ---------------------------------------------------------------------------

/**
 * Gets the parent node of the given node. This method returns a value ignoring `X as F`.
 */
export function getParent(node: Expression): ASTNode {
  let parent: ASTNode = node.parent;
  while (parent.type === 'TSAsExpression') {
    parent = parent.parent;
  }
  return parent;
}

export function isVueFile(path: string): boolean {
  return path.endsWith('.vue') || path.endsWith('.jsx');
}

/**
 * Check whether the given node is a Vue component based
 * on the filename and default export type
 * `export default {}` in `.vue || .jsx`.
 *
 * @param node Node to check.
 * @param path File name with extension.
 */
export function isVueComponentFile(node: ESNode, path: string): boolean {
  return isVueFile(path) && node.type === 'ExportDefaultDeclaration' && node.declaration.type === 'ObjectExpression';
}

/**
 * Retrieve `TSAsExpression#expression` value if the given node a `TSAsExpression` node. Otherwise, pass through it.
 *
 * @param node The node to address.
 * @returns The `TSAsExpression#expression` value if the node is a `TSAsExpression` node. Otherwise, the node.
 */
export function skipTSAsExpression<T extends Expression | Super | SpreadElement | Declaration>(
  node: T | TSAsExpression
): T {
  if (!node) {
    return node;
  }

  if (node.type === 'TSAsExpression') {
    // @ts-expect-error
    return skipTSAsExpression(node.expression);
  }

  return node;
}

/**
 * Checks whether the given node is VElement.
 */
export function isVElement(node: VElement | VExpressionContainer | VText): node is VElement {
  return node.type === 'VElement';
}

/**
 * Get the attribute which has the given name.
 *
 * @param node The start tag node to check.
 * @param name The attribute name to check.
 * @param value The attribute value to check.
 * @returns The found attribute.
 */
export function getAttribute(node: VElement, name: string, value?: string): VAttribute | VDirective | null {
  return (
    node.startTag.attributes.find((node) => {
      return (
        !node.directive &&
        node.key.name === name &&
        (value === undefined || (node.value != null && node.value.value === value))
      );
    }) ?? null
  );
}

/**
 * Check whether the given start tag has specific directive.
 *
 * @param node The start tag node to check.
 * @param name The attribute name to check.
 * @param value The attribute value to check.
 * @returns `true` if the start tag has the attribute.
 */
export function hasAttribute(node: VElement, name: string, value?: string): boolean {
  return Boolean(getAttribute(node, name, value));
}

/**
 * Gets the element of `<script setup>`.
 *
 * @param context The ESLint rule context object.
 * @returns The element of `<script setup>`.
 */
export function getScriptSetupElement(context: Rule.RuleContext): VElement | null {
  const parserServices: ParserServices = context.parserServices;
  const df: VDocumentFragment | null | undefined = parserServices.getDocumentFragment?.();
  if (!df) {
    return null;
  }

  const scripts: VElement[] = df.children.filter(isVElement).filter((e) => e.name === 'script');

  if (scripts.length === 2) {
    return scripts.find((e) => hasAttribute(e, 'setup')) ?? null;
  } else {
    const script: VElement | VExpressionContainer | VText | undefined = scripts[0];
    if (script && hasAttribute(script, 'setup')) {
      return script;
    }
  }

  return null;
}

/**
 * Gets the string of a given node.
 *
 * @param node The node to get.
 * @param stringOnly
 * @return The string if static. Otherwise, `null`.
 */
export function getStringLiteralValue(node: Literal | TemplateLiteral, stringOnly?: boolean): string | null {
  if (node.type === 'Literal') {
    if (node.value == null) {
      if (!stringOnly && node.bigint != null) {
        return node.bigint;
      }
      return null;
    }
    if (typeof node.value === 'string') {
      return node.value;
    }
    if (!stringOnly) {
      return String(node.value);
    }
    return null;
  }
  if (node.type === 'TemplateLiteral') {
    if (node.expressions.length === 0 && node.quasis.length === 1) {
      return node.quasis[0]!.value.cooked;
    }
  }
  return null;
}

/**
 * Gets the property name of a given node.
 *
 * @param node The node to get.
 * @return The property name if static. Otherwise, `null`.
 */
export function getStaticPropertyName(
  node: Property | AssignmentProperty | MethodDefinition | MemberExpression
): string | null {
  if (node.type === 'Property' || node.type === 'MethodDefinition') {
    if (!node.computed) {
      const key: Identifier | Literal | PrivateIdentifier = node.key;
      if (key.type === 'Identifier') {
        return key.name;
      }
    }
    const key: Expression | PrivateIdentifier = node.key;
    // @ts-expect-error
    return getStringLiteralValue(key);
  } else if (node.type === 'MemberExpression') {
    if (!node.computed) {
      const property: Identifier | PrivateIdentifier = node.property;
      if (property.type === 'Identifier') {
        return property.name;
      }
      return null;
    }
    const property: Expression = node.property;
    // @ts-expect-error
    return getStringLiteralValue(property);
  }
  return null;
}

/**
 * Get the Vue component definition type from given node
 * `Vue.component('xxx', {})` || `component('xxx', {})`
 *
 * @param node Node to check.
 */
function getVueComponentDefinitionType(
  node: ObjectExpression
): 'component' | 'mixin' | 'extend' | 'createApp' | 'defineComponent' | null {
  const parent: ASTNode = getParent(node);
  if (parent.type === 'CallExpression') {
    const callee: Expression | Super = parent.callee;

    if (callee.type === 'MemberExpression') {
      const calleeObject: Expression | Super = skipTSAsExpression(callee.object);

      if (calleeObject.type === 'Identifier') {
        const propName: string | null = getStaticPropertyName(callee);
        if (calleeObject.name === 'Vue') {
          // for Vue.js 2.x
          // Vue.component('xxx', {}) || Vue.mixin({}) || Vue.extend('xxx', {})
          const maybeFullVueComponentForVue2: boolean | '' | null = propName && isObjectArgument(parent);

          return maybeFullVueComponentForVue2 &&
            (propName === 'component' || propName === 'mixin' || propName === 'extend')
            ? propName
            : null;
        }

        // for Vue.js 3.x
        // app.component('xxx', {}) || app.mixin({})
        const maybeFullVueComponent: boolean | '' | null = propName && isObjectArgument(parent);

        return maybeFullVueComponent && (propName === 'component' || propName === 'mixin') ? propName : null;
      }
    }

    if (callee.type === 'Identifier') {
      if (callee.name === 'component') {
        // for Vue.js 2.x
        // component('xxx', {})
        const isDestructedVueComponent: boolean = isObjectArgument(parent);
        return isDestructedVueComponent ? 'component' : null;
      }
      if (callee.name === 'createApp') {
        // for Vue.js 3.x
        // createApp({})
        const isAppVueComponent: boolean = isObjectArgument(parent);
        return isAppVueComponent ? 'createApp' : null;
      }
      if (callee.name === 'defineComponent') {
        // for Vue.js 3.x
        // defineComponent({})
        const isDestructedVueComponent: boolean = isObjectArgument(parent);
        return isDestructedVueComponent ? 'defineComponent' : null;
      }
    }
  }

  return null;

  function isObjectArgument(node: CallExpression): boolean {
    return node.arguments.length > 0 && skipTSAsExpression(node.arguments.slice(-1)[0]!).type === 'ObjectExpression';
  }
}

/**
 * Check whether given node is new Vue instance
 * `new Vue({})`
 * @param {NewExpression} node Node to check
 */
export function isVueInstance(node: NewExpression): boolean {
  const callee: Expression = node.callee;
  return Boolean(
    node.type === 'NewExpression' &&
      callee.type === 'Identifier' &&
      callee.name === 'Vue' &&
      node.arguments.length &&
      skipTSAsExpression(node.arguments[0]!).type === 'ObjectExpression'
  );
}

const componentComments: WeakMap<Rule.RuleContext, Token[]> = new WeakMap();

/**
 * Gets the component comments of a given context.
 *
 * @param context The ESLint rule context object.
 * @return The the component comments.
 */
export function getComponentComments(context: Rule.RuleContext): Token[] | undefined {
  let tokens: Token[] | undefined = componentComments.get(context);
  if (tokens) {
    return tokens;
  }
  const sourceCode: SourceCode = context.getSourceCode();
  tokens = sourceCode.getAllComments().filter((comment) => /@vue\/component/g.test(comment.value)) as Token[];
  componentComments.set(context, tokens);
  return tokens;
}

/**
 * If the given object is a Vue component or instance, returns the Vue definition type.
 *
 * @param context The ESLint rule context object.
 * @param node Node to check.
 * @returns The Vue definition type.
 */
export function getVueObjectType(context: Rule.RuleContext, node: ObjectExpression): VueObjectType | null {
  if (node.type !== 'ObjectExpression') {
    return null;
  }
  const parent: ASTNode = getParent(node);
  if (parent.type === 'ExportDefaultDeclaration') {
    // export default {} in .vue || .jsx
    const filePath: string = context.getFilename();
    if (isVueComponentFile(parent, filePath) && skipTSAsExpression(parent.declaration) === node) {
      const scriptSetup: VElement | null = getScriptSetupElement(context);
      if (scriptSetup && scriptSetup.range[0] <= parent.range[0] && parent.range[1] <= scriptSetup.range[1]) {
        // `export default` in `<script setup>`
        return null;
      }
      return 'export';
    }
  } else if (parent.type === 'CallExpression') {
    // Vue.component('xxx', {}) || component('xxx', {})
    if (getVueComponentDefinitionType(node) != null && skipTSAsExpression(parent.arguments.slice(-1)[0]!) === node) {
      return 'definition';
    }
  } else if (parent.type === 'NewExpression') {
    // new Vue({})
    if (isVueInstance(parent) && skipTSAsExpression(parent.arguments[0]!) === node) {
      return 'instance';
    }
  }
  if (getComponentComments(context)?.some((el) => el.loc.end.line === node.loc.start.line - 1)) {
    return 'mark';
  }
  return null;
}

export function compositingVisitors<T>(visitor: T, ...visitors: Array<Rule.RuleListener | Rule.NodeListener>): T {
  for (const v of visitors) {
    for (const key in v) {
      // @ts-expect-error
      if (visitor[key]) {
        // @ts-expect-error
        const o: (...args: any[]) => void = visitor[key];
        // @ts-expect-error
        visitor[key] = (...args) => {
          o(...args);
          // @ts-expect-error
          v[key as keyof (Rule.RuleListener | Rule.NodeListener)](...args);
        };
      } else {
        // @ts-expect-error
        visitor[key] = v[key];
      }
    }
  }
  return visitor;
}

export function executeOnVueComponent(
  context: Rule.RuleContext,
  cb: (node: ObjectExpression, type: VueObjectType) => void
): TemplateListener {
  return {
    'ObjectExpression:exit'(node: ObjectExpression): void {
      const type: VueObjectType | null = getVueObjectType(context, node);
      if (!type || (type !== 'mark' && type !== 'export' && type !== 'definition')) {
        return;
      }
      cb(node, type);
    }
  };
}

/**
 * Check if current file is a Vue instance (new Vue) and call callback.
 *
 * @param context The ESLint rule context object.
 * @param cb Callback function.
 */
export function executeOnVueInstance(
  context: Rule.RuleContext,
  cb: (node: ObjectExpression, type: VueObjectType) => void
): TemplateListener {
  return {
    'ObjectExpression:exit'(node: ObjectExpression) {
      const type: VueObjectType | null = getVueObjectType(context, node);
      if (!type || type !== 'instance') {
        return;
      }
      cb(node, type);
    }
  };
}

export function executeOnVue(
  context: Rule.RuleContext,
  cb: (node: ObjectExpression, type: VueObjectType) => void
): TemplateListener {
  return compositingVisitors(executeOnVueComponent(context, cb), executeOnVueInstance(context, cb));
}

/**
 * Checks whether the given node is Property.
 */
export function isProperty(node: Property | SpreadElement | AssignmentProperty): node is Property {
  if (node.type !== 'Property') {
    return false;
  }
  return !node.parent || node.parent.type === 'ObjectExpression';
}

/**
 * Checks whether the given value is defined.
 */
export function isDef<T>(v: T): v is T {
  return v != null;
}

export function getRegisteredVueComponents(
  componentObject: ObjectExpression
): Array<{ node: Property; name: string } | null> {
  const componentsNode: Property | SpreadElement | undefined = componentObject.properties.find(
    (property) =>
      property.type === 'Property' &&
      getStaticPropertyName(property) === 'components' &&
      property.value.type === 'ObjectExpression'
  );

  if (!componentsNode || !('value' in componentsNode) || componentsNode.value.type !== 'ObjectExpression') {
    return [];
  }

  return componentsNode.value.properties
    .filter(isProperty)
    .map((node) => {
      const name: string | null = getStaticPropertyName(node);
      return name ? { node, name } : null;
    })
    .filter(isDef);
}
