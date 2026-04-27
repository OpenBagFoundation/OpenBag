'use strict';

module.exports = async function on_verify(context, event) {
  if (!event || event.flag_suspicious !== true) return null;

  const report = {
    type: 'suspicious_verification',
    target_seal_code: event.target_seal_code || null,
    geohash7: event.geohash7 || null,
    timestamp: new Date().toISOString(),
    notes: event.notes || '',
  };

  const submit = require('./submit_report.js');
  return submit(context, report);
};
