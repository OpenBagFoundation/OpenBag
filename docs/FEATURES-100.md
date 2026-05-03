# OpenBag — Next 100 Features

**Version**: 0.2.0 | **Date**: 2026-05-03 | **Status**: Living Document

> 🇬🇧 This document is in English. Feature descriptions use English for international community reach.
> 🇧🇷 Documento vivo — atualizado a cada sprint. Prioridades por impacto/esforço dentro de cada onda.

Features are derived from the OpenBag Manifesto, RFC-001, RFC-002, the 4-pillar
architecture, and the OpenClaw alignment analysis. Ordered within each wave by
impact-to-effort ratio.

---

## Wave 0 — Foundation (Months 1–3) · **SHIPPED** ✅

Core infrastructure and silent launch prerequisites.

| # | Feature | Pillar | Category | Effort | Status |
|---|---------|--------|----------|--------|--------|
| 1 | **Digital Seal v0** — QR-based worker verification, browser-only, CPF hashed client-side | Identity | Core | S | ✅ `tools/seal-v0/` |
| 2 | **Verifica PWA** — citizen-facing mobile app with QR scan, manual code, result, and report screens | Identity | Core | S | ✅ `apps/verifica/` |
| 3 | **Gov.br Seal API** — OpenAPI 3.1 spec: issue, verify, revoke, kill-switch, coverage endpoints | Identity | Core | M | ✅ `spec/api/govbr-seal.openapi.yaml` |
| 4 | **OpenBag Agent spec** — local-first architecture, gateway, skill loader, event bus | Agent | Core | L | ✅ `spec/02-agent.md` + `spec/08-gateway.md` |
| 5 | **SKILL.yaml schema v1** — OpenClaw-compatible flat manifest format with AJV validation | Skills | Core | S | ✅ `sdk/skill-manifest.schema.json` |
| 6 | **openbag CLI v1** — init, validate, test, publish, list, info commands | Skills | Core | S | ✅ `sdk/cli/` |
| 7 | **Agent Gateway spec** — permission enforcer, event bus, encrypted storage API | Agent | Core | L | ✅ `spec/08-gateway.md` |
| 8 | **BLE Beacon spec** — 32-byte rotating hash payload, HMAC-SHA256, nRF52840 reference | Hardware | Core | M | ✅ `spec/07-ble-beacon.md` |
| 9 | **LGPD compliance analysis** — full Art. 7/11/18 mapping, DPIA triggers, DPO role | Governance | Core | M | ✅ `docs/LGPD-analysis.md` |
| 10 | **CI pipeline** — markdownlint + lychee + codespell on GitHub Actions | DevOps | Core | S | ✅ `.github/workflows/ci.yml` |

---

## Wave 1 — Silent Launch α (Months 2–4) · **9 of 11 SHIPPED** ✅

Operational features for the first 500 workers in the Heliópolis-Sacomã polygon.

| # | Feature | Pillar | Category | Effort | Status |
|---|---------|--------|----------|--------|--------|
| 11 | **Agent onboarding flow** — Gov.br OAuth, DID generation, biometric, hardware pairing UX | Identity | Core | M | ✅ `spec/11-onboarding.md` |
| 12 | **NFC bag seal** — write worker DID + seal hash to NTAG216; verify on NFC tap | Hardware | Core | M | Firmware pending |
| 13 | **BLE rotating beacon v1** — nRF52840 firmware, HMAC-SHA256 rotating hash, 5 min TTL | Hardware | Core | L | Spec ✅; firmware pending |
| 14 | **skill-rep v1** — Bronze/Prata/Ouro/Diamante tier engine, event aggregation | Reputation | Core | M | ✅ `sdk/skills/skill-rep/` |
| 15 | **skill-verify v1** — citizen-triggered verification event handler, NFC+BLE+QR | Identity | Core | S | ✅ `sdk/skills/skill-verify/` |
| 16 | **skill-sentinel v1** — anonymous incident reporting, mixnet-routed, 3-layer protection | Safety | Core-Sensitive | M | ✅ `sdk/skills/skill-sentinel/` |
| 17 | **Coverage map** — geohash-based coverage visualization, seeded with α polygon | Infrastructure | Core | M | ✅ `apps/coverage/` |
| 18 | **Platform integration guide** — iFood/Rappi/Keeta/Uber Eats integration playbook | Platforms | Core | M | ✅ `docs/PLATFORM-INTEGRATION.md` |
| 19 | **W3C VC examples** — JSON-LD context + 5 credential type templates | Identity | Core | S | ✅ `spec/vc/` |
| 20 | **ClawHub-BR registry seed** — `index.json` + 4 core skill entries (+ skill-claw-bridge) | Skills | Core | S | ✅ `registry/` |
| 21 | **skill-claw-bridge v1** — portable reputation bridge between OpenBag and OpenClaw | Interop | Community | M | ✅ `sdk/skills/skill-claw-bridge/` |

