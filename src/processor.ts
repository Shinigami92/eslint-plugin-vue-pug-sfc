import type { Linter } from 'eslint';

export default {
  // preprocess(text, filename) {
  //   // console.log('preprocess', text, filename);
  //   return [text];
  // },
  postprocess(messages, filename) {
    const filteredMessages: Linter.LintMessage[] =
      messages[0]?.filter((message) => message.ruleId?.startsWith('vue-pug-sfc/')) ?? [];

    return [...filteredMessages];
  },
  supportsAutofix: true
} as Linter.Processor;
