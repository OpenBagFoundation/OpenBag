'use strict';

const calculateTier = require('./calculate_tier.js');

const RECALC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

module.exports = async function on_wake(context) {
  const lastRecalc = (await context.storage.get('last_recalc_ts')) || 0;
  if (Date.now() - lastRecalc < RECALC_INTERVAL_MS) return;

  const sealIssuedAt = await context.storage.get('seal_issued_at');
  const score = (await context.storage.get('score')) || 0;
  const upheldReports = (await context.storage.get('upheld_reports')) || 0;
  const recentNegatives = (await context.storage.get('recent_negatives')) || 0;
  const currentTier = (await context.storage.get('current_tier')) || 'BRONZE';

  const ageDays = sealIssuedAt
    ? Math.floor((Date.now() - new Date(sealIssuedAt).getTime()) / 86400000)
    : 0;

  const newTier = calculateTier({
    age_days: ageDays,
    score,
    upheld_reports: upheldReports,
    recent_negatives: recentNegatives,
  });

  await context.storage.set('last_recalc_ts', Date.now());

  if (newTier !== currentTier) {
    await context.storage.set('current_tier', newTier);
    await context.bus.emit('tier.changed', { previous: currentTier, current: newTier });
    context.log.info(`skill-rep: tier changed ${currentTier} -> ${newTier}`);
  }
};
