# OpenBag — Next 100 Features

**Version**: 0.1.0 | **Date**: 2026-04 | **Status**: Planning

This document lists the 100 highest-priority features derived from the OpenBag Manifesto, RFC-001, RFC-002, and the 4-pillar architecture. Features are ordered within each wave by impact-to-effort ratio.

---

## Wave 0 — Foundation (Months 1–3)

Core infrastructure and silent launch prerequisites. Must ship before Phase α public reveal.

**Status: SHIPPED** (2026-04, this branch).

| # | Feature | Pillar | Category | Effort | Status |
|---|---------|--------|----------|--------|--------|
| 1 | **Digital Seal v0** — QR-based worker verification, browser-only, CPF hashed client-side | Identity | Core | S | ✅ `tools/seal-v0/` |
| 2 | **Verifica PWA** — citizen-facing mobile app to scan/verify worker seals | Identity | Core | S | ✅ `apps/verifica/` |
| 3 | **Gov.br Seal API** — OpenAPI 3.1 spec: issue, verify, kill-switch, coverage | Identity | Core | M | ✅ `spec/api/govbr-seal.openapi.yaml` |
| 4 | **OpenBag Agent spec** — local-first architecture, gateway, skill loader | Agent | Core | L | ✅ `spec/02-agent.md`, `spec/08-gateway.md` |
| 5 | **SKILL.yaml schema v1** — OpenClaw flat manifest format, AJV validation | Skills | Core | S | ✅ `sdk/skill-manifest.schema.json` |
| 6 | **openbag CLI v1** — init, validate, test, publish, list, info commands | Skills | Core | S | ✅ `sdk/cli/` |
| 7 | **Agent Gateway spec** — permission enforcer, event bus, storage API | Agent | Core | L | ✅ `spec/08-gateway.md` |
| 8 | **BLE Beacon spec** — 32-byte rotating hash payload, nRF52840 reference | Hardware | Core | M | ✅ `spec/07-ble-beacon.md` |
| 9 | **LGPD compliance analysis** — full Art. 7/11/18 mapping, DPIA triggers, DPO | Governance | Core | M | ✅ `docs/LGPD-analysis.md` |
| 10 | **CI pipeline** — markdownlint + lychee + codespell on GitHub Actions | DevOps | Core | S | ✅ `.github/workflows/ci.yml` |

---

## Wave 1 — Silent Launch α (Months 2–4, Heliópolis-Sacomã polygon)

Operational features for the first 500 workers in the Phase α polygon.

**Status: 7 of 10 SHIPPED** (this branch). Remaining 3 are firmware/hardware-bound.

| # | Feature | Pillar | Category | Effort | Status |
|---|---------|--------|----------|--------|--------|
| 11 | **Agent onboarding flow** — Gov.br OAuth, DID generation, biometric, hardware pairing | Identity | Core | M | ✅ `spec/11-onboarding.md` |
| 12 | **NFC bag seal** — write worker DID + seal hash to NTAG216 sticker, verify on scan | Hardware | Core | M | hardware/firmware |
| 13 | **BLE rotating beacon v1** — firmware for nRF52840, HMAC-SHA256 rotating hash | Hardware | Core | L | spec ✅ `spec/07-ble-beacon.md`; firmware pending |
| 14 | **skill-rep v1** — reputation engine, Bronze/Prata/Ouro/Diamante tier calculation | Reputation | Core | M | ✅ `sdk/skills/skill-rep/` |
| 15 | **skill-verify v1** — citizen-triggered verification event handler | Identity | Core | S | ✅ `sdk/skills/skill-verify/` |
| 16 | **skill-sentinel v1** — anonymous incident reporting, mixnet-routed | Safety | Core-Sensitive | M | ✅ `sdk/skills/skill-sentinel/` |
| 17 | **Coverage map** — geohash-based coverage visualization, seeded with α polygon | Infrastructure | Core | M | ✅ `apps/coverage/` |
| 18 | **Platform integration guide** — iFood/Rappi/Keeta integration playbook | Platforms | Core | M | ✅ `docs/PLATFORM-INTEGRATION.md` |
| 19 | **W3C VC examples** — JSON-LD context + worker-seal/affiliation/academy templates | Identity | Core | S | ✅ `spec/vc/` |
| 20 | **ClawHub-BR registry seed** — `index.json` + 3 core skill entries | Skills | Core | S | ✅ `registry/` |

