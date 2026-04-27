'use strict';

module.exports = {
  on_install:     require('./scripts/on_install.js'),
  on_first_run:   require('./scripts/on_first_run.js'),
  on_wake:        require('./scripts/on_wake.js'),
  on_tier_change: require('./scripts/on_tier_change.js'),
  // Internal helper exposed for tests and the on_wake hook
  _calculateTier: require('./scripts/calculate_tier.js'),
};
