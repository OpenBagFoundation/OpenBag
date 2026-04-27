'use strict';

const assert = require('assert');
const skill = require('../index.js');

function makeStub() {
  const store = new Map();
  return {
    storage: {
      get: async (k) => store.get(k),
      set: async (k, v) => { store.set(k, v); },
    },
    log: { info: () => {}, warn: () => {}, error: () => {} },
    agent: {
      getSeal:      async () => ({ seal_code: 'OBAG-TEST00-AAAA-Z9', full_name: 'Test Worker', issued_at: '2026-04-01T00:00:00Z', expires_at: '2027-04-01T00:00:00Z' }),
      getTier:      async () => 'PRATA',
      getPlatforms: async () => ['IFOOD', 'RAPPI'],
      getStatus:    async () => 'ATIVO',
    },
    ble: {
      startAdvertise: async () => {},
      stopAdvertise:  async () => {},
    },
    notifications: { send: async () => {} },
    _store: store,
  };
}

(async () => {
  const ctx = makeStub();

  // on_install initialises storage
  await skill.on_install(ctx);
  assert.strictEqual(await ctx.storage.get('verify_count'), 0);
  assert.ok(await ctx.storage.get('install_ts'));

  // on_verify returns the right shape and increments counter
  const r = await skill.on_verify(ctx, { verifier_type: 'CITIZEN' });
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.seal_code, 'OBAG-TEST00-AAAA-Z9');
  assert.strictEqual(r.masked_name, 'T*** W***');
  assert.strictEqual(r.status, 'ATIVO');
  assert.strictEqual(r.tier, 'PRATA');
  assert.deepStrictEqual(r.platforms, ['IFOOD', 'RAPPI']);
  assert.strictEqual(await ctx.storage.get('verify_count'), 1);

  // on_verify handles missing seal gracefully
  const ctx2 = makeStub();
  ctx2.agent.getSeal = async () => null;
  await skill.on_install(ctx2);
  const r2 = await skill.on_verify(ctx2, {});
  assert.strictEqual(r2.ok, false);
  assert.strictEqual(r2.error, 'no_active_seal');

  // on_wake stops advertising on REVOGADO
  const ctx3 = makeStub();
  let stopped = false;
  ctx3.ble.stopAdvertise = async () => { stopped = true; };
  ctx3.agent.getStatus = async () => 'REVOGADO';
  await skill.on_wake(ctx3);
  assert.strictEqual(stopped, true);

  console.log('skill-verify: all tests passed');
})().catch((err) => { console.error(err); process.exit(1); });
