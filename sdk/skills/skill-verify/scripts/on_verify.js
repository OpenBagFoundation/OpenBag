'use strict';

function maskName(fullName) {
  if (!fullName) return '— —';
  return fullName.trim().split(/\s+/).map((p) => p[0] + '***').join(' ');
}

module.exports = async function on_verify(context, event) {
  const seal = await context.agent.getSeal();
  if (!seal) {
    return { ok: false, error: 'no_active_seal' };
  }

  const tier = await context.agent.getTier();
  const platforms = await context.agent.getPlatforms();
  const status = await context.agent.getStatus();

  const result = {
    ok: true,
    seal_code:    seal.seal_code,
    masked_name:  maskName(seal.full_name),
    status,
    tier,
    platforms,
    issued_at:    seal.issued_at,
    expires_at:   seal.expires_at,
    verifier:     event && event.verifier_type ? event.verifier_type : 'CITIZEN',
    verified_at:  new Date().toISOString(),
  };

  const count = (await context.storage.get('verify_count')) || 0;
  await context.storage.set('verify_count', count + 1);
  await context.storage.set('last_verify', result.verified_at);

  const cfg = await context.storage.get('config');
  if (cfg && cfg.notify_on_verify) {
    await context.notifications.send({
      title: 'Você foi verificado',
      body:  `Verificação concluída · ${result.verifier}`,
    });
  }

  return result;
};
