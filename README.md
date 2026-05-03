# OpenBag

> **Open identity, agent, and civic reputation for last-mile delivery.**
> Identidade aberta, agente pessoal e reputação cívica para a última milha.

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)
[![CI](https://img.shields.io/github/actions/workflow/status/OpenBagFoundation/OpenBag/ci.yml?branch=main&label=CI)](https://github.com/OpenBagFoundation/OpenBag/actions)
[![RFC-001](https://img.shields.io/badge/RFC-001-amber.svg)](docs/RFC-001.md)
[![RFC-002](https://img.shields.io/badge/RFC-002-amber.svg)](docs/RFC-002.md)
[![Status: Phase α](https://img.shields.io/badge/Status-Phase%20α%20Silenciosa-amber.svg)](ROADMAP.md)
[![SDK: v1.0](https://img.shields.io/badge/SDK-v1.0-green.svg)](sdk/README.md)

---

## Bag legítima emite sinal. Bag fraudada é silenciosa.

A bag de delivery deixou de ser equipamento logístico e virou uma **credencial implícita** — um uniforme de invisibilidade explorado por bandidos para se aproximar de vítimas. Casos recentes em São Paulo (Moema, abril/2026; Vila Olímpia; Higienópolis) mostram um padrão sistêmico: entregador falso aborda, vítima reage ou hesita, alguém morre.

O **OpenBag** é uma iniciativa **MIT-licensed**, mantida por contribuidores independentes, para construir um padrão público que:

- **Verifica** qualquer entregador em menos de 5 segundos, à distância, sem login de plataforma
- **Defende** o entregador legítimo — ele opera um agente pessoal local que protege seus dados e acumula sua reputação cívica portátil
- **Recompensa** quem é cidadão de bem com bônus financeiros, seguro saúde, trilha CLT e voz na governança
- **Protege** quem denuncia: a Skill Sentinela combina anonimato criptográfico, anonimato humano (modelo Disque-Denúncia 181) e Programa Shield de proteção familiar
- **Forma** novas turmas via OpenBag Academy, plugada no Pacto Nacional pela Inclusão Produtiva (1MiO/UNICEF)

A primeira turma da Academy começa no **CEU Heliópolis**, São Paulo.

---

## Filosofia (estilo OpenClaw)

```
Open      — código MIT, governança neutra, auditável publicamente
Agent     — cada entregador opera um agente pessoal local que defende seus interesses
Reward    — reputação cívica vira credencial portátil e benefício real
Sentinel  — denúncia anônima protegida com programa de proteção familiar
Universal — qualquer cidadão verifica, sem cadastro, sem custo
```

**Princípio inegociável da implantação**:
> *Presença prova. Ausência não condena.*

O sinal verde do OpenBag confirma legitimidade. A ausência do selo **não é** prova de fraude — durante a Onda 01, a maioria dos entregadores legítimos ainda não tem selo. Detalhes do protocolo de cold start em [RFC-002](docs/RFC-002.md).

**Stewardship**: OpenBag Foundation (a constituir). Inspirado em OpenClaw, OpenStreetMap, Linux Foundation. Doadores institucionais sem direito de veto técnico.

---

## Arquitetura · 3 pilares + 1 agente

| Pilar | O que é | Owner |
|-------|---------|-------|
| **Identidade Soberana** | Selo emitido como carteira digital Gov.br Nível Ouro, vinculando pessoa + biometria + plataforma + equipamento | Gov.br · Serpro · ITI |
| **Equipamento Inviolável** | Bag/capacete/colete com chip NFC Secure Element, beacon BLE rotativo, QR dinâmico em e-paper, lacre eletrônico | OpenBag Foundation · OEMs |
| **Crachá Vivo** | Display e-paper visível a 15m, GPS embarcado, botão de pânico, biometria de ativação, 60+ dias de bateria | Plataformas · SSP estaduais |
| **Agent Pessoal** | Software MIT-licensed rodando localmente no smartphone do entregador, com Skills modulares contribuíveis | Comunidade |

---

## Skills nativas do agente

| Skill | Função | Status |
|-------|--------|--------|
| **skill-verify** | Verificação cidadã via NFC, BLE, ou câmera | `sdk/skills/skill-verify/` |
| **skill-sentinel** | Denúncia anônima protegida (3 camadas) | `sdk/skills/skill-sentinel/` |
| **skill-rep** | Reputação cívica em 4 tiers (Bronze → Diamante) | `sdk/skills/skill-rep/` |
| **skill-rewards** | Resgate de benefícios escalonados | Roadmap Wave 4 |
| **skill-panic** | Botão de pânico georreferenciado | Roadmap Wave 3 |
| **skill-shield** | Proteção familiar quando denúncia ativa | Roadmap Wave 3 |
| **skill-academy** | Trilha de formação | Roadmap Wave 2 |
| **skill-route** | Heat-map público com posição anonimizada | Roadmap Wave 3 |

Skills comunitárias (skill-finance, skill-health, skill-defensive...) e abertura para devs publicarem na **ClawHub-BR** (registry comunitário).

---

## Estrutura do repositório

```
OpenBag/
├── docs/                  # Documentação pública (RFC, manifesto, specs, landing page)
│   ├── MANIFESTO.md       # Manifesto público
│   ├── RFC-001.md         # Visão geral (PT-BR)
│   ├── RFC-001-en.md      # RFC-001 em inglês
│   ├── RFC-002.md         # Cold start e fases
│   ├── FEATURES-100.md    # Top 100 features priorizadas
│   ├── LGPD-analysis.md   # Análise de conformidade LGPD
│   ├── PLATFORM-INTEGRATION.md  # Guia de integração com plataformas
│   └── index.html         # Landing page principal
├── spec/                  # Especificações técnicas detalhadas
│   ├── 01-architecture.md # Hardware e camadas digitais
│   ├── 02-agent.md        # Runtime do agente local
│   ├── 03-skills.md       # Sistema modular de skills
│   ├── 04-sentinel.md     # Protocolo de denúncia anônima
│   ├── 05-reputation.md   # Tiers de reputação cívica
│   ├── 06-academy.md      # Programa de formação
│   ├── 07-ble-beacon.md   # Protocolo BLE beacon
│   ├── 08-gateway.md      # Gateway do agente / sandbox
│   ├── 09-clawhub-br.md   # Registry comunitário de skills
│   ├── 10-interop.md      # Interoperabilidade e futuro
│   ├── 11-onboarding.md   # UX de onboarding
│   ├── api/               # OpenAPI spec Gov.br Seal
│   └── vc/                # Exemplos Verifiable Credentials (W3C-DID)
├── sdk/                   # SDK do agente e ferramentas de desenvolvimento
│   ├── README.md          # Documentação do SDK
│   ├── cli/               # openbag CLI (init, validate, test, publish)
│   ├── skills/            # Implementações de referência
│   │   ├── skill-verify/
│   │   ├── skill-rep/
│   │   └── skill-sentinel/
│   └── skill-manifest.schema.json  # JSON Schema para SKILL.yaml
├── apps/                  # Aplicações prontas para uso
│   ├── verifica/          # PWA cidadã de verificação
│   └── coverage/          # Mapa de cobertura geohash
├── tools/                 # Ferramentas de desenvolvimento
│   └── seal-v0/           # Gerador/verificador Selo Digital v0
├── assets/                # Brand kit, imagens
├── registry/              # ClawHub-BR registry seed
└── coalition/             # Registro de parceiros da coalizão
```

---

## Como começar a contribuir

```bash
# 1. Clone o repositório
git clone https://github.com/OpenBagFoundation/OpenBag.git
cd OpenBag/

# 2. Leia os documentos fundadores
cat docs/MANIFESTO.md
cat CONTRIBUTING.md
cat CODE_OF_CONDUCT.md
cat docs/RFC-001.md

# 3. Instale o CLI do SDK (opcional, para desenvolvimento de skills)
cd sdk/cli && npm install && npm link
cd ../..

# 4. Valide uma skill existente
openbag validate sdk/skills/skill-verify/

# 5. Crie sua primeira skill (scaffolding interativo)
openbag init my-skill

# 6. Encontre uma issue para começar
# https://github.com/OpenBagFoundation/OpenBag/issues?q=label%3Agood-first-issue
```

### Setup de desenvolvimento completo

Veja [docs/dev-setup.md](docs/dev-setup.md) para guia detalhado de setup local, incluindo instalação de dependências, configuração do ambiente, e execução de testes.

---

## Documentos essenciais

| Documento | Descrição |
|-----------|-----------|
| 📜 [Manifesto público](docs/MANIFESTO.md) | Missão e valores fundadores |
| 📋 [RFC-001 · visão geral (PT)](docs/RFC-001.md) | Arquitetura e proposta técnica completa |
| 📋 [RFC-001 · vision overview (EN)](docs/RFC-001-en.md) | English translation |
| 🚦 [RFC-002 · cold start e fases](docs/RFC-002.md) | Protocolo de implantação segura |
| 🗺️ [Top 100 Features](docs/FEATURES-100.md) | Roadmap priorizado de 100 features |
| 🏗️ [Arquitetura](spec/01-architecture.md) | Hardware e camadas digitais |
| 🤖 [Agente pessoal](spec/02-agent.md) | Runtime local do agente |
| 🧩 [Catálogo de Skills](spec/03-skills.md) | Sistema modular de extensão |
| 🛡️ [Skill Sentinela](spec/04-sentinel.md) | Protocolo de denúncia protegida |
| 🏆 [Reputação Cívica](spec/05-reputation.md) | Tiers Bronze → Diamante |
| 🎓 [OpenBag Academy](spec/06-academy.md) | Programa de formação |
| 📡 [BLE Beacon](spec/07-ble-beacon.md) | Protocolo de beacon rotativo |
| 🔧 [SDK](sdk/README.md) | SDK e CLI para desenvolvedores |
| 🤝 [Coalizão de Talentos](coalition/COALITION.md) | Parceiros institucionais |
| 🗺️ [Roadmap](ROADMAP.md) | Fases e gates de implantação |
| 📐 [Governança](GOVERNANCE.md) | Estrutura de tomada de decisão |
| 🔒 [Segurança](SECURITY.md) | Responsible disclosure |
| 🤲 [Como Contribuir](CONTRIBUTING.md) | Guia completo de contribuição |
| 🛠️ [Dev Setup](docs/dev-setup.md) | Setup do ambiente de desenvolvimento |

📊 **Dashboard executivo:** [`assets/dashboard.html`](assets/dashboard.html) — abra em qualquer navegador.
🌐 **Landing page:** [`docs/index.html`](docs/index.html) — abra em qualquer navegador.

---

## Issues prioritárias (good-first-issue / help-wanted)

| ID | Área | Descrição | Dificuldade |
|----|------|-----------|-------------|
| `#001` | core/spec | Especificação do beacon BLE rotativo | ★★★ |
| `#002` | mobile/ios | Background BLE scanner iOS | ★★ |
| `#003` | hardware | Protótipo do crachá vivo (e-paper + BLE) | ★★★ |
| `#004` | cv/badge-reader | Leitura óptica do código rotativo | ★★ |
| `#005` | gov/api | Stub da integração Gov.br Selo | ★ |
| `#006` | docs/i18n | Tradução RFCs para ES (espanhol) | ★ |
| `#007` | sdk/skills | Implementação skill-panic v1 | ★★ |
| `#008` | sdk/skills | Implementação skill-rewards v1 | ★★ |
| `#009` | audit/redteam | Bug bounty + threat model STRIDE | ★★★ |
| `#010` | docs/dpia | Escrever DPIA completo (LGPD Art. 38) | ★★ |

Ver todas as issues em [GitHub Issues](https://github.com/OpenBagFoundation/OpenBag/issues?q=label%3Agood-first-issue).

---

## Família OpenBag · extensibilidade

A arquitetura é projetada para extensão. **OpenRide** (mobilidade Uber/99/InDrive) é o irmão natural — endereçando os vetores de risco simétricos de falso motorista e falso passageiro. Spec em desenho na branch `openride-spec`.

---

## Comunidade

| Canal | Link |
|-------|------|
| 💬 Discord | [discord.gg/openbag](https://discord.gg/openbag) |
| 📅 Meetup SP | [meetup.com/openbag-sp](https://meetup.com/openbag-sp) |
| 🐛 Issues | [GitHub Issues](https://github.com/OpenBagFoundation/OpenBag/issues) |
| 💡 Discussions | [GitHub Discussions](https://github.com/OpenBagFoundation/OpenBag/discussions) |
| 📢 Anúncios | [GitHub Releases](https://github.com/OpenBagFoundation/OpenBag/releases) |

---

## Licença

[MIT License](LICENSE) · forking encorajado · contribuições bem-vindas.

---

*"A bag legítima emite sinal. O entregador legítimo é reconhecido. O bandido é silenciado."* 🐝
