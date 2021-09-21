export interface SpreadElement /*extends HasParentNode*/ {
  type: 'SpreadElement';
  // argument: Expression
}

export interface BaseProperty /*extends HasParentNode */ {
  type: 'Property';
  kind: 'init' | 'get' | 'set';
  method: boolean;
  shorthand: boolean;
  // computed: boolean
  // key: Expression
  // value: Expression;
  parent: ObjectExpression;
}
export interface PropertyNonComputedName extends BaseProperty {
  computed: false;
  // key: Identifier | Literal;
}
export interface PropertyComputedName extends BaseProperty {
  computed: true;
  // key: Expression;
}

export type Property = PropertyNonComputedName | PropertyComputedName;

export interface ObjectExpression /*extends HasParentNode*/ {
  type: 'ObjectExpression';
  properties: (Property | SpreadElement)[];
}
