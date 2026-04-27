'use strict';

module.exports = async function on_first_run(context) {
  const seal = await context.agent.getSeal();
  if (seal && seal.issued_at) {
    await context.storage.set('seal_issued_at', seal.issued_at);
  }
  await context.storage.set('first_run_ts', Date.now());
  context.log.info('skill-rep: first run completed');
};
