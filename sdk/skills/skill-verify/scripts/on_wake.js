'use strict';

const ADVERTISE_REFRESH_MS = 5 * 60 * 1000;

module.exports = async function on_wake(context) {
  const seal = await context.agent.getSeal();
  if (!seal || !seal.seal_code) return;

  const lastRefresh = (await context.storage.get('last_advertise_refresh')) || 0;
  if (Date.now() - lastRefresh < ADVERTISE_REFRESH_MS) return;

  const status = await context.agent.getStatus();
  if (status === 'REVOGADO' || status === 'SUSPENSO') {
    await context.ble.stopAdvertise();
    context.log.info(`skill-verify: stopped advertising (status=${status})`);
    return;
  }

  await context.ble.startAdvertise({ payload: seal.seal_code, intervalMs: 200 });
  await context.storage.set('last_advertise_refresh', Date.now());
};