---

## Wave 2 — Horizontal Expansion (Months 3–6)

Scale from 500 to 10,000 workers across São Paulo.

| # | Feature | Pillar | Category | Effort |
|---|---------|--------|----------|--------|
| 22 | **Multi-platform reputation aggregation** — weighted score across 5+ platforms | Reputation | Core | M |
| 23 | **skill-academy v1** — module browser, quiz engine, completion certificate VC | Academy | Core | L |
| 24 | **e-paper display firmware** — live QR on e-paper badge, BLE sync from Agent | Hardware | Core | L |
| 25 | **Mentor-mentee protocol** — BLE pairing, mentorship credential, reputation boost | Reputation | Core | M |
| 26 | **ClawHub-BR registry v0** — GitHub-based registry UI, CI review pipeline | Skills | Core | M |
| 27 | **skill-platform-sync** — periodic reputation event pull from platform APIs | Platforms | Community | M |
| 28 | **skill-finance v1** — micro-credit eligibility check via Caixa API stub | Finance | Community | M |
| 29 | **Verifiable Credentials issuance** — Foundation-signed W3C VC for worker seal + affiliation | Identity | Core | L |
| 30 | **DID-based presentation** — VP QR code with challenge-response anti-replay | Identity | Core | M |
| 31 | **Offline verification mode** — Ed25519 signature check in browser without internet | Identity | Core | M |

---

## Wave 3 — Hardware & Safety (Months 4–8)

Physical layer hardening and safety features.

| # | Feature | Pillar | Category | Effort |
|---|---------|--------|----------|--------|
| 32 | **OpenBag Hardware v1 PCB** — nRF5340 + NFC + e-paper + Li-Ion, PCBA design | Hardware | Core | XL |
| 33 | **Anti-tamper seal** — holographic sticker + NFC kill-switch if bag opened | Hardware | Core | L |
| 34 | **CIOPS-SP integration** — Sentinel module: escalate verified incident to civil police | Safety | Core-Sensitive | L |
| 35 | **SAMU dispatch link** — panic button → SAMU API → ambulance dispatch + location | Safety | Core-Sensitive | L |
| 36 | **BLE mesh relay** — hop-based relay for offline areas (favelas, underground) | Infrastructure | Core | L |
| 37 | **GPS route logging** — encrypted local route history, opt-in, LGPD-compliant | Routes | Core | M |
| 38 | **skill-route v1** — route start/end lifecycle, ETA, delivery count | Routes | Community | M |
| 39 | **Battery-optimized BLE** — adaptive advertising interval based on battery level | Hardware | Core | M |
| 40 | **Emergency contact notification** — SMS to pre-set contact on panic activation | Safety | Core-Sensitive | S |
| 41 | **Fake bag detection** — Sentinel heuristics: bag with no valid beacon = alert | Safety | Core-Sensitive | L |

---

## Wave 4 — Ecosystem & Marketplace (Months 6–12)

Community ecosystem and financial inclusion.