---

## Wave 2 — Horizontal Expansion (Months 3–6)

Scale from 500 to 10,000 workers across São Paulo city.

| # | Feature | Pillar | Category | Effort |
|---|---------|--------|----------|--------|
| 21 | **Multi-platform reputation aggregation** — weighted score across 5+ platforms | Reputation | Core | M |
| 22 | **skill-academy v1** — module browser, quiz engine, completion certificate VC | Academy | Core | L |
| 23 | **e-paper display firmware** — live QR on e-paper badge, BLE sync from Agent | Hardware | Core | L |
| 24 | **Mentor-mentee protocol** — BLE pairing, mentorship credential, reputation boost | Reputation | Core | M |
| 25 | **ClawHub-BR registry v0** — GitHub-based registry, index.json, CI review | Skills | Core | M |
| 26 | **skill-platform-sync** — periodic reputation event pull from platform APIs | Platforms | Community | M |
| 27 | **skill-finance v1** — micro-credit eligibility check via Caixa API stub | Finance | Community | M |
| 28 | **Verifiable Credentials issuance** — W3C VC format for worker seal + platform affiliation | Identity | Core | L |
| 29 | **DID-based presentation** — VP QR code with challenge-response anti-replay | Identity | Core | M |
| 30 | **Offline verification mode** — Ed25519 signature check in browser without internet | Identity | Core | M |

---

## Wave 3 — Hardware & Safety (Months 4–8)

Physical layer hardening and safety features.

| # | Feature | Pillar | Category | Effort |
|---|---------|--------|----------|--------|
| 31 | **OpenBag Hardware v1 PCB** — nRF5340 + NFC + e-paper + Li-Ion, PCBA design | Hardware | Core | XL |
| 32 | **Anti-tamper seal** — holographic sticker + NFC kill-switch if bag opened | Hardware | Core | L |
| 33 | **CIOPS-SP integration** — Sentinel module: escalate verified incident to civil police | Safety | Core-Sensitive | L |
| 34 | **SAMU dispatch link** — panic button → SAMU API → ambulance dispatch + location | Safety | Core-Sensitive | L |
| 35 | **BLE mesh relay** — hop-based relay for offline areas (favelas, underground) | Infrastructure | Core | L |
| 36 | **GPS route logging** — encrypted local route history, opt-in, LGPD-compliant | Routes | Core | M |
| 37 | **skill-route v1** — route start/end lifecycle, ETA, delivery count | Routes | Community | M |
| 38 | **Battery-optimized BLE** — adaptive advertising interval based on battery level | Hardware | Core | M |
| 39 | **Emergency contact notification** — SMS to pre-set contact on panic activation | Safety | Core-Sensitive | S |
| 40 | **Fake bag detection** — Sentinel heuristics: bag with no valid beacon = alert | Safety | Core-Sensitive | L |

---

## Wave 4 — Ecosystem & Marketplace (Months 6–12)

Community, developer ecosystem, and financial inclusion.

| # | Feature | Pillar | Category | Effort |
|---|---------|--------|----------|--------|
| 41 | **ClawHub-BR v1** — public registry UI, search, trust tier badges, install from browser | Skills | Core | L |
| 42 | **skill-rewards v1** — points accumulation, Pix cashback via Caixa/BB | Finance | Community | L |
| 43 | **skill-insurance** — BB Seguros accident insurance via reputation tier | Finance | Community | L |
| 44 | **Sebrae MEI onboarding** — step-by-step MEI registration via skill-academy | Academy | Community | M |
| 45 | **skill-health** — SAMU pre-registration, blood type, emergency contacts | Safety | Community | S |
| 46 | **skill-weather** — route-aware weather alerts, rain gear reminders | Utility | Community | S |
| 47 | **skill-transit** — SPTrans/METRO delay alerts for multimodal deliveries | Utility | Community | S |
| 48 | **skill-community** — neighborhood watch: report suspicious bags via citizen mesh | Safety | Community | M |
| 49 | **Platform API standardization** — OpenAPI 3.1 spec for all 5 major platforms | Platforms | Core | L |
| 50 | **Worker earnings dashboard** — aggregated earnings across platforms (read-only) | Finance | Community | M |

