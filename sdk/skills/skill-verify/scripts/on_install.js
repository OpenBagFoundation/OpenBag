'use strict';

module.exports = async function on_install(context) {
  await context.storage.set('install_ts', Date.now());
  await context.storage.set('verify_count', 0);
  await context.storage.set('config', {
    ble_advertise: true,
    nfc_enabled: true,
    notify_on_verify: false,
  });
  context.log.info('skill-verify installed');
};
