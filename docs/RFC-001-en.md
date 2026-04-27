# RFC-001 · OpenBag Overview (English)

> **Translator's note**: This is a faithful English translation of [`RFC-001.md`](RFC-001.md) (Portuguese). In case of any discrepancy, the Portuguese version is authoritative. Key terms in Portuguese are preserved in parentheses where culturally significant.

| Field | Value |
|-------|-------|
| **Status** | Public Discussion Draft |
| **Version** | v1.0 |
| **Authors** | OpenBag Contributors |
| **Date** | 2026-04 |
| **License** | MIT |
| **Category** | Architecture · Identity · Last-mile delivery |

---

## Summary

OpenBag is a public standard for **verifiable identity, personal agent, and civic reputation** for platform-based last-mile delivery workers (entregadores). It combines three technical layers (digital, physical, wearable) with a locally-running personal agent extensible via skills, and a tiered civic reputation system with tangible material benefits.

This RFC defines the **overall architecture** and references subsequent RFCs for each component.

---

## Motivation

Recent cases in São Paulo reveal a systemic pattern: criminals exploit the verification vacuum in the delivery economy to approach victims, with a rising rate of homicides and robberies. The delivery worker category suffers a double penalty: reputational victims (unwarranted searches, public hostility) and statistical ones (53% rely on platform work as their sole source of income; revenue losses due to insecurity).

iFood has publicly stated it "does not require the use of branded bags to make deliveries." Keeta admits "the bags are numbered and connected to the registration number" — but no platform exposes universal verification to citizens. The system exists partially, but remains private, non-auditable, and non-portable across platforms.

This RFC proposes a **public, auditable, and portable** standard to solve the problem at its root.

---

## Architecture · Overview

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│        ┌─────────────────────────────────────┐          │
│        │   Gov.br Seal (certifying authority) │          │
│        │   Sovereign Identity · Pillar 01    │          │
│        └────────────────┬────────────────────┘          │
│                         │                               │
│             ┌───────────┴────────────┐                  │
│             │                        │                  │
│   ┌─────────▼──────────┐  ┌──────────▼──────────┐       │
│   │ Inviolable         │  │ Live Badge          │       │
│   │ Equipment (NFC +   │  │ E-paper display +   │       │
│   │ BLE + e-paper)     │  │ GPS + panic button  │       │
│   │ Pillar 02          │  │ Pillar 03           │       │
│   └─────────┬──────────┘  └──────────┬──────────┘       │
│             │                        │                  │
│             └────────────┬───────────┘                  │
│                          │                              │
│              ┌───────────▼────────────┐                 │
│              │ OpenBag Agent          │                 │
│              │ (local · MIT · skills) │                 │
│              │ Pillar 04 · personal   │                 │
│              └────────────────────────┘                 │
│                                                         │
└─────────────────────────────────────────────────────────┘

External actors:
  - Citizen (App Verifica · guest mode)
  - SSP / CIOPS / Detecta-SP (integration)
  - Platforms (iFood, Rappi, Keeta · API)
  - Delivery worker (beneficiary · agent operator)
