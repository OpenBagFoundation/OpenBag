'use strict';

module.exports = {
  on_install: require('./scripts/on_install.js'),
  on_verify:  require('./scripts/on_verify.js'),
  submitReport: require('./scripts/submit_report.js'),
};
