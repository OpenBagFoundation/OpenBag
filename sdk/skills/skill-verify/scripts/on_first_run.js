'use strict';

module.exports = async function on_first_run(context) {
  const seal = await context.agent.getSeal();
  if (!seal || !seal.seal_code) {
    context.log.warn('No active seal found at first_run; skipping advertise.');
    return;
  }
  await context.ble.startAdvertise({ payload: seal.seal_code, intervalMs: 200 });
  context.log.info(`skill-verify: now advertising seal ${seal.seal_code}`);
};
