import { RuleTester } from 'eslint';
import rule from '../../src/rules/this-in-template';

const ruleTester: RuleTester = new RuleTester();

ruleTester.run('this-in-template', rule, {
  valid: ['', '<template lang="pug"></template>', '<template lang="pug"><div></div></template>'],
  invalid: []
});