| # | Feature | Pillar | Category | Effort |
|---|---------|--------|----------|--------|
| 42 | **ClawHub-BR v1** — public registry UI, search, trust tier badges, browser install | Skills | Core | L |
| 43 | **skill-rewards v1** — points accumulation, Pix cashback via Caixa/BB | Finance | Community | L |
| 44 | **skill-insurance** — BB Seguros accident insurance via reputation tier | Finance | Community | L |
| 45 | **Sebrae MEI onboarding** — step-by-step MEI registration via skill-academy | Academy | Community | M |
| 46 | **skill-health** — SAMU pre-registration, blood type, emergency contacts | Safety | Community | S |
| 47 | **skill-weather** — route-aware weather alerts, rain gear reminders | Utility | Community | S |
| 48 | **skill-transit** — SPTrans/METRO delay alerts for multimodal deliveries | Utility | Community | S |
| 49 | **skill-community** — neighborhood watch: report suspicious bags via citizen mesh | Safety | Community | M |
| 50 | **Platform API standardization** — OpenAPI 3.1 spec for all 5 major platforms | Platforms | Core | L |
| 51 | **Worker earnings dashboard** — aggregated earnings across platforms (read-only) | Finance | Community | M |

---

## Wave 5 — Civic & Government (Months 8–18)

Brazilian government system integration.

| # | Feature | Pillar | Category | Effort |
|---|---------|--------|----------|--------|
| 52 | **DETRAN-SP driving record** — link CNH to worker profile, verify via DETRAN API | Identity | Core | L |
| 53 | **Bolsa Família linkage** — verify eligibility for social benefit retention | Finance | Core-Sensitive | L |
| 54 | **PIX instant payment proof** — verify delivery payment receipt via BACEN Open Finance | Finance | Community | M |
| 55 | **Municipal permit integration** — SP Prefeitura delivery zone permits | Infrastructure | Community | L |
| 56 | **Federal Highway Police** — worker route verification for interstate deliveries | Safety | Core | L |
| 57 | **Receita Federal CPF validation** — real-time CPF status check (active/suspended) | Identity | Core | M |
| 58 | **Gov.br Seal v1 — biometric** — add facial recognition step to seal issuance | Identity | Core-Sensitive | L |
| 59 | **Open Data API** — aggregate anonymized coverage + verification stats for researchers | Infrastructure | Core | M |
| 60 | **Prefeitura SP pilot** — official MOU with SP city hall for policy integration | Governance | Core | XL |
| 61 | **National expansion spec** — RFC-003: expand OpenBag standard to RJ, BH, Manaus | Infrastructure | Core | L |

---

## Wave 6 — Developer Platform (Months 6–18)

Tools and SDKs for third-party developers.

| # | Feature | Pillar | Category | Effort |
|---|---------|--------|----------|--------|
| 62 | **Gateway SDK** — JSI bridge for React Native, platform channel for Flutter | Agent | Core | L |
| 63 | **Skill simulator** — local mock of Gateway APIs for skill development without hardware | Skills | Core | M |
| 64 | **skill-template library** — 5 reference skill templates (webhook, BLE, NFC, API, combo) | Skills | Core | M |
| 65 | **TypeScript types package** — `@openbag/types` for manifests + API types | Skills | Core | S |
| 66 | **openbag-js SDK** — browser/Node.js SDK for Verifica app integrations | Identity | Core | M |
| 67 | **Webhook skill type** — skill that registers a webhook, receives platform events | Skills | Community | M |
| 68 | **skill-debug** — developer skill showing live Gateway event stream | Skills | Experimental | S |
| 69 | **Skill marketplace analytics** — installs, error rates, permission grant rates | Skills | Core | M |
| 70 | **Automated skill scoring** — code quality + permission-minimality score in CI | Skills | Core | M |
| 71 | **Foundation skill audit kit** — checklist + tooling for foundation-tier skill review | Skills | Core | M |

---

## Wave 7 — Reputation & Academy Depth (Months 9–18)

Richer reputation system and Academy platform.

| # | Feature | Pillar | Category | Effort |
|---|---------|--------|----------|--------|
| 72 | **Reputation portability VC** — export full reputation history as W3C VC | Reputation | Core | M |
| 73 | **Negative event appeals** — worker can contest a reputation event within 72h | Reputation | Core | M |
| 74 | **Peer reputation** — workers rate each other (mesh deliveries, handoffs) | Reputation | Community | L |
| 75 | **Academy v2 — video** — short-form video lessons (yt-dlp offline cache) | Academy | Community | L |
| 76 | **Academy v2 — live sessions** — scheduled group sessions with facilitators | Academy | Community | L |
| 77 | **skill-academy-quiz-builder** — tool for creating custom Academy quizzes | Academy | Community | L |
| 78 | **Tier progression visualization** — animated tier journey in Agent UI | Reputation | Core | S |
| 79 | **Reputation API for platforms** — platforms query worker tier (with worker consent) | Reputation | Core | M |
| 80 | **Anonymous reputation benchmarking** — "top 20% of iFood workers in SP" | Reputation | Community | M |
| 81 | **Reputation staking** — Ouro workers stake reputation to vouch for newcomers | Reputation | Experimental | L |

