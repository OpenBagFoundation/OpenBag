# OpenClaw Alignment · OpenBag

> This document maps OpenBag components against the OpenClaw architecture, identifies
> shared conventions, and describes the `skill-claw-bridge` integration for portable
> reputation between both ecosystems.
>
> 🇧🇷 Este documento é bilíngue. As seções em português estão em itálico.

---

## Overview

OpenBag is a **sibling project** of OpenClaw, purpose-built for Brazil's last-mile
delivery sector. Both projects share a common agent-skills architecture, governance
philosophy, and manifest format — by design.

| Attribute | OpenClaw | OpenBag |
|-----------|----------|---------|
| **Domain** | General-purpose civic agent | Last-mile delivery identity & safety |
| **Geography** | Global | Brazil-first, LATAM roadmap |
| **Agent model** | Local agent, modular skills | Local agent, modular skills (identical) |
| **Identity anchor** | DID-based | Gov.br Nível Ouro + W3C DID |
| **Skill manifest** | SKILL.yaml | SKILL.yaml (compatible) |
| **Registry** | OpenClaw Hub | ClawHub-BR (sibling registry) |
| **Recognition tiers** | Hexagon → Queen | Hexagon → Queen (identical) |
| **Governance** | OpenClaw Foundation | OpenBag Foundation (same model) |
| **License** | MIT | MIT |

---

## Skill Manifest Compatibility

OpenBag SKILL.yaml is **fully compatible** with OpenClaw SKILL.yaml. Any valid
OpenBag skill manifest is also a valid OpenClaw manifest (with OpenBag-specific
permission keys gracefully ignored by the OpenClaw gateway, and vice-versa).

### Shared manifest fields

```yaml
name: skill-example
version: 1.0.0
license: MIT
authors:
  - Contributor Name <email@example.com>
display_name: Example Skill
description: Brief description for ClawHub-BR / OpenClaw Hub.
category: community          # core | community | experimental
maturity: stable             # alpha | beta | stable
permissions: []
dependencies:
  agent: ">= 0.5.0"
hooks:
  on_install: scripts/on_install.js
  on_verify:  scripts/on_verify.js
```

### OpenBag-specific permission prefixes

These prefixes are OpenBag-only and will be ignored by a plain OpenClaw gateway:

| Prefix | Description |
|--------|-------------|
| `read:reputation_tier` | Read worker civic tier |
| `read:platform_list` | Read active platform affiliations |
| `read:status_current` | Read current seal status |
| `write:reputation_event` | Write a reputation event |
| `write:agent_inbox` | Post a message to the agent inbox |
| `location:geohash7` | Approximate location (geohash precision 7) |
| `ble:advertise` | Advertise as OpenBag BLE beacon |
| `nfc:read` | Read NFC tags |
| `http:sentinel.openbag.foundation/*` | Route to Sentinel mixnet |
| `http:api.openbag.foundation/*` | OpenBag Foundation API |

---

## Lifecycle Hook Compatibility

The 9-hook model is **identical** between OpenClaw and OpenBag:

| Hook | OpenClaw | OpenBag | Notes |
|------|----------|---------|-------|
| `on_install` | ✅ | ✅ | |
| `on_first_run` | ✅ | ✅ | |
| `on_uninstall` | ✅ | ✅ | |
| `on_wake` | ✅ | ✅ | |
| `on_verify` | ✅ | ✅ | |
| `on_panic` | ✅ | ✅ | OpenBag adds geo+photo payload |
| `on_route_start` | ✅ | ✅ | |
| `on_route_end` | ✅ | ✅ | |
| `on_tier_change` | ✅ | ✅ | OpenBag tier payload is richer |

---

## Agent Gateway Compatibility

Both agents implement the same **gateway sandbox model**:

- Least-privilege permission enforcement
- Event bus for skill-to-skill communication
- Encrypted local storage API (`storage:encrypted_local`)
- Hardware abstraction layer (BLE, NFC, camera, biometrics)
- No direct filesystem or network access without declared permissions

A skill built to the OpenClaw gateway spec will run in the OpenBag gateway with zero
changes, provided it only uses shared permission categories.

---

## Recognition Tier Parity

Both projects use the **same five-level contributor recognition model**:

| Level | OpenClaw | OpenBag |
|-------|----------|---------|
| ⬡ 1 | Hexagon | Hexagon |
| 🐝 2 | Worker Bee | Worker Bee |
| 🍯 3 | Forager | Forager |
| 🛠️ 4 | Drone Engineer | Drone Engineer |
| 👑 5 | Queen | Queen |

An OpenClaw Forager who publishes a skill to ClawHub-BR is automatically recognized
at Forager level in OpenBag — cross-ecosystem recognition by community convention.

---

## Reputation Portability: `skill-claw-bridge`

The `skill-claw-bridge` skill ([`sdk/skills/skill-claw-bridge/`](../sdk/skills/skill-claw-bridge/))
enables **portable civic reputation** between the two ecosystems.

### What it does

1. **Export** — packages the worker's OpenBag civic tier as a W3C Verifiable
   Credential signed by the Foundation
2. **Import** — accepts an OpenClaw reputation VC and maps it to the equivalent
   OpenBag tier
