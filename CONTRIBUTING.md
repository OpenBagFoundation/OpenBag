# Como Contribuir com o OpenBag

Bem-vindo à colmeia. 🐝

> 🇬🇧 **English version:** [CONTRIBUTING.en.md](CONTRIBUTING.en.md)

O OpenBag é um projeto comunitário, MIT-licensed, mantido por contribuidores independentes. Não há vagas a preencher — há issues a resolver, RFCs a discutir, skills a publicar, comunidades a mobilizar.

Este documento descreve como você pode contribuir.

---

## Índice

- [Antes de começar](#antes-de-começar)
- [Tipos de contribuição](#tipos-de-contribuição)
- [Setup de desenvolvimento](#setup-de-desenvolvimento)
- [Fluxo de contribuição (código)](#fluxo-de-contribuição-código)
- [Desenvolvendo Skills](#desenvolvendo-skills)
- [Fluxo RFC](#fluxo-rfc-mudanças-estruturais)
- [Issues](#issues)
- [Code review](#code-review)
- [Maintainers](#maintainers)
- [Recompensas e reconhecimento](#recompensas-e-reconhecimento)
- [Alinhamento com OpenClaw](#alinhamento-com-openclaw)
- [Recursos](#recursos-para-começar-rápido)

---

## Antes de começar

1. Leia o [Código de Conduta](CODE_OF_CONDUCT.md). Adesão é condição de participação.
2. Leia o [Manifesto](docs/MANIFESTO.md) para entender o "porquê" do projeto.
3. Leia o [RFC-001](docs/RFC-001.md) para entender o "como".
4. Leia o [RFC-002](docs/RFC-002.md) para entender o protocolo de cold start.
5. Junte-se ao [Discord da comunidade](https://discord.gg/openbag) e apresente-se em `#new-contributors`.

---

## Tipos de contribuição

O projeto se beneficia de muitas formas de contribuição — não apenas código.

### 1. Código e arquitetura

- Implementação de Skills nativas e comunitárias
- Spec de protocolos (BLE rotativo, Sentinel mixnet, Reputation tier)
- SDK do app cidadão (iOS/Android)
- Stub e integrações com Gov.br
- Auditoria de segurança (red-team, threat modeling)
- Bridge com OpenClaw (skill-claw-bridge)

### 2. Hardware

- BOM e schematic do crachá vivo (e-paper + BLE + bateria)
- Bag certificada (Secure Element + lacre eletrônico)
- Capacete com beacon
- Firmware nRF52840 (Zephyr RTOS)

### 3. Pesquisa

- Análise de conformidade LGPD e DPIA
- Threat model formal (STRIDE)
- Estudos de impacto e métricas
- Pesquisa qualitativa com entregadores e comunidades

### 4. Documentação

- Tradução RFCs para EN/ES (essencial para coalizão LATAM)
- Tutoriais e onboarding
- Casos de uso documentados
- Vídeos didáticos

### 5. Comunidade e advocacy

- Organização de Meetups regionais (SP, RJ, BH, Recife, CDMX, Bogotá)
- Curadoria do servidor Discord
- Engajamento com fundações e funders
- Articulação política com setor público

### 6. Design e narrativa

- Sistema visual e mascote
- Comunicação para redes sociais
- Vídeos didáticos para a Academy
- Material para mídia tradicional

---

## Setup de desenvolvimento

Veja o guia detalhado em [docs/dev-setup.md](docs/dev-setup.md).

**Quickstart:**

```bash
# Clone
git clone https://github.com/OpenBagFoundation/OpenBag.git
cd OpenBag/

# Instale o CLI do SDK
cd sdk/cli && npm install && npm link && cd ../..

# Verifique
openbag --help

# Rode a landing page localmente
python3 -m http.server 8080 --directory docs/

# Rode o app Verifica localmente
python3 -m http.server 8081 --directory apps/verifica/
```

---

## Fluxo de contribuição (código)

### Passo a passo

```bash
# 1. Fork o repositório
gh repo fork OpenBagFoundation/OpenBag --clone

# 2. Crie uma branch para sua contribuição
cd OpenBag/
git checkout -b feat/skill-finance-sebrae-integration

# 3. Faça suas alterações com commits descritivos (Conventional Commits)
git commit -m "feat(skill-finance): add Sebrae MEI registration flow"

# 4. Atualize testes e documentação relevantes
openbag validate sdk/skills/skill-finance/
openbag test sdk/skills/skill-finance/

# 5. Rode o linting local antes de abrir PR
markdownlint '**/*.md' --ignore node_modules

# 6. Abra um pull request descritivo
gh pr create \
  --title "Skill-Finance · Sebrae MEI integration" \
  --body "Closes #042 · adds skill module for MEI registration via Sebrae API..."
```

### Convenções de commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

| Prefixo | Uso |
|---------|-----|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Mudança de documentação |
| `spec:` | Mudança em RFC ou spec |
| `chore:` | Build, infra, dependências |
| `refactor:` | Refactor sem mudança de comportamento |
| `test:` | Adição ou correção de testes |
| `style:` | Formatação, ponto-e-vírgula faltando, etc |
| `perf:` | Melhoria de performance |

**Exemplo**: `feat(skill-sentinel): add mixnet relay rotation`

### Convenções de branch

```
feat/<descrição-curta>
fix/<descrição-curta>
docs/<descrição-curta>
spec/<rfc-numero-tema>
chore/<descrição-curta>
```

---

## Desenvolvendo Skills

Skills são as unidades modulares de extensão do agente OpenBag. Inspirado diretamente
no modelo OpenClaw, cada skill é declarativa, sandboxed, e segue um modelo de
permissões granulares.

### Anatomia de uma Skill

```
sdk/skills/skill-example/
├── SKILL.yaml          # Manifest (fonte da verdade)
├── README.md           # Documentação
├── index.js            # Entry point
├── scripts/            # Hooks de lifecycle
│   ├── on_install.js
│   ├── on_first_run.js
│   ├── on_verify.js
│   └── on_wake.js
└── test/
    └── index.js        # Testes
```

### Lifecycle Hooks disponíveis

| Hook | Quando dispara |
|------|----------------|
| `on_install` | Imediatamente após instalação |
| `on_first_run` | Primeira vez que o agente boota após instalar |
| `on_uninstall` | Antes de remover |
| `on_wake` | Cada vez que o agente acorda (heartbeat) |
| `on_verify` | Quando cidadão dispara verificação |
| `on_panic` | Quando modo de pânico ativa (core-sensitive only) |
| `on_route_start` | Quando entregador inicia rota |
| `on_route_end` | Quando entregador finaliza rota |
| `on_tier_change` | Quando tier de reputação muda |

### Categorias e maturidade

| Categoria | Descrição |
|-----------|-----------|
| `core` | Built-in, pré-instalada, mantida pelo TSC |
| `community` | Publicada no ClawHub-BR pela comunidade |
| `experimental` | Em desenvolvimento ativo, com badge de aviso |

| Maturidade | Significado |
|------------|-------------|
| `alpha` | Em desenvolvimento inicial, API instável |
| `beta` | Funcional, em teste |
| `stable` | Pronta para produção |

### Modelo de permissões

Toda skill **deve** declarar exatamente as permissões que precisa. O Gateway nega
qualquer chamada não-declarada. Veja [spec/08-gateway.md](spec/08-gateway.md) para
a lista completa de permissões disponíveis (25+ categorias).

Exemplos comuns:

```yaml
permissions:
  - read:reputation_tier      # Ler tier do entregador
  - ble:scan                  # Escanear beacons BLE
  - ble:advertise             # Anunciar como beacon
  - nfc:read                  # Ler tags NFC
  - location:coarse           # GPS aproximado (cidade)
  - location:fine             # GPS exato (somente core)
  - notifications:local       # Notificações locais no device
  - storage:read              # Ler storage criptografado da skill
  - storage:write             # Escrever no storage
  - network:foundation_api    # HTTPS para API da Foundation
  - network:platform_api      # HTTPS para APIs de plataformas
```

### Skills de referência

Antes de criar uma skill nova, estude as 3 implementações de referência:

- [`sdk/skills/skill-verify/`](sdk/skills/skill-verify/) — Verificação cidadã (core, stable)
- [`sdk/skills/skill-rep/`](sdk/skills/skill-rep/) — Engine de reputação (core, stable)
- [`sdk/skills/skill-sentinel/`](sdk/skills/skill-sentinel/) — Denúncia anônima (core-sensitive, beta)
- [`sdk/skills/skill-claw-bridge/`](sdk/skills/skill-claw-bridge/) — Bridge OpenClaw ↔ OpenBag

### Workflow completo

```bash
# 1. Crie a skill
openbag init my-cool-skill

# 2. Implemente seus hooks em scripts/
$EDITOR sdk/skills/skill-my-cool-skill/scripts/on_verify.js

# 3. Adicione testes
$EDITOR sdk/skills/skill-my-cool-skill/test/index.js

# 4. Valide o manifest
openbag validate sdk/skills/skill-my-cool-skill/

# 5. Rode os testes
openbag test sdk/skills/skill-my-cool-skill/

# 6. Publique no ClawHub-BR
openbag publish sdk/skills/skill-my-cool-skill/
```

---

## Fluxo RFC (mudanças estruturais)

Para mudanças no protocolo, na arquitetura, ou em decisões fundadoras, abrimos um RFC:

1. Crie um arquivo `rfcs/NNNN-titulo-curto.md` baseado em `rfcs/0000-template.md`
2. Abra um PR marcado com label `rfc-discussion`
3. A discussão fica aberta por **mínimo 14 dias**
4. Decisão por consenso aproximado (lazy consensus); em impasse, voto da Foundation Board
5. RFC aceita: status passa a `accepted`, branch principal incorpora

RFCs ativos:
- [RFC-001](docs/RFC-001.md) — Visão geral e arquitetura (accepted)
- [RFC-002](docs/RFC-002.md) — Cold start e fases (accepted)
- RFC-003 — National expansion (planejado)

---

## Issues

### Reportar bug

Use o template `Bug Report` em `.github/ISSUE_TEMPLATE/bug_report.md`. Inclua:

- Descrição clara do bug
- Passos para reproduzir
- Comportamento esperado vs observado
- Ambiente (OS, versão do agente, hardware)
- Screenshots ou logs (se aplicável)

### Propor feature

Use o template `Feature Proposal`. Para features grandes (> 2 semanas de trabalho),
considere abrir um RFC primeiro.

### Propor uma Skill

Use o template `Skill Proposal`. Inclua:

- Categoria (core / community / experimental)
- Permissões necessárias
- Caso de uso e público-alvo
- Mantenedor proposto

### Vulnerabilidade de segurança

**NÃO** abra issue pública. Veja [SECURITY.md](SECURITY.md) para responsible disclosure.

---

## Code review

Toda contribuição passa por revisão de pelo menos um maintainer. Critérios:

1. **Aderência ao spec** — a contribuição respeita os RFCs vigentes?
2. **Qualidade técnica** — código limpo, testado, documentado?
3. **Privacidade por design** — dados sensíveis ficam no dispositivo do entregador?
4. **Backward compatibility** — não quebra implementações existentes sem RFC?
5. **Segurança** — não introduz vetores de ataque?
6. **LGPD** — minimização de dados e consent explícito?
7. **Permissões mínimas** — skill declara apenas o que precisa?

Reviewers tem **7 dias** para resposta inicial. PRs sem resposta após esse prazo,
contate `@maintainers` no Discord.

### Checklist do contribuidor

Antes de marcar PR como pronto para review:

- [ ] Commits seguem Conventional Commits
- [ ] Testes passam localmente
- [ ] CI verde no GitHub Actions
- [ ] Documentação atualizada (README, spec se aplicável)
- [ ] LGPD: nenhum dado pessoal exposto sem consent
- [ ] Skills: validate + test passam
- [ ] Markdown: lint passa
- [ ] Links: todos resolvem (ou estão em `.lychee.toml` exclusion)

---

## Maintainers

A lista atual de maintainers está em [GOVERNANCE.md](GOVERNANCE.md). Maintainers
são contribuidores que demonstraram comprometimento sustentado e foram convidados
pelo Board.

### Promoção a maintainer

Critério (após 6 meses de contribuição ativa):

- 10+ PRs aceitos no projeto
- Participação consistente em RFCs
- Aderência ao Code of Conduct
- Indicação de 2 maintainers existentes
- Aprovação da Board

---

## Recompensas e reconhecimento

Seguindo o modelo OpenClaw, o OpenBag reconhece contribuidores em níveis:

| Nível | Critério | Privilégios |
|-------|----------|-------------|
| 🐝 **Hexagon** | Primeira contribuição aceita | Listado em `CONTRIBUTORS.md` |
| 🐝 **Worker Bee** | 5+ contribuições, ativo no Discord | Badge no perfil; convite para Office Hours |
| 🍯 **Forager** | Skill comunitária mantida no ClawHub-BR | Voz consultiva em RFCs |
| 🛠️ **Drone Engineer** | Maintainer com privilégios de merge | Voto em decisões técnicas |
| 👑 **Queen** | Cadeira na OpenBag Foundation Board | Veto de RFC (com 6/9 quórum) |

Reconhecimento público nos releases mensais e no `CONTRIBUTORS.md`. Para
contribuidores institucionais (universidades, ONGs, empresas), reconhecimento
na seção [`coalition/COALITION.md`](coalition/COALITION.md).

---

## Alinhamento com OpenClaw

OpenBag é projeto-irmão do OpenClaw e segue convenções compatíveis. Veja
[docs/OPENCLAW-ALIGNMENT.md](docs/OPENCLAW-ALIGNMENT.md) para detalhes:

- Formato de manifest de skills (compatível)
- Lifecycle hooks comuns
- Modelo de permissões alinhado
- Bridge de reputação portátil entre OpenClaw e OpenBag (via `skill-claw-bridge`)
- Modelo de governança inspirado no Apache Way + OpenClaw Foundation

Se você já contribui com OpenClaw, o onboarding em OpenBag deve levar < 30 minutos.

---

## Recursos para começar rápido

| Recurso | Status |
|---------|--------|
| 📺 Vídeo · 5 minutos sobre o OpenBag | Em produção |
| 🎓 Walkthrough da arquitetura | Em produção |
| 🛠️ [Setup de dev local](docs/dev-setup.md) | ✅ Disponível |
| 🇬🇧 [Dev setup (English)](docs/dev-setup.en.md) | ✅ Disponível |
| 💬 [Discord · #new-contributors](https://discord.gg/openbag) | ✅ Ativo |
| 📅 [Meetup SP](https://meetup.com/openbag-sp) | ✅ Ativo |
| 🐛 [Good first issues](https://github.com/OpenBagFoundation/OpenBag/issues?q=label%3Agood-first-issue) | ✅ Disponível |

---

*Bem-vindo à colmeia. Cada um traz mel.* 🐝