---

## Wave 5 — Civic & Government (Months 8–18)

Integration with Brazilian government systems and civic infrastructure.

| # | Feature | Pillar | Category | Effort |
|---|---------|--------|----------|--------|
| 51 | **DETRAN-SP driving record** — link CNH to worker profile, verify via DETRAN API | Identity | Core | L |
| 52 | **Bolsa Família linkage** — verify eligibility status for social benefit retention | Finance | Core-Sensitive | L |
| 53 | **PIX instant payment proof** — verify delivery payment receipt via BACEN Open Finance | Finance | Community | M |
| 54 | **Municipal permit integration** — SP Prefeitura delivery zone permits | Infrastructure | Community | L |
| 55 | **Federal Highway Police** — worker route verification for interstate deliveries | Safety | Core | L |
| 56 | **Receita Federal CPF validation** — real-time CPF status check (active/suspended) | Identity | Core | M |
| 57 | **Gov.br Seal v1 — biometric** — add facial recognition step to seal issuance | Identity | Core-Sensitive | L |
| 58 | **Open Data API** — aggregate anonymized coverage + verification stats for researchers | Infrastructure | Core | M |
| 59 | **Prefeitura SP pilot** — official MOU with SP city hall for policy integration | Governance | Core | XL |
| 60 | **National expansion spec** — RFC-003: expand OpenBag standard to RJ, BH, Manaus | Infrastructure | Core | L |

---

## Wave 6 — Developer Platform (Months 6–18)

Tools, SDKs, and integrations for third-party developers.

| # | Feature | Pillar | Category | Effort |
|---|---------|--------|----------|--------|
| 61 | **Gateway SDK** — JSI bridge for React Native, platform channel for Flutter | Agent | Core | L |
| 62 | **Skill simulator** — local mock of Gateway APIs for skill development without hardware | Skills | Core | M |
| 63 | **skill-template library** — 5 reference skill templates (webhook, BLE, NFC, API, combo) | Skills | Core | M |
| 64 | **TypeScript types package** — `@openbag/types` — all manifest + API types | Skills | Core | S |
| 65 | **openbag-js SDK** — browser/Node.js SDK for Verifica app integrations | Identity | Core | M |
| 66 | **Webhook skill type** — skill that registers a webhook endpoint, receives events | Skills | Community | M |
| 67 | **skill-debug** — developer skill showing live Gateway event stream | Skills | Experimental | S |
| 68 | **Skill marketplace analytics** — installs, error rates, permission grant rates | Skills | Core | M |
| 69 | **Automated skill scoring** — code quality + permission-minimality score in CI | Skills | Core | M |
| 70 | **Foundation skill audit kit** — checklist + tooling for foundation-tier skill audit | Skills | Core | M |

---

## Wave 7 — Reputation & Academy Depth (Months 9–18)

Enrich the reputation system and Academy platform.

