'use strict';

const VALID_TYPES = new Set([
  'suspicious_verification',
  'fake_bag',
  'hostility_against_worker',
  'incorrect_seal_data',
  'other',
]);

const ENDPOINT = 'https://sentinel.openbag.foundation/v0/reports';

function generateNonce() {
  // 16 bytes of entropy expressed as hex
  let s = '';
  for (let i = 0; i < 32; i++) s += Math.floor(Math.random() * 16).toString(16);
  return s;
}

async function encryptToFoundation(context, payload) {
  // The agent gateway is responsible for the actual ECIES envelope using
  // the Foundation public key (rotated quarterly, see SECURITY.md).
  // Here we delegate via the gateway HAL.
  if (context.crypto && context.crypto.encryptToFoundation) {
    return context.crypto.encryptToFoundation(payload);
  }
  // Fallback for tests: just base64 the JSON.
  const json = JSON.stringify(payload);
  return Buffer.from(json, 'utf8').toString('base64');
}

module.exports = async function submitReport(context, report) {
  if (!report || !VALID_TYPES.has(report.type)) {
    return { ok: false, error: 'invalid_report_type' };
  }

  const envelope = {
    version: '1',
    nonce: generateNonce(),
    sealed: await encryptToFoundation(context, report),
  };

  let response;
  try {
    response = await context.http.post(ENDPOINT, envelope, {
      headers: { 'Content-Type': 'application/json' },
      // No auth header — Sentinel is intentionally anonymous.
      timeoutMs: 10000,
    });
  } catch (err) {
    // Queue locally for later retry
    const pending = (await context.storage.get('reports_pending')) || [];
    pending.push({ envelope, queued_at: Date.now(), attempts: 1 });
    await context.storage.set('reports_pending', pending);
    context.log.warn('Sentinel report queued (offline): ' + err.message);
    return { ok: false, error: 'queued', queue_size: pending.length };
  }

  const submitted = ((await context.storage.get('reports_submitted')) || 0) + 1;
  await context.storage.set('reports_submitted', submitted);

  await context.notifications.send({
    title: 'Relato anônimo enviado',
    body:  'Obrigado. Seu relato foi enviado em segurança.',
  });

  return {
    ok: true,
    case_id: response && response.case_id ? response.case_id : null,
    submitted,
  };
};

module.exports.VALID_TYPES = Array.from(VALID_TYPES);
