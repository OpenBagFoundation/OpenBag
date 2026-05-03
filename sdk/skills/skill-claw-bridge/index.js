'use strict';

module.exports = {
  onInstall: require('./scripts/on_install.js'),
  onFirstRun: require('./scripts/on_first_run.js'),
  onWake: require('./scripts/on_wake.js'),
  onTierChange: require('./scripts/on_tier_change.js'),
};