3. **Sync** — on `on_wake`, checks for tier updates on both sides and reconciles

### Tier mapping

| OpenBag Tier | OpenClaw Equivalent | Notes |
|--------------|---------------------|-------|
| Bronze | Hexagon/Worker Bee | Entry level on both sides |
| Prata | Forager | Active contributor with track record |
| Ouro | Drone Engineer | Trusted senior contributor |
| Diamante | Queen | Board-level recognition |

The mapping is **conservative**: a worker migrating from OpenClaw gets the *lower*
of the two equivalent tiers until the Foundation verifies their OpenBag-specific
conduct record.

---

## ClawHub-BR ↔ OpenClaw Hub

ClawHub-BR is OpenBag's community skill registry, modeled after and compatible with
the OpenClaw Hub:

| Feature | OpenClaw Hub | ClawHub-BR |
|---------|--------------|------------|
| Registry format | `index.json` | `index.json` (same schema v1) |
| Trust tiers | foundation / community / experimental | foundation / community / experimental |
| CI review | Yes | Yes (GitHub Actions) |
| Manifest validation | SKILL.yaml schema | SKILL.yaml schema (compatible) |
| Cross-listing | — | Cross-listed skills allowed |

A skill published to ClawHub-BR can be **cross-listed** on the OpenClaw Hub by
adding the `openclaw_compatible: true` flag to SKILL.yaml and opening a PR there.

---

## DID Interoperability

OpenBag uses the `did:openbag` DID method, anchored on the Foundation's registry.
It is designed for future federation with:

- `did:web` — for institutional actors (platforms, government agencies)
- `did:key` — for ephemeral/offline verification
- `did:claw` — OpenClaw's native DID method (roadmap Wave 9, feature #92)

The W3C DID context (`spec/vc/context-v1.json`) is structured to be composable with
OpenClaw's VC context.

---

## Governance Alignment

Both foundations follow the **Apache Way** governance model:

| Principle | OpenClaw Foundation | OpenBag Foundation |
|-----------|---------------------|--------------------|
| Neutral stewardship | ✅ | ✅ |
| No corporate veto | ✅ | ✅ |
| TSC controls technical decisions | ✅ | ✅ |
| RFC process (lazy consensus) | ✅ | ✅ |
| Public financial transparency | ✅ | ✅ (quarterly reports) |
| Community elects board seats | ✅ | ✅ (2 Diamante seats elected by workers) |

The two foundations are **separate legal entities** with independent governance,
but operate as allies: shared RFCs, cross-ecosystem recognition, and co-authorship
of joint standards submitted to W3C-DID WG.

---

## Migration Guide: OpenClaw → OpenBag

If you're an OpenClaw contributor wanting to contribute to OpenBag:

| Step | Action |
|------|--------|
| 1 | Read [RFC-001-en.md](RFC-001-en.md) — the domain context is Brazil-specific |
| 2 | Install the OpenBag CLI: `cd sdk/cli && npm install && npm link` |
| 3 | Validate your existing skill: `openbag validate my-skill/` |
| 4 | Add Brazil-specific permissions if needed (see table above) |
| 5 | Open PR to [ClawHub-BR](https://github.com/openbagfoundation/clawhub-br) |
| 6 | Your OpenClaw recognition tier is recognized — introduce yourself in `#new-contributors` |

The onboarding overhead for an OpenClaw contributor is **estimated at < 30 minutes**.

---

## Component Map

```
OpenClaw                         OpenBag
────────────────────────────     ─────────────────────────────────
OpenClaw Agent                ↔  OpenBag Agent (local, same arch)
OpenClaw Hub                  ↔  ClawHub-BR (compatible registry)
SKILL.yaml schema              =  SKILL.yaml schema (compatible)
Lifecycle hooks (9)            =  Lifecycle hooks (9, identical)
Gateway sandbox                =  Gateway sandbox (same model)
Permission model               ≈  Permission model (OpenBag extends)
did:claw                       ↔  did:openbag (future federation)
OpenClaw VC context            ↔  OpenBag VC context (composable)
OpenClaw Foundation            ↔  OpenBag Foundation (allied)
Hexagon → Queen tiers          =  Hexagon → Queen tiers (identical)
                               NEW skill-claw-bridge (portable rep)
                               NEW Gov.br identity anchor
                               NEW BLE beacon (nRF52840)
                               NEW e-paper live badge
                               NEW Sentinel mixnet (3-layer anon)
                               NEW Academy (80h, bolsa R$800)
```

---

## Roadmap: Deeper Integration (Wave 9+)

| Feature | Target | Description |
|---------|--------|-------------|
| DID federation `did:openbag` ↔ `did:claw` | Wave 9 | Mutual resolution |
| Shared VC context v2 | Wave 9 | Unified credential format |
| Cross-registry skill discovery | Wave 6 | ClawHub-BR ↔ OpenClaw Hub |
| Joint W3C-DID WG submission | Wave 9 | Platform worker identity standard |
| OpenRide (sibling to OpenClaw Mobility) | Wave 3+ | Rideshare identity protocol |

---

*The hive expands. OpenBag and OpenClaw are two nests of the same colony.* 🐝
