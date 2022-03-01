import type { Linter } from 'eslint';

export default {
  // preprocess(text, filename) {
  //   // console.log('preprocess', text, filename);
  //   return [text];
  // },
  postprocess(messages, filename) {
    // TODO: This filters messages for all plugins :(
    const filteredMessages: Linter.LintMessage[] =
      messages[0]?.filter(
        (message) => message.ruleId !== 'vue/comment-directive',
      ) ?? [];

    return [...filteredMessages];
  },
  supportsAutofix: true,
} as Linter.Processor;
