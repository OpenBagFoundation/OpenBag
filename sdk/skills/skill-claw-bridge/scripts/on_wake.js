'use strict';

// Fires every agent wake cycle. Syncs tier if OpenClaw VC is present.
module.exports = async function onWake(context) {
  const state = await context.storage.get('bridge_state');
  if (!state || !state.openclaw_vc) return;

  const SIX_HOURS = 6 * 60 * 60 * 1000;
  const now = Date.now();
  if (state.last_sync_at && now - state.last_sync_at < SIX_HOURS) return;

  const currentTier = await context.agent.getReputationTier();
  const mappedTier = mapOpenClawTier(state.openclaw_vc);

  // Conservative mapping: take the lower tier until Foundation verifies
  const resolvedTier = lowerTier(currentTier.level, mappedTier);

  if (resolvedTier !== currentTier.level) {
    await context.agent.writeReputationEvent({
      source: 'skill-claw-bridge',
      event_type: 'openclaw_import',
      tier_override: resolvedTier,
      evidence_vc: state.openclaw_vc,
    });
  }

  await context.storage.set('bridge_state', {
    ...state,
    mapped_tier: resolvedTier,
    last_sync_at: now,
  });
};

const TIER_ORDER = ['bronze', 'prata', 'ouro', 'diamante'];

function mapOpenClawTier(vc) {
  const clawLevel = vc?.credentialSubject?.level || 'hexagon';
  const mapping = {
    hexagon: 'bronze',
    worker_bee: 'bronze',
    forager: 'prata',
    drone_engineer: 'ouro',
    queen: 'diamante',
  };
  return mapping[clawLevel] || 'bronze';
}

function lowerTier(a, b) {
  const ia = TIER_ORDER.indexOf(a);
  const ib = TIER_ORDER.indexOf(b);
  if (ia === -1) return b;
  if (ib === -1) return a;
  return TIER_ORDER[Math.min(ia, ib)];
}
