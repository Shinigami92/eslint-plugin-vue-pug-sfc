import * as VAST from '../ast';
import { HasLocation } from './locations';

export interface BaseNode extends HasLocation {
  type: string;
  parent: VAST.ASTNode | null;
}

export interface HasParentNode extends BaseNode {
  parent: VAST.ASTNode;
}
