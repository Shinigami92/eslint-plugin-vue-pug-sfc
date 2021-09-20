import processor from './processor';
import rules from './rules';

export = {
  rules,
  configs: {
    base: require('./configs/base'),
    essential: require('./configs/essential'),
    recommended: require('./configs/recommended'),
    'strongly-recommended': require('./configs/strongly-recommended')
  },
  processors: {
    '.vue': processor
  }
};
