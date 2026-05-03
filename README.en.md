# OpenBag

> **Open identity, agent, and civic reputation for last-mile delivery.**
> 🇧🇷 [Versão em português](README.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)
[![CI](https://img.shields.io/github/actions/workflow/status/OpenBagFoundation/OpenBag/ci.yml?branch=main&label=CI)](https://github.com/OpenBagFoundation/OpenBag/actions)
[![RFC-001 EN](https://img.shields.io/badge/RFC--001-English-amber.svg)](docs/RFC-001-en.md)
[![Status: Phase α](https://img.shields.io/badge/Status-Phase%20α%20Silent-amber.svg)](ROADMAP.md)
[![SDK: v1.0](https://img.shields.io/badge/SDK-v1.0-green.svg)](sdk/README.md)

---

## The problem: a delivery bag became a weapon

In São Paulo, criminals impersonate delivery workers to approach victims. Cases in Moema (April 2026), Vila Olímpia, and Higienópolis follow the same pattern: fake deliverer approaches, victim hesitates, someone dies.

**2.2 million platform workers** in Brazil. **68% Black or mixed-race.** Average age 33. For 52%, it's their only income source. The vast majority are honest workers — criminals exploit the anonymity of the uniform, turning the legitimate worker into the first reputational victim.

**OpenBag flips this equation.**

---

## What OpenBag does

OpenBag is an **MIT-licensed** initiative to build a public standard that:

- **Verifies** any delivery worker in under 5 seconds, at distance, without platform login
- **Defends** the legitimate worker — they run a local personal agent that protects their data and accumulates portable civic reputation
- **Rewards** good citizens with financial bonuses, health insurance, CLT employment track, and governance voice
- **Protects** whistleblowers: Skill Sentinela combines cryptographic anonymity, operational anonymity (Disque-Denúncia 181 model), and a family protection program
- **Trains** new cohorts via OpenBag Academy, integrated with the National Productive Inclusion Pact (1MiO/UNICEF)

The first Academy cohort starts at **CEU Heliópolis**, São Paulo.

---

## Philosophy (OpenClaw style)

```
Open      — MIT code, neutral governance, publicly auditable
Agent     — each worker runs a local personal agent defending their interests
Reward    — civic reputation becomes a portable credential and real benefit
Sentinel  — anonymous, protected reporting with family protection program
Universal — any citizen verifies, no account, no cost
```

**Non-negotiable principle:**
> *Presence proves. Absence does not condemn.*

The green OpenBag signal confirms legitimacy. Absence of the seal **is not** proof of fraud — during Wave 01, most legitimate workers don't have a seal yet. Details in [RFC-002](docs/RFC-002.md).

---

## Architecture · 3 pillars + 1 agent

| Pillar | What it is | Owner |
|--------|-----------|-------|
| **Sovereign Identity** | Digital seal via Gov.br Gold Level, linking person + biometrics + platform + equipment | Gov.br · Serpro · ITI |
| **Tamper-proof Equipment** | Bag/helmet/vest with NFC Secure Element chip, rotating BLE beacon, dynamic QR on e-paper, electronic tamper seal | OpenBag Foundation · OEMs |
| **Live Badge** | E-paper display visible at 15m, embedded GPS, panic button, biometric activation, 60+ day battery | Platforms · State SSPs |
| **Personal Agent** | MIT-licensed software running locally on the worker's smartphone, with community-contributed modular Skills | Community |

---

## Native agent Skills

| Skill | Function | Status |
|-------|----------|--------|
| **skill-verify** | Citizen verification via NFC, BLE, or camera | `sdk/skills/skill-verify/` |
| **skill-sentinel** | Anonymous, protected reporting (3 layers) | `sdk/skills/skill-sentinel/` |
| **skill-rep** | Civic reputation across 4 tiers (Bronze → Diamond) | `sdk/skills/skill-rep/` |
| **skill-claw-bridge** | Portable reputation bridge with OpenClaw | `sdk/skills/skill-claw-bridge/` |
| **skill-rewards** | Tiered benefit redemption | Roadmap Wave 4 |
| **skill-panic** | Geolocated panic button | Roadmap Wave 3 |
| **skill-shield** | Family protection when report activated | Roadmap Wave 3 |
| **skill-academy** | Training track | Roadmap Wave 2 |
| **skill-route** | Public heat-map with anonymized position | Roadmap Wave 3 |

Community skills (skill-finance, skill-health, skill-defensive...) and open to developers publishing on **ClawHub-BR** (community registry).

---

## Repository structure

```
OpenBag/
├── docs/                  # Public documentation
│   ├── MANIFESTO.md       # Public manifesto (PT-BR)
│   ├── RFC-001.md / RFC-001-en.md   # Architecture vision
│   ├── RFC-002.md         # Cold start & phases
│   ├── FEATURES-100.md    # Top 100 prioritized features
│   ├── LGPD-analysis.md   # Brazilian data protection compliance
│   ├── OPENCLAW-ALIGNMENT.md  # OpenClaw compatibility map
│   ├── dev-setup.md / dev-setup.en.md  # Dev environment guide
│   └── index.html         # Main landing page
├── spec/                  # 11 detailed technical specs
│   ├── 01-architecture.md through 11-onboarding.md
│   ├── api/               # Gov.br Seal OpenAPI spec
│   └── vc/                # W3C Verifiable Credentials examples
├── sdk/                   # Agent SDK, CLI, reference skills
│   ├── cli/               # openbag CLI (init/validate/test/publish)
│   ├── skills/            # Reference implementations
│   │   ├── skill-verify/
│   │   ├── skill-rep/
│   │   ├── skill-sentinel/
│   │   └── skill-claw-bridge/
│   └── skill-manifest.schema.json
├── apps/                  # Ready-to-use applications
│   ├── verifica/          # Citizen verification PWA
│   └── coverage/          # Coverage heatmap
├── tools/seal-v0/         # Digital Seal v0 generator/verifier
├── assets/                # Brand kit, images
├── registry/              # ClawHub-BR registry seed
└── coalition/             # Coalition partner registry
```

---

## Quick start

```bash
# Clone
git clone https://github.com/OpenBagFoundation/OpenBag.git
cd OpenBag/

# Install SDK CLI
cd sdk/cli && npm install && npm link && cd ../..

# Validate a reference skill
openbag validate sdk/skills/skill-verify/

# Scaffold your own skill
openbag init my-skill

# Run the landing page locally
python3 -m http.server 8080 --directory docs/

# Run the Verifica app locally
python3 -m http.server 8081 --directory apps/verifica/
```

Full dev setup: [docs/dev-setup.en.md](docs/dev-setup.en.md)

---

## Key documents

| Document | Description |
|----------|-------------|
| 📜 [Manifesto](docs/MANIFESTO.md) | Mission and founding values (PT-BR) |
| 📋 [RFC-001 (EN)](docs/RFC-001-en.md) | Full architecture and technical proposal |
| 🚦 [RFC-002](docs/RFC-002.md) | Safe deployment protocol |
| 🗺️ [Top 100 Features](docs/FEATURES-100.md) | Prioritized 100-feature roadmap |
| 🔗 [OpenClaw Alignment](docs/OPENCLAW-ALIGNMENT.md) | OpenClaw compatibility and bridge |
| 🏗️ [Architecture spec](spec/01-architecture.md) | Hardware and digital layers |
| 🤖 [Agent spec](spec/02-agent.md) | Local agent runtime |
| 🧩 [Skill catalogue](spec/03-skills.md) | Modular extension system |
| 🛡️ [Sentinel skill](spec/04-sentinel.md) | Anonymous reporting protocol |
| 🏆 [Civic reputation](spec/05-reputation.md) | Bronze → Diamond tiers |
| 🎓 [OpenBag Academy](spec/06-academy.md) | Training program |
| 🔧 [SDK](sdk/README.md) | Developer SDK and CLI |
| 🤲 [Contributing (EN)](CONTRIBUTING.en.md) | Full contribution guide |
| 🛠️ [Dev Setup (EN)](docs/dev-setup.en.md) | Development environment |
| 📐 [Governance](GOVERNANCE.md) | Decision-making structure |
| 🔒 [Security](SECURITY.md) | Responsible disclosure |

---

## Good first issues

| ID | Area | Description | Difficulty |
|----|------|-------------|------------|
| `#001` | core/spec | Rotating BLE beacon specification | ★★★ |
| `#002` | mobile/ios | Background BLE scanner iOS | ★★ |
| `#003` | hardware | Live badge prototype (e-paper + BLE) | ★★★ |
| `#004` | cv/badge-reader | Optical reading of rotating code | ★★ |
| `#005` | gov/api | Gov.br Seal integration stub | ★ |
| `#006` | docs/i18n | Translate RFCs to Spanish | ★ |
| `#007` | sdk/skills | skill-panic v1 implementation | ★★ |
| `#008` | sdk/skills | skill-rewards v1 implementation | ★★ |
| `#009` | audit/redteam | Bug bounty + STRIDE threat model | ★★★ |
| `#010` | docs/dpia | Write complete DPIA (LGPD Art. 38) | ★★ |

All issues → [GitHub Issues](https://github.com/OpenBagFoundation/OpenBag/issues?q=label%3Agood-first-issue)

---

## OpenClaw alignment

OpenBag is a sibling project of [OpenClaw](https://github.com/openclaw). Shared conventions:

- **Skill manifest format** — SKILL.yaml schema is compatible
- **Lifecycle hooks** — same 9-hook model
- **Permission model** — aligned capability categories
- **Recognition tiers** — Hexagon → Worker Bee → Forager → Drone Engineer → Queen
- **Governance** — Apache Way + OpenClaw Foundation model

See [docs/OPENCLAW-ALIGNMENT.md](docs/OPENCLAW-ALIGNMENT.md) for the full compatibility map and `skill-claw-bridge` for portable reputation.

---

## Community

| Channel | Link |
|---------|------|
| 💬 Discord | [discord.gg/openbag](https://discord.gg/openbag) |
| 📅 Meetup SP | [meetup.com/openbag-sp](https://meetup.com/openbag-sp) |
| 🐛 Issues | [GitHub Issues](https://github.com/OpenBagFoundation/OpenBag/issues) |
| 💡 Discussions | [GitHub Discussions](https://github.com/OpenBagFoundation/OpenBag/discussions) |

---

## License

[MIT License](LICENSE) · forking encouraged · contributions welcome.

---

*"The legitimate bag emits a signal. The legitimate worker is recognized. The criminal is silenced."* 🐝
