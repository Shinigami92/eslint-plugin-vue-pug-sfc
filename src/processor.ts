import type { Linter } from 'eslint';

export default {
  preprocess(text, filename) {
    console.log('preprocess', text, filename);

    return [text];
  },
  postprocess(messages, filename) {
    console.log('postprocess', messages, filename);

    return [];
  }
} as Linter.Processor;
