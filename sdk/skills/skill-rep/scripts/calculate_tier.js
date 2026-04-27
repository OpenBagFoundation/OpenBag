'use strict';

const TIERS = ['BRONZE', 'PRATA', 'OURO', 'DIAMANTE'];

const THRESHOLDS = [
  { tier: 'BRONZE',   min_age_days:   0, min_score:    0, min_upheld_reports: 0 },
  { tier: 'PRATA',    min_age_days: 180, min_score: 1000, min_upheld_reports: 1 },
  { tier: 'OURO',     min_age_days: 365, min_score: 5000, min_upheld_reports: 3 },
  { tier: 'DIAMANTE', min_age_days: 730, min_score:15000, min_upheld_reports: 5 },
];

function calculateTier(stats) {
  const ageDays = stats.age_days || 0;
  const score = stats.score || 0;
  const upheldReports = stats.upheld_reports || 0;
  const hasNegatives = (stats.recent_negatives || 0) > 2;

  if (hasNegatives) return 'BRONZE';

  let tier = 'BRONZE';
  for (const t of THRESHOLDS) {
    if (ageDays >= t.min_age_days
        && score >= t.min_score
        && upheldReports >= t.min_upheld_reports) {
      tier = t.tier;
    }
  }
  return tier;
}

calculateTier.TIERS = TIERS;
calculateTier.THRESHOLDS = THRESHOLDS;

module.exports = calculateTier;
