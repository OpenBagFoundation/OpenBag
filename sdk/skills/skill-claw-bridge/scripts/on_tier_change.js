'use strict';

// Fires when the worker's OpenBag tier changes.
// Exports an updated W3C VC for use in OpenClaw.
module.exports = async function onTierChange(context) {
  const { previous_tier, new_tier } = context.event;

  const vc = await context.agent.issueVerifiableCredential({
    type: 'OpenBagCivicTierCredential',
    credentialSubject: {
      id: context.agent.did,
      openbag_tier: new_tier,
      previous_tier,
      issued_at: new Date().toISOString(),
      issuer: 'did:openbag:foundation',
    },
  });

  const state = await context.storage.get('bridge_state') || {};
  await context.storage.set('bridge_state', {
    ...state,
    last_export_at: Date.now(),
  });

  await context.notifications.local({
    title: `Tier atualizado: ${new_tier}`,
    body: 'Sua credencial OpenClaw foi exportada automaticamente.',
  });

  return { exported_vc: vc };
};
