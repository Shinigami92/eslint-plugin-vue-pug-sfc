import base from './configs/base';
import essential from './configs/essential';
import recommended from './configs/recommended';
import stronglyRecommended from './configs/strongly-recommended';
import processor from './processor';
import rules from './rules';

export = {
  rules,
  configs: {
    base,
    essential,
    recommended,
    'strongly-recommended': stronglyRecommended
  },
  processors: {
    '.vue': processor
  }
};