| # | Feature | Pillar | Category | Effort |
|---|---------|--------|----------|--------|
| 71 | **Reputation portability** — export reputation history as W3C VC to new platforms | Reputation | Core | M |
| 72 | **Negative event appeals** — worker can contest a reputation event within 72h | Reputation | Core | M |
| 73 | **Peer reputation** — workers rate each other (mesh deliveries, handoffs) | Reputation | Community | L |
| 74 | **Academy v2 — video** — short-form video lessons (yt-dlp offline cache) | Academy | Community | L |
| 75 | **Academy v2 — live sessions** — scheduled group sessions with facilitators | Academy | Community | L |
| 76 | **skill-academy-quiz-builder** — platform tool for creating custom quizzes | Academy | Community | L |
| 77 | **Tier progression visualization** — animated tier journey in Agent UI | Reputation | Core | S |
| 78 | **Reputation API for platforms** — platforms query worker tier (with worker consent) | Reputation | Core | M |
| 79 | **Anonymous reputation benchmarking** — "you're in top 20% of iFood workers in SP" | Reputation | Community | M |
| 80 | **Reputation staking** — Ouro workers can stake reputation to vouch for newcomers | Reputation | Experimental | L |

---

## Wave 8 — Hardware Ecosystem (Months 12–24)

Certified hardware partners and supply chain.

| # | Feature | Pillar | Category | Effort |
|---|---------|--------|----------|--------|
| 81 | **Hardware certification program** — spec + test suite for third-party OpenBag hardware | Hardware | Core | L |
| 82 | **OpenBag Hardware v2** — improved PCB: USB-C charging, 7-day battery, IP67 | Hardware | Core | XL |
| 83 | **Bag manufacturer partnership** — integration spec for bag manufacturers | Hardware | Core | L |
| 84 | **NFC relay attack prevention** — distance bounding protocol for NFC verification | Hardware | Core | L |
| 85 | **Hardware provisioning tool** — factory flash tool + QA test harness | Hardware | Core | M |
| 86 | **OTA firmware update** — signed firmware updates via BLE from Agent | Hardware | Core | L |
| 87 | **Hardware rental marketplace** — platform for workers to rent OpenBag hardware | Finance | Community | L |
| 88 | **Battery health monitoring** — track battery cycles, alert when replacement needed | Hardware | Core | S |
| 89 | **Solar charging support** — power management spec for solar panel integration | Hardware | Experimental | M |
| 90 | **Multi-bag support** — worker can register multiple bags (cargo bike, car) | Hardware | Core | M |

---

## Wave 9 — Scale & Resilience (Months 18–36)

Infrastructure for national scale and long-term resilience.

| # | Feature | Pillar | Category | Effort |
|---|---------|--------|----------|--------|
| 91 | **Federated Foundation nodes** — multiple independent Foundation API nodes | Infrastructure | Core | XL |
| 92 | **DID federation** — bridge `did:openbag` method with `did:web` and `did:key` | Identity | Core | L |
| 93 | **Cross-country portability** — worker seal valid in PT, AR, CO (LatAm expansion) | Identity | Core | XL |
| 94 | **Zero-knowledge reputation proof** — prove tier ≥ Prata without revealing score | Reputation | Experimental | XL |
| 95 | **Decentralized revocation** — IPFS-based credential revocation list | Identity | Experimental | L |
| 96 | **OpenBag governance DAO** — on-chain governance for ClawHub-BR registry rules | Governance | Experimental | XL |
| 97 | **skill-ai-assistant** — local LLM assistant for worker queries (privacy-safe) | Agent | Experimental | XL |
| 98 | **Accessibility — screen reader** — full VoiceOver/TalkBack support in Verifica + Agent | Accessibility | Core | L |
| 99 | **Multi-language support** — en, es, ht (Haitian Creole) in addition to pt-BR | Accessibility | Core | M |
| 100 | **OpenBag Foundation v1.0 governance** — formal TSC, bylaws, CNPJ registration | Governance | Core | L |

---

## Effort Key

| Code | Estimate |
|------|---------|
| S | < 1 week |
| M | 1–3 weeks |
| L | 1–2 months |
| XL | 2–6 months |

## Priority Notes

Features marked **Core** or **Core-Sensitive** are Foundation-maintained and require TSC approval. Features marked **Community** or **Experimental** can be contributed by any developer via ClawHub-BR.

The ordering within each wave reflects the manifesto's priority: **worker safety first**, then **identity integrity**, then **reputation**, then **financial inclusion**, then **ecosystem growth**.

For implementation details on each feature category, see the relevant spec files in `/spec/`.
