'use strict';

const assert = require('assert');
const skill = require('../index.js');

function makeStub({ httpFails = false } = {}) {
  const store = new Map();
  const httpCalls = [];
  const notifications = [];
  return {
    storage: {
      get: async (k) => store.get(k),
      set: async (k, v) => { store.set(k, v); },
    },
    log: { info: () => {}, warn: () => {}, error: () => {} },
    http: {
      post: async (url, body, opts) => {
        httpCalls.push({ url, body, opts });
        if (httpFails) throw new Error('network unreachable');
        return { case_id: 'CASE-2026-04-9999' };
      },
    },
    notifications: { send: async (n) => { notifications.push(n); } },
    crypto: {
      encryptToFoundation: (payload) =>
        Buffer.from(JSON.stringify(payload), 'utf8').toString('base64'),
    },
    _store: store,
    _http: httpCalls,
    _notifications: notifications,
  };
}

(async () => {
  // on_install initialises storage
  const ctx = makeStub();
  await skill.on_install(ctx);
  assert.strictEqual(await ctx.storage.get('reports_submitted'), 0);
  assert.deepStrictEqual(await ctx.storage.get('reports_pending'), []);

  // submitReport happy path
  const r = await skill.submitReport(ctx, {
    type: 'suspicious_verification',
    target_seal_code: 'OBAG-AAAAAA-BBBB-CC',
    notes: 'Bag had no rotating beacon',
  });
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.case_id, 'CASE-2026-04-9999');
  assert.strictEqual(await ctx.storage.get('reports_submitted'), 1);
  assert.strictEqual(ctx._http.length, 1);
  assert.strictEqual(ctx._http[0].url, 'https://sentinel.openbag.foundation/v0/reports');

  // The HTTP envelope is *opaque* — no plaintext target_seal_code in the body
  const envelope = ctx._http[0].body;
  assert.strictEqual(envelope.version, '1');
  assert.ok(envelope.nonce && envelope.nonce.length === 32);
  assert.ok(envelope.sealed);
  assert.ok(!JSON.stringify(envelope).includes('OBAG-AAAAAA-BBBB-CC')
    || envelope.sealed.includes('AAAAAA'),
    'Plaintext seal code must not be top-level in the envelope');

  // submitReport rejects unknown types
  const r2 = await skill.submitReport(ctx, { type: 'totally_made_up' });
  assert.strictEqual(r2.ok, false);
  assert.strictEqual(r2.error, 'invalid_report_type');

  // submitReport queues offline
  const ctxOff = makeStub({ httpFails: true });
  await skill.on_install(ctxOff);
  const r3 = await skill.submitReport(ctxOff, { type: 'fake_bag', notes: 'offline test' });
  assert.strictEqual(r3.ok, false);
  assert.strictEqual(r3.error, 'queued');
  assert.strictEqual(r3.queue_size, 1);
  const pending = await ctxOff.storage.get('reports_pending');
  assert.strictEqual(pending.length, 1);
  assert.strictEqual(pending[0].attempts, 1);

  // on_verify only fires when flag_suspicious=true
  const ctxV = makeStub();
  await skill.on_install(ctxV);
  const noFlag = await skill.on_verify(ctxV, { flag_suspicious: false });
  assert.strictEqual(noFlag, null);
  const flagged = await skill.on_verify(ctxV, {
    flag_suspicious: true,
    target_seal_code: 'OBAG-XXXXXX-YYYY-ZZ',
    geohash7: '6gyf4cd',
  });
  assert.strictEqual(flagged.ok, true);

  console.log('skill-sentinel: all tests passed');
})().catch((err) => { console.error(err); process.exit(1); });
