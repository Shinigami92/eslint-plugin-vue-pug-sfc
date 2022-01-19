import processor from './processor';
import rules from './rules';

export = {
  rules,
  configs: {
    base: require('./configs/base'),
    essential: require('./configs/essential'),
    recommended: require('./configs/recommended'),
    'strongly-recommended': require('./configs/strongly-recommended'),
    'vue3-essential': require('./configs/vue3-essential'),
    'vue3-recommended': require('./configs/vue3-recommended'),
    'vue3-strongly-recommended': require('./configs/vue3-strongly-recommended'),
  },
  processors: {
    '.vue': processor,
  },
};
