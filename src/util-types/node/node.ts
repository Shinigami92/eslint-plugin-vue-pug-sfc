import type { ASTNode } from '../ast';
import type { HasLocation } from './locations';

export interface BaseNode extends HasLocation {
  type: string;
  parent: ASTNode | null;
}

export interface HasParentNode extends BaseNode {
  parent: ASTNode;
}