---

## Wave 8 — Hardware Ecosystem (Months 12–24)

Certified hardware partners and supply chain.

| # | Feature | Pillar | Category | Effort |
|---|---------|--------|----------|--------|
| 82 | **Hardware certification program** — spec + test suite for third-party OpenBag hardware | Hardware | Core | L |
| 83 | **OpenBag Hardware v2** — improved PCB: USB-C charging, 7-day battery, IP67 | Hardware | Core | XL |
| 84 | **Bag manufacturer partnership** — integration spec for bag manufacturers | Hardware | Core | L |
| 85 | **NFC relay attack prevention** — distance bounding protocol for NFC verification | Hardware | Core | L |
| 86 | **Hardware provisioning tool** — factory flash tool + QA test harness | Hardware | Core | M |
| 87 | **OTA firmware update** — signed firmware updates via BLE from Agent | Hardware | Core | L |
| 88 | **Hardware rental marketplace** — platform for workers to rent OpenBag hardware | Finance | Community | L |
| 89 | **Battery health monitoring** — track battery cycles, alert when replacement needed | Hardware | Core | S |
| 90 | **Solar charging support** — power management spec for solar panel integration | Hardware | Experimental | M |
| 91 | **Multi-bag support** — worker can register multiple bags (cargo bike, car) | Hardware | Core | M |

---

## Wave 9 — Scale, Resilience & OpenClaw Convergence (Months 18–36)

National scale, long-term resilience, and deep OpenClaw integration.

| # | Feature | Pillar | Category | Effort |
|---|---------|--------|----------|--------|
| 92 | **Federated Foundation nodes** — multiple independent Foundation API nodes | Infrastructure | Core | XL |
| 93 | **DID federation** — bridge `did:openbag` ↔ `did:web`, `did:key`, `did:claw` | Identity | Core | L |
| 94 | **Cross-country portability** — worker seal valid in PT, AR, CO (LATAM expansion) | Identity | Core | XL |
| 95 | **Zero-knowledge reputation proof** — prove tier ≥ Prata without revealing score | Reputation | Experimental | XL |
| 96 | **Decentralized revocation** — IPFS-based credential revocation list | Identity | Experimental | L |
| 97 | **OpenBag governance DAO** — on-chain governance for ClawHub-BR registry rules | Governance | Experimental | XL |
| 98 | **skill-ai-assistant** — local LLM assistant for worker queries (privacy-safe) | Agent | Experimental | XL |
| 99 | **Accessibility — screen reader** — full VoiceOver/TalkBack support in Verifica + Agent | Accessibility | Core | L |
| 100 | **OpenBag Foundation v1.0** — formal TSC, bylaws, CNPJ, legal constitution | Governance | Core | L |

---

## Appendix: Effort key

| Code | Estimate |
|------|---------|
| S | < 1 week |
| M | 1–3 weeks |
| L | 1–2 months |
| XL | 2–6 months |

## Priority rules

Features marked **Core** or **Core-Sensitive** are Foundation-maintained and require TSC approval.
Features marked **Community** or **Experimental** can be contributed by any developer via ClawHub-BR.

Priority order (from the Manifesto):
1. **Worker safety** always first
2. **Identity integrity** — "presence proves, absence does not condemn"
3. **Civic reputation** — portability and fairness
4. **Financial inclusion** — Academy, MEI, microcrédito
5. **Ecosystem growth** — ClawHub-BR, developer tools
6. **OpenClaw convergence** — interoperability and DID federation

For implementation details, see the relevant spec files in `/spec/` and
[docs/OPENCLAW-ALIGNMENT.md](OPENCLAW-ALIGNMENT.md) for the OpenClaw bridge roadmap.
