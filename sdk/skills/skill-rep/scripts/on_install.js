'use strict';

module.exports = async function on_install(context) {
  await context.storage.set('current_tier', 'BRONZE');
  await context.storage.set('score', 0);
  await context.storage.set('upheld_reports', 0);
  await context.storage.set('recent_negatives', 0);
  await context.storage.set('events', []);
  await context.storage.set('install_ts', Date.now());
  context.log.info('skill-rep installed at BRONZE tier');
};
