'use strict';

const TIER_LABELS = {
  BRONZE:   { icon: '🥉', name: 'Bronze' },
  PRATA:    { icon: '🥈', name: 'Prata' },
  OURO:     { icon: '🥇', name: 'Ouro' },
  DIAMANTE: { icon: '💎', name: 'Diamante' },
};

const ORDER = ['BRONZE', 'PRATA', 'OURO', 'DIAMANTE'];

module.exports = async function on_tier_change(context, event) {
  const { previous, current } = event;
  const isUpgrade = ORDER.indexOf(current) > ORDER.indexOf(previous);
  const label = TIER_LABELS[current] || { icon: '·', name: current };

  await context.notifications.send({
    title: isUpgrade ? `Parabéns! Você é ${label.icon} ${label.name}` : `Tier alterado: ${label.icon} ${label.name}`,
    body:  isUpgrade
      ? `Você subiu de ${previous} para ${current}. Confira novos benefícios no app.`
      : `Seu tier mudou de ${previous} para ${current}. Veja detalhes no app.`,
  });

  const history = (await context.storage.get('tier_history')) || [];
  history.push({ ts: Date.now(), previous, current });
  await context.storage.set('tier_history', history);
};
