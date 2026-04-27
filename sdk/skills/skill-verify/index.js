'use strict';

module.exports = {
  on_install:   require('./scripts/on_install.js'),
  on_first_run: require('./scripts/on_first_run.js'),
  on_verify:    require('./scripts/on_verify.js'),
  on_wake:      require('./scripts/on_wake.js'),
};
