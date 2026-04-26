# Roadmap · OpenBag

Documento vivo. Atualizado por consenso da comunidade. Para mudanças estruturais, abra um RFC.

---

## Visão de longo prazo (2026–2030)

> Em 30 meses, transformar a verificação de identidade na última milha em um **bem público** auditável, replicável em LATAM, e sustentado por uma fundação independente. Em 5 anos, o protocolo OpenBag deve ser o **padrão de fato** para identidade de trabalhador plataformizado em pelo menos 5 países da região.

**A implantação respeita o protocolo de cold start ([RFC-002](docs/RFC-002.md))** — saturação por território antes de cobertura ampla, gates objetivos entre fases, recuo não-disputável quando métricas não são atendidas.

---

## Onda 01 · Fase α (Silenciosa) · Dia 0–60

**Objetivo**: cadastramento massivo dentro do polígono fundador (Heliópolis-Sacomã, ~5 km²), **sem campanha pública**.

### Principais entregas

- [x] Repositório GitHub público
- [x] Manifesto + RFC-001 + RFC-002 (drafts públicos)
- [ ] Discord server "Hive" online (modo invitação apenas)
- [ ] **1ª turma da Academy · 100 jovens · CEU Heliópolis · São Paulo** ⭐
- [ ] MOU com SSP-SP (Detecta) e 1MiO/UNICEF
- [ ] Selo Digital v0 emitido para 1.000+ entregadores iFood ativos no polígono
- [ ] App Verifica em modo `dev preview` (apenas convidados/maintainers)

### Comunicação pública

**Zero**. Nenhum LinkedIn, nenhuma imprensa proativa. Documentação técnica no GitHub é o único artefato público nesta fase.

### Gate para Fase β

- ≥ 80% dos entregadores iFood ativos no polígono têm Selo Digital ativo
- ≥ 50% dos entregadores Rappi
- 0 incidentes de hostilidade documentados
- App Verifica funcionando em produção interna

---

## Onda 01 · Fase β (Piloto público) · Dia 60–120

**Objetivo**: ativar app cidadão para o público no polígono. Aprender com uso real.

### Principais entregas

- [ ] App Verifica disponível nas lojas (App Store + Play Store)
- [ ] Cobertura editorial controlada · 1-2 reportagens em veículos selecionados
- [ ] Pesquisa qualitativa com primeiros usuários
- [ ] Onboarding de Rappi e Uber Eats no polígono
- [ ] 5.000 entregadores total no polígono com Selo Digital

### Comunicação pública

LinkedIn post inicial com framing **piloto controlado**, não solução geral. Linguagem: "ainda estamos aprendendo. Não é solução pronta."

### Gate para Fase γ

- ≥ 65% de cobertura agregada (todas plataformas) no polígono, sustentado 30 dias
- Taxa de falso positivo (entregador legítimo verificado como "não cadastrado") < 12%
- Zero incidentes de violência cidadã contra entregador sem selo
- NPS dos primeiros usuários ≥ 40

---

## Onda 02 · Fase γ + Hardware · Dia 120–270

**Objetivo**: campanha cidadã ativa no polígono + iniciar migração para Selo Físico.

### Principais entregas

- [ ] Campanha "Verifique antes de pagar" no polígono Heliópolis-Sacomã
- [ ] LinkedIn post principal · cobertura ampla · podcasts
- [ ] Bag certificada · primeiros lotes (10k unidades)
- [ ] Crachá vivo · BOM final, certificação INMETRO, primeiros lotes (5k)
- [ ] Skill Sentinela em produção (mixnet ativa)
- [ ] **Programa Shield ativo** · 1º caso protegido
- [ ] 5 turmas Academy · 500 egressos formados

### Gate para Expansão (Fase δ)

- Taxa de falso positivo < 8%
- Zero incidentes de violência cidadã contra entregador sem selo
- 3 turmas adicionais da Academy concluídas
- Adesão formal de 15+ instituições da coalizão

---

## Onda 03 · Fase δ (Expansão concêntrica) · Dia 270–540

**Objetivo**: expandir por anéis concêntricos a partir de Heliópolis-Sacomã. Cada anel repete o ciclo α → β → γ.

### Sequência de anéis

- [ ] Anel 1 · Vila Mariana, Ipiranga, Aclimação
- [ ] Anel 2 · Vila Olímpia, Brooklin, Moema
- [ ] Anel 3 · Centro SP, zona Oeste
- [ ] Anel 4 · Resto da capital
- [ ] Início RJ (polígono fundador: Maré-Jacarezinho)
- [ ] Início Recife (polígono fundador: Coque)

### Principais entregas adicionais

- [ ] Padrão federal por decreto MJSP / lei via Câmara dos Deputados
- [ ] 30 turmas Academy/ano · 3.000 egressos/ano em escala
- [ ] Tier Diamante CLT · primeiras transições para emprego formal
- [ ] Conformidade ANPD com auditoria pública trimestral
- [ ] **OpenBag Foundation legalmente constituída** ⭐
- [ ] Transferência de custódia ITS-Rio → Foundation

### Branch paralela · OpenRide

- [ ] Spec OpenRide v1.0 (mobilidade · Uber/99/InDrive)
- [ ] Piloto OpenRide · São Paulo · 1.000 motoristas

---

## Onda 04 · LATAM · Dia 540–900

**Objetivo**: padrão regional adotado em 4 países, com cold start replicado em cada um.

### Principais entregas

- [ ] **México** · CURP + Keeta + Rappi + Didi (polígono fundador: CDMX · Iztapalapa)
- [ ] **Colômbia** · Cédula + Rappi + Didi (polígono fundador: Bogotá · Ciudad Bolívar)
- [ ] **Argentina** · DNI + PedidosYa (polígono fundador: BA · La Matanza)
- [ ] **Chile** · RUT + Uber Eats + Rappi (polígono fundador: Santiago · Bajos de Mena)
- [ ] Federação OpenBag LATAM · governança regional
- [ ] OpenRide expansão LATAM
- [ ] Standard formal submetido ao W3C-DID (carteira digital de trabalhador)

---

## Princípios para priorização

Quando trade-offs aparecem, priorizamos nesta ordem:

1. **Segurança e privacidade do entregador** sempre vem primeiro
2. **Princípio inegociável** · "presença prova, ausência não condena" · prevalece sobre crescimento
3. **Verificabilidade pública** prevalece sobre conveniência da plataforma
4. **Inclusão produtiva** (Academy + Reputação) prevalece sobre velocidade técnica
5. **Pluralidade da coalizão** prevalece sobre captura corporativa
6. **Auditabilidade** prevalece sobre time-to-market
7. **Recuo de fase** prevalece sobre euforia de progresso

---

*Roadmap é compromisso público. Falhar é aceitável. Esconder não é.* 🐝
