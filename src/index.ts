import type { Linter } from 'eslint';
import rules from './rules';

export = {
  rules,
  processors: {
    vue: {
      preprocess(text, filename) {
        console.log('preprocess', text, filename);

        return [
          { text: 'code1', filename: '0.js' },
          { text: 'code2', filename: '1.js' }
        ];
      },
      postprocess(messages, filename) {
        console.log('postprocess', messages, filename);

        return [];
      }
    } as Linter.Processor
  }
};
