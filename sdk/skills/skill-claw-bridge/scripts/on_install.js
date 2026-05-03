'use strict';

// Runs once on install. Initialises bridge state in encrypted local storage.
module.exports = async function onInstall(context) {
  const existing = await context.storage.get('bridge_state');
  if (existing) return;

  await context.storage.set('bridge_state', {
    openclaw_vc: null,
    last_export_at: null,
    last_sync_at: null,
    mapped_tier: null,
  });

  await context.notifications.local({
    title: 'OpenClaw Bridge instalado',
    body: 'Sua reputação OpenBag agora pode ser exportada para o ecossistema OpenClaw.',
  });
};
