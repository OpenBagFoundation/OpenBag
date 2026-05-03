'use strict';

// Fires on the first agent boot after install.
// Prompts worker to optionally link their OpenClaw identity.
module.exports = async function onFirstRun(context) {
  const tier = await context.agent.getReputationTier();

  await context.notifications.local({
    title: 'Bridge OpenClaw ativo',
    body: `Tier atual: ${tier.label}. Toque para exportar sua credencial cívica.`,
    action_url: 'openbag://skill-claw-bridge/export',
  });
};
