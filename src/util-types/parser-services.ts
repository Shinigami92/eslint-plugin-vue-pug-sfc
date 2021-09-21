import { Rule, SourceCode } from 'eslint';
import { ParamNode, VDocumentFragment, VNodeListenerMap } from './ast';
import { HasLocation, Token } from './node';

export type TemplateListenerBase = {
  [T in keyof VNodeListenerMap]?: (node: VNodeListenerMap[T]) => void;
};
export type TemplateListener = TemplateListenerBase &
  Rule.NodeListener & { [key: string]: ((node: ParamNode) => void) | undefined };

export interface ParserServices {
  getTemplateBodyTokenStore: () => ParserServices.TokenStore;
  defineTemplateBodyVisitor?: (
    templateBodyVisitor: TemplateListener,
    scriptVisitor?: Rule.RuleListener,
    options?: {
      templateBodyTriggerSelector: 'Program' | 'Program:exit';
    }
  ) => Rule.RuleListener;
  defineDocumentVisitor?: (
    documentVisitor: TemplateListener,
    options?: {
      triggerSelector: 'Program' | 'Program:exit';
    }
  ) => Rule.RuleListener;
  getDocumentFragment?: () => VDocumentFragment | null;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ParserServices {
  export interface TokenStore {
    getTokenByRangeStart(offset: number, options?: { includeComments: boolean }): Token | null;
    getFirstToken(node: HasLocation): Token;
    getFirstToken(node: HasLocation, options: number): Token;
    getFirstToken(node: HasLocation, options: SourceCode.UnaryNodeCursorWithSkipOptions): Token | null;
    getLastToken(node: HasLocation): Token;
    getLastToken(node: HasLocation, options: number): Token;
    getLastToken(node: HasLocation, options: SourceCode.UnaryNodeCursorWithSkipOptions): Token | null;
    getTokenBefore(node: HasLocation): Token;
    getTokenBefore(node: HasLocation, options: number): Token;
    getTokenBefore(node: HasLocation, options: { includeComments: boolean }): Token;
    getTokenBefore(node: HasLocation, options: SourceCode.UnaryCursorWithSkipOptions): Token | null;
    getTokenAfter(node: HasLocation): Token;
    getTokenAfter(node: HasLocation, options: number): Token;
    getTokenAfter(node: HasLocation, options: { includeComments: boolean }): Token;
    getTokenAfter(node: HasLocation, options: SourceCode.UnaryCursorWithSkipOptions): Token | null;
    getFirstTokenBetween(
      left: HasLocation,
      right: HasLocation,
      options?: SourceCode.BinaryCursorWithSkipOptions
    ): Token | null;
    getLastTokenBetween(
      left: HasLocation,
      right: HasLocation,
      options?: SourceCode.BinaryCursorWithSkipOptions
    ): Token | null;
    getTokenOrCommentBefore(node: HasLocation, skip?: number): Token | null;
    getTokenOrCommentAfter(node: HasLocation, skip?: number): Token | null;
    getFirstTokens(node: HasLocation, options?: SourceCode.UnaryNodeCursorWithCountOptions): Token[];
    getLastTokens(node: HasLocation, options?: SourceCode.UnaryNodeCursorWithCountOptions): Token[];
    getTokensBefore(node: HasLocation, options?: SourceCode.UnaryCursorWithCountOptions): Token[];
    getTokensAfter(node: HasLocation, options?: SourceCode.UnaryCursorWithCountOptions): Token[];
    getFirstTokensBetween(
      left: HasLocation,
      right: HasLocation,
      options?: SourceCode.BinaryCursorWithCountOptions
    ): Token[];
    getLastTokensBetween(
      left: HasLocation,
      right: HasLocation,
      options?: SourceCode.BinaryCursorWithCountOptions
    ): Token[];
    getTokens(
      node: HasLocation,
      beforeCount?: SourceCode.UnaryNodeCursorWithCountOptions,
      afterCount?: number
    ): Token[];
    getTokensBetween(left: HasLocation, right: HasLocation, padding?: SourceCode.BinaryCursorWithCountOptions): Token[];
    commentsExistBetween(left: HasLocation, right: HasLocation): boolean;
    getCommentsBefore(nodeOrToken: HasLocation): Token[];
    getCommentsAfter(nodeOrToken: HasLocation): Token[];
    getCommentsInside(node: HasLocation): Token[];
  }
}
