'use strict';

const assert = require('assert');
const skill = require('../index.js');
const calculateTier = skill._calculateTier;

function makeStub() {
  const store = new Map();
  const emitted = [];
  const notifications = [];
  return {
    storage: {
      get: async (k) => store.get(k),
      set: async (k, v) => { store.set(k, v); },
    },
    log: { info: () => {}, warn: () => {}, error: () => {} },
    agent: {
      getSeal: async () => ({ seal_code: 'OBAG-TEST00-AAAA-Z9', issued_at: '2025-01-01T00:00:00Z' }),
    },
    notifications: { send: async (n) => { notifications.push(n); } },
    bus: { emit: async (type, payload) => { emitted.push({ type, payload }); } },
    _store: store,
    _emitted: emitted,
    _notifications: notifications,
  };
}

(async () => {
  // calculateTier — pure function tests
  assert.strictEqual(calculateTier({ age_days: 0, score: 0, upheld_reports: 0 }), 'BRONZE');
  assert.strictEqual(calculateTier({ age_days: 200, score: 1500, upheld_reports: 1 }), 'PRATA');
  assert.strictEqual(calculateTier({ age_days: 400, score: 6000, upheld_reports: 3 }), 'OURO');
  assert.strictEqual(calculateTier({ age_days: 800, score: 20000, upheld_reports: 5 }), 'DIAMANTE');

  // recent_negatives caps tier at BRONZE
  assert.strictEqual(
    calculateTier({ age_days: 800, score: 20000, upheld_reports: 5, recent_negatives: 3 }),
    'BRONZE'
  );

  // on_install initialises storage
  const ctx = makeStub();
  await skill.on_install(ctx);
  assert.strictEqual(await ctx.storage.get('current_tier'), 'BRONZE');
  assert.strictEqual(await ctx.storage.get('score'), 0);

  // on_wake recalculates and emits tier.changed when promoting
  await skill.on_first_run(ctx);
  await ctx.storage.set('seal_issued_at', new Date(Date.now() - 200 * 86400000).toISOString());
  await ctx.storage.set('score', 1500);
  await ctx.storage.set('upheld_reports', 1);
  await ctx.storage.set('last_recalc_ts', 0); // force recalc
  await skill.on_wake(ctx);

  assert.strictEqual(await ctx.storage.get('current_tier'), 'PRATA');
  assert.ok(ctx._emitted.find((e) => e.type === 'tier.changed' && e.payload.current === 'PRATA'),
    'tier.changed should be emitted on promotion');

  // on_tier_change records history and sends notification
  await skill.on_tier_change(ctx, { previous: 'PRATA', current: 'OURO' });
  const history = await ctx.storage.get('tier_history');
  assert.strictEqual(history.length, 1);
  assert.strictEqual(history[0].current, 'OURO');
  assert.ok(ctx._notifications.length > 0, 'notification should be sent on tier change');

  // on_wake idempotency: second call within window does nothing
  ctx._emitted.length = 0;
  await skill.on_wake(ctx);
  assert.strictEqual(ctx._emitted.length, 0);

  console.log('skill-rep: all tests passed');
})().catch((err) => { console.error(err); process.exit(1); });