```

---

## Pillar 01 · Sovereign Identity

**Anchor**: Gov.br · Serpro · ITI

The OpenBag Seal is issued as a digital wallet credential at Gov.br Gold Level. It links:
- CPF (Brazil's individual taxpayer ID — masked in public verification)
- Live facial biometrics (Serpro registry)
- Criminal record check (SINESP query at issuance time)
- Linked platforms (active API)
- Equipment (chip paired to CPF)

**Publicly observable statuses**:
- `ATIVO` — valid seal
- `EM_ROTA` — worker on an active delivery route
- `SUSPENSO` — temporary suspension (report under investigation, etc.)
- `REVOGADO` — seal terminated (kill switch propagated)

**Kill switch**: revocation propagates in <30 seconds across the entire ecosystem. Operable by:
- Platform (deactivation)
- Citizen (upheld report confirmed by CIOPS)
- Worker (self-revocation in case of equipment theft)
- Foundation (in case of confirmed compromise)

Details in `spec/01-architecture.md`.

---

## Pillar 02 · Inviolable Equipment

**Spec**: OpenBag Foundation · certified OEMs

Bag, helmet, and vest designed as cryptographically signed hardware:

- **NFC chip with Secure Element** — non-extractable private key, passport-grade standard. Destructive cloning would require a ~US$50k laboratory.
- **BLE beacon with rotating hash** — broadcasts every 30 seconds, ~30m radius, anti-replay. Enables distance verification.
- **Dynamic QR Code on e-paper** — rotates every 5 minutes. Photo/screenshot capture becomes useless.
- **Electronic seal** — automatic alert if the bag is removed from the vehicle without biometric de-authentication.
- **UV-reactive holographic seal** — low-cost barrier against artisanal counterfeiting.

Industrial custody chain: centralised manufacturing with unique serial numbering; activation only after Gov.br pairing.

Details in `spec/01-architecture.md` and RFC-002 (BLE protocol).

---

## Pillar 03 · Live Badge (Crachá Vivo)

**Integration**: Platforms · SSP

A magnetic badge affixed to the vest, functioning as a public traffic light:

- **Large e-paper display** (front + back) with colour (green/yellow/red), icon, rotating 4-digit code
- **Readable at 15 m with the naked eye**, no app, no additional technology
- **Biometric activation**: activates only with live facial match of the owning CPF
- **Panic button** integrated with state CIOPS (Command and Control Centre) via dedicated channel
- **Built-in GPS** independent of the phone (anti-theft)
- **60+ day battery life**

Details in `spec/01-architecture.md`.

---

## Pillar 04 · OpenBag Agent (personal agent)

**Concept inspired by OpenClaw**: each legitimate delivery worker runs a personal agent locally — MIT-licensed software on their own smartphone — that defends their interests, accumulates their portable civic reputation, receives missions, and offers modular skills that the community can contribute.

Core principles:

1. **Local-first** — sensitive data (biometrics, submitted reports, routes, history) **never leaves the device**. The agent only communicates encrypted results.
2. **Privacy by design** — platforms cannot see it; governments cannot see it; the Foundation cannot see it.
3. **Portability** — the agent travels with the worker when they switch platforms.
4. **Extensibility** — modular Skills in the OpenClaw standard allow community extension.

### Native skills (provisioned by Foundation)

| Skill | Function | Status |
|-------|----------|--------|
| `skill-verify` | Citizen verification via NFC, BLE, or camera | core |
| `skill-sentinel` | Protected anonymous reporting | core sensitive |
| `skill-rep` | Civic reputation (tier calculation) | core |
| `skill-rewards` | Tiered benefits redemption | core |
| `skill-panic` | Geo-referenced panic button | core |
| `skill-shield` | Family protection when report is active | core sensitive |
| `skill-academy` | Training track | core |
| `skill-route` | Public heat-map with anonymised position | core |

### Community skills (publishable on ClawHub-BR)

Developers can publish skills to the ClawHub-BR community registry, following a manifest standard similar to OpenClaw. Examples in development:

- `skill-finance` — financial education via Sebrae
- `skill-health` — occupational health via UFRJ-COPPE
- `skill-defensive` — defensive driving via SENAI

Details in `spec/02-agent.md` and `spec/03-skills.md`.

---

## Distance verification · operational trifecta

Citizen verification must not require physical proximity to the suspect. Five mechanisms cover the spectrum from 30 m to invisible-automatic:

| Layer | Mechanism | Radius | UX |
|-------|-----------|--------|-----|
| **A · Passive** | BLE beacon detection | ~30 m | App listens passively |
| **B · Visual** | Traffic-light badge | ~15 m | Naked eye |
| **C · Map** | Public heat-map | any | App shows active workers |
| **D · Optical** | CV via camera | ~20 m | Point camera with zoom |
| **E · Invisible** | Detecta-SP × CV | any | Automatic, no citizen action |

The combination **BLE + Traffic light + Public Map** is redundant by design — defeating it requires defeating all three.

Details in `spec/01-architecture.md`.

---

## Skill Sentinel · 3-layer protected reporting

Addressing the fact that many honest delivery workers (entregadores) know fraudsters in their own community but fear retaliation:

| Layer | Mechanism | Inspiration |
|-------|-----------|-------------|
| **01 · Technical** | Cryptographic anonymity (mixnet, onion routing, no IP logs) | Tor Project |
| **02 · Operational** | Human anonymity (operators do not request CPF, hash-based tracking protocol) | Disque-Denúncia 181 |
| **03 · Physical** | Shield Programme (relocation, family protection, psychosocial support) | PROVITA · SENASP |

Details in `spec/04-sentinel.md`.

---

## Civic Reputation · 4 tiers

A tiered system with material benefits at each level:

| Tier | Criteria | Key benefits |
|------|----------|-------------|
| **Bronze** | Seal issued, no incidents for 30 days | Active verification, simplified Caixa microcredit |
| **Prata** (Silver) | 6 months active + 1st upheld report OR 1,000 verified incident-free interactions | R$80/month bonus, 30% health plan discount (BB Seguros) |
| **Ouro** (Gold) | 12 months + 3+ upheld reports + mentoring others | R$200/month bonus, free family health plan, priority CLT (formal employment) vacancies |
| **Diamante** (Diamond) | 24+ months, proven leadership, real risk assumed | Guaranteed CLT track (iFood Logística, Mercado Livre, Magalu), university scholarship, Foundation Board seat |

Details in `spec/05-reputation.md`.

---

## OpenBag Academy

Training programme plugged into the **National Pact for Productive Inclusion (1MiO/UNICEF)**:

- 80 hours, 60 days, 7 modules (defensive driving, customer service, MEI registration, LGPD, health, active citizenship, OpenBag practicals)
- R$800/month training grant during the course
- Certified equipment (bag + badge) provided free on graduation
- 12-month longitudinal mentorship
- Zero-interest Caixa MEI microcredit for motorcycle
- Graduates start immediately at Bronze Tier
- **1st cohort · CEU Heliópolis · São Paulo**

Operational partners: SENAI Transportes, Instituto PROA, Sebrae, Coding Rights, IRIS, UFRJ COPPE, FBSP, Sou da Paz.

Details in `spec/06-academy.md`.

---

## Tripartite co-financing

CAPEX per worker estimated at **R$1,920** (R$320 hardware + R$1,600 academy):

| Vector | Share | Value | Mechanism |
|--------|-------|-------|-----------|
| Platforms | 60% | R$1,152 | Direct CAPEX · consortium |
| State | 20% | R$384 | Marco Legal Startups + Lei do Bem + 1MiO |
| Insurance | 20% | R$384 | Micro-premium R$0.05/delivery + Shield Programme |

For 380,000 workers (Wave 02 — São Paulo + Rio de Janeiro + Recife), aggregate CAPEX **R$730 million**, distributed tripartitely. Less than the annual marketing budget of a single platform; estimated social payback: 9 months.

---

## OpenBag family · extensibility

The architecture is designed for extension. Future RFCs cover:

- **OpenRide** · mobility (Uber/99/InDrive). Additional vector: false passenger against driver. Spec under design on branch `openride-spec`.
- **OpenCare** · platform-based care (caregivers, GetNinjas). Under discussion.
- **OpenLearn** · platform-based education. Under discussion.

Principle: the **OpenBag Agent** (Pillar 04) is universal — every family member shares the same personal agent and Skills architecture. Physical pillars vary by context.

---

## Roadmap · 4 waves in 30 months

Deployment follows the **cold start protocol** defined in [RFC-002](RFC-002.md), with objective gates between phases:

- **Wave 01 · Phase α** (0–60d) · Silent · mass enrolment in Heliópolis-Sacomã polygon, no public communication
- **Wave 01 · Phase β** (60–120d) · Public pilot in polygon · citizen app in stores
- **Wave 02 · Phase γ** (120–270d) · Active citizen campaign + hardware in production
- **Wave 03 · Phase δ** (270–540d) · Concentric expansion · Foundation legally constituted
- **Wave 04** (540–900d) · LATAM · MX/CO/AR/CL · Regional standard

Each ring/city repeats the α → β → γ cycle. **Phase rollback is non-negotiable** when metrics are not met.

Details in [`ROADMAP.md`](../ROADMAP.md) and [RFC-002](RFC-002.md).

---

## References

- [Public Manifesto](MANIFESTO.md)
- [Governance](../GOVERNANCE.md)
- [How to contribute](../CONTRIBUTING.md)
- [Security policy](../SECURITY.md)
- [Coalition of partners](../coalition/COALITION.md)

### Architectural inspirations

- **OpenClaw** · local personal agent · modular skills · foundation stewardship
- **OpenStreetMap** · public good maintained by global community
- **Disque-Denúncia 181** · Brazilian model of operational anonymity
- **Tor Project** · onion routing as technical anonymity foundation
- **Pix (BCB)** · public financial standard with universal adoption

### Primary data sources

- IBGE · PNAD Contínua 2024 · Platform Digital Work
- Cebrap / Amobitec · 2nd edition · 2024
- ILO × CUT · Brasília-Recife Survey · 2021
- 1MiO/UNICEF · National Pact for Productive Inclusion of Youth
- GOYN/Aspen · Youth Potential São Paulo

---

*This RFC is a living document. Pull requests welcome.* 🐝
