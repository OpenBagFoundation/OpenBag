'use strict';

module.exports = async function on_install(context) {
  await context.storage.set('reports_submitted', 0);
  await context.storage.set('reports_pending', []);
  await context.storage.set('install_ts', Date.now());
  context.log.info('skill-sentinel installed (anonymous mode)');
};
