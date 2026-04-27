# OpenBag Skill Registry — Seed

> Reference seed for the **ClawHub-BR** community skill registry.

This directory holds a snapshot of the registry index that the Agent
Gateway consumes for skill discovery and update checks. The canonical
registry is the separate repository at:

> https://github.com/openbagfoundation/clawhub-br

Why ship a copy here? Two reasons:

1. **Bootstrapping** — until the canonical registry exists, this seed
   lets the agent install the three core skills (`skill-verify`,
   `skill-rep`, `skill-sentinel`) directly from this repo.
2. **Reference** — third-party developers can see exactly what an
   `index.json` entry looks like before writing their own.

## Files

| File | Purpose |
|------|---------|
| `index.json` | Machine-readable index of published skills |
| `README.md` | This file |

## Index format

See [`spec/09-clawhub-br.md`](../spec/09-clawhub-br.md) for the full
schema. Each skill entry contains:

| Field | Required | Description |
|-------|----------|-------------|
| `name` | yes | Skill identifier (`skill-<name>`) |
| `display_name` | yes | Human-readable name shown in app |
| `version` | yes | semver |
| `category` | yes | `core` / `core-sensitive` / `community` / `experimental` |
| `maturity` | yes | `alpha` / `beta` / `stable` |
| `license` | yes | SPDX identifier |
| `description` | yes | 1–3 sentence summary |
| `authors` | yes | RFC-2822 `Name <email>` list |
| `trust_tier` | yes | `foundation` / `verified` / `community` / `experimental` |
| `checksum` | yes | SHA-256 of the bundled skill (zero-filled in this seed) |
| `published_at` | yes | ISO 8601 |
| `docs` | no | URL to documentation |
| `audit_url` | no | URL to public security audit (required for core/core-sensitive) |
| `permissions` | yes | List of declared scopes |
| `hooks` | yes | List of lifecycle hooks the skill implements |

## Trust tiers

| Tier | Who | Requirements |
|------|-----|-------------|
| `foundation` | OpenBag Foundation | Full audit + TSC approval + core category |
| `verified` | Known orgs (Sebrae, iFood, Caixa, Prefeitura SP) | Identity verification + LGPD review |
| `community` | Any developer | OSI license + automated tests + LGPD self-declaration |
| `experimental` | Any developer | OSI license only |

## Submitting a new skill

The full submission workflow is documented in
[`spec/09-clawhub-br.md`](../spec/09-clawhub-br.md). The short version:

1. Scaffold with `openbag skill init`
2. Implement and test with `openbag skill validate && openbag skill test`
3. Open a PR against `openbagfoundation/clawhub-br` with title
   `[skill] add skill-<name> v<version>`
4. Address reviewer feedback (SLA: 5 business days)
5. On merge, the index is regenerated automatically by CI.
