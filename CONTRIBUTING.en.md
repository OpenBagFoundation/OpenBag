# Contributing to OpenBag

Welcome to the hive. 🐝

> 🇧🇷 **Versão em português:** [CONTRIBUTING.md](CONTRIBUTING.md)

OpenBag is a community project, MIT-licensed, maintained by independent contributors.
There are no positions to fill — there are issues to resolve, RFCs to discuss, skills
to publish, communities to mobilize.

This document describes how you can contribute.

---

## Table of contents

- [Before you start](#before-you-start)
- [Types of contribution](#types-of-contribution)
- [Development setup](#development-setup)
- [Code contribution flow](#code-contribution-flow)
- [Building Skills](#building-skills)
- [RFC process](#rfc-process-structural-changes)
- [Issues](#issues)
- [Code review](#code-review)
- [Maintainers](#maintainers)
- [Recognition](#recognition)
- [OpenClaw alignment](#openclaw-alignment)
- [Resources](#resources-to-get-started-fast)

---

## Before you start

1. Read the [Code of Conduct](CODE_OF_CONDUCT.md). Adherence is a condition of participation.
2. Read the [Manifesto](docs/MANIFESTO.md) (Portuguese only) to understand the *why*.
3. Read [RFC-001 (English)](docs/RFC-001-en.md) to understand the *how*.
4. Read [RFC-002](docs/RFC-002.md) to understand the cold start protocol.
5. Join the [community Discord](https://discord.gg/openbag) and introduce yourself in `#new-contributors`.

---

## Types of contribution

The project benefits from many forms of contribution — not just code.

### 1. Code and architecture

- Implementing native and community Skills
- Protocol specs (rotating BLE, Sentinel mixnet, Reputation tier)
- Citizen app SDK (iOS/Android)
- Stubs and integrations with Gov.br
- Security auditing (red-team, threat modeling)
- Bridge with OpenClaw (skill-claw-bridge)

### 2. Hardware

- BOM and schematics for the live badge (e-paper + BLE + battery)
- Certified bag (Secure Element + tamper seal)
- Helmet with beacon
- nRF52840 firmware (Zephyr RTOS)

### 3. Research

- LGPD compliance and DPIA
- Formal threat model (STRIDE)
- Impact studies and metrics
- Qualitative research with workers and communities

### 4. Documentation

- Translating RFCs to ES (essential for LATAM coalition)
- Tutorials and onboarding guides
- Documented use cases
- Educational videos

### 5. Community and advocacy

- Organizing regional Meetups (SP, RJ, BH, Recife, CDMX, Bogotá)
- Curating the Discord server
- Engaging with foundations and funders
- Political articulation with the public sector

### 6. Design and narrative

- Visual system and mascot
- Communication for social networks
- Educational videos for the Academy
- Material for traditional media

---

## Development setup

See the detailed guide at [docs/dev-setup.en.md](docs/dev-setup.en.md).

**Quickstart:**

```bash
# Clone
git clone https://github.com/OpenBagFoundation/OpenBag.git
cd OpenBag/

# Install the SDK CLI
cd sdk/cli && npm install && npm link && cd ../..

# Verify
openbag --help

# Run the landing page locally
python3 -m http.server 8080 --directory docs/

# Run the Verifica app locally
python3 -m http.server 8081 --directory apps/verifica/
```

---

## Code contribution flow

### Step by step

```bash
# 1. Fork the repo
gh repo fork OpenBagFoundation/OpenBag --clone

# 2. Create a branch for your contribution
cd OpenBag/
git checkout -b feat/skill-finance-sebrae-integration

# 3. Make changes with descriptive commits (Conventional Commits)
git commit -m "feat(skill-finance): add Sebrae MEI registration flow"

# 4. Update tests and relevant docs
openbag validate sdk/skills/skill-finance/
openbag test sdk/skills/skill-finance/

# 5. Run local linting before opening PR
markdownlint '**/*.md' --ignore node_modules

# 6. Open a descriptive pull request
gh pr create \
  --title "Skill-Finance · Sebrae MEI integration" \
  --body "Closes #042 · adds skill module for MEI registration via Sebrae API..."
```

### Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use |
|--------|-----|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation change |
| `spec:` | RFC or spec change |
| `chore:` | Build, infra, deps |
| `refactor:` | Refactor without behavior change |
| `test:` | Adding or fixing tests |
| `style:` | Formatting, missing semicolons, etc |
| `perf:` | Performance improvement |

**Example**: `feat(skill-sentinel): add mixnet relay rotation`

### Branch conventions

```
feat/<short-description>
fix/<short-description>
docs/<short-description>
spec/<rfc-number-theme>
chore/<short-description>
```

---

## Building Skills

Skills are the modular extension units of the OpenBag agent. Inspired directly by
the OpenClaw model, each skill is declarative, sandboxed, and follows a granular
permission model.

### Anatomy of a Skill

```
sdk/skills/skill-example/
├── SKILL.yaml          # Manifest (source of truth)
├── README.md           # Documentation
├── index.js            # Entry point
├── scripts/            # Lifecycle hooks
│   ├── on_install.js
│   ├── on_first_run.js
│   ├── on_verify.js
│   └── on_wake.js
└── test/
    └── index.js        # Tests
```

### Available Lifecycle Hooks

| Hook | When it fires |
|------|---------------|
| `on_install` | Immediately after install |
| `on_first_run` | First agent boot after install |
| `on_uninstall` | Before removal |
| `on_wake` | Each time agent wakes (heartbeat) |
| `on_verify` | When citizen triggers verification |
| `on_panic` | When panic mode activates (core-sensitive only) |
| `on_route_start` | When worker starts a route |
| `on_route_end` | When worker ends a route |
| `on_tier_change` | When reputation tier changes |

### Categories and maturity

| Category | Description |
|----------|-------------|
| `core` | Built-in, pre-installed, maintained by TSC |
| `community` | Published to ClawHub-BR by the community |
| `experimental` | Active development, with warning badge |

| Maturity | Meaning |
|----------|---------|
| `alpha` | Early development, unstable API |
| `beta` | Functional, in testing |
| `stable` | Production-ready |

### Permission model

Every skill **must** declare exactly the permissions it needs. The Gateway denies
any undeclared call. See [spec/08-gateway.md](spec/08-gateway.md) for the full list
of available permissions (25+ categories).

Common examples:

```yaml
permissions:
  - read:reputation_tier      # Read worker tier
  - ble:scan                  # Scan BLE beacons
  - ble:advertise             # Advertise as beacon
  - nfc:read                  # Read NFC tags
  - location:coarse           # Approximate GPS
  - location:fine             # Exact GPS (core only)
  - notifications:local       # Local device notifications
  - storage:read              # Read encrypted skill storage
  - storage:write             # Write to storage
  - network:foundation_api    # HTTPS to Foundation API
  - network:platform_api      # HTTPS to platform APIs
```

### Reference skills

Before creating a new skill, study the 4 reference implementations:

- [`sdk/skills/skill-verify/`](sdk/skills/skill-verify/) — Citizen verification (core, stable)
- [`sdk/skills/skill-rep/`](sdk/skills/skill-rep/) — Reputation engine (core, stable)
- [`sdk/skills/skill-sentinel/`](sdk/skills/skill-sentinel/) — Anonymous reporting (core-sensitive, beta)
- [`sdk/skills/skill-claw-bridge/`](sdk/skills/skill-claw-bridge/) — OpenClaw ↔ OpenBag bridge

### Complete workflow

```bash
# 1. Create the skill
openbag init my-cool-skill

# 2. Implement your hooks in scripts/
$EDITOR sdk/skills/skill-my-cool-skill/scripts/on_verify.js

# 3. Add tests
$EDITOR sdk/skills/skill-my-cool-skill/test/index.js

# 4. Validate the manifest
openbag validate sdk/skills/skill-my-cool-skill/

# 5. Run tests
openbag test sdk/skills/skill-my-cool-skill/

# 6. Publish to ClawHub-BR
openbag publish sdk/skills/skill-my-cool-skill/
```

---

## RFC process (structural changes)

For changes to the protocol, architecture, or founding decisions, we open an RFC:

1. Create a file `rfcs/NNNN-short-title.md` based on `rfcs/0000-template.md`
2. Open a PR labeled `rfc-discussion`
3. Discussion stays open for **minimum 14 days**
4. Decision by lazy consensus; in a deadlock, Foundation Board vote
5. Accepted RFC: status becomes `accepted`, main branch incorporates

Active RFCs:
- [RFC-001](docs/RFC-001-en.md) — Vision and architecture (accepted)
- [RFC-002](docs/RFC-002.md) — Cold start and phases (accepted)
- RFC-003 — National expansion (planned)

---

## Issues

### Reporting a bug

Use the `Bug Report` template in `.github/ISSUE_TEMPLATE/bug_report.md`. Include:

- Clear description of the bug
- Steps to reproduce
- Expected vs observed behavior
- Environment (OS, agent version, hardware)
- Screenshots or logs (if applicable)

### Proposing a feature

Use the `Feature Proposal` template. For large features (> 2 weeks of work),
consider opening an RFC first.

### Proposing a Skill

Use the `Skill Proposal` template. Include:

- Category (core / community / experimental)
- Required permissions
- Use case and target audience
- Proposed maintainer

### Security vulnerability

**DO NOT** open a public issue. See [SECURITY.md](SECURITY.md) for responsible disclosure.

---

## Code review

Every contribution goes through review by at least one maintainer. Criteria:

1. **Spec adherence** — does it respect current RFCs?
2. **Technical quality** — clean, tested, documented code?
3. **Privacy by design** — sensitive data stays on the worker's device?
4. **Backward compatibility** — doesn't break existing implementations without RFC?
5. **Security** — doesn't introduce attack vectors?
6. **LGPD** — data minimization and explicit consent?
7. **Minimal permissions** — skill declares only what it needs?

Reviewers have **7 days** for initial response. PRs without response after that,
contact `@maintainers` on Discord.

### Contributor checklist

Before marking PR as ready for review:

- [ ] Commits follow Conventional Commits
- [ ] Tests pass locally
- [ ] CI green on GitHub Actions
- [ ] Documentation updated (README, spec if applicable)
- [ ] LGPD: no personal data exposed without consent
- [ ] Skills: validate + test pass
- [ ] Markdown: lint passes
- [ ] Links: all resolve (or are in `.lychee.toml` exclusion)

---

## Maintainers

The current maintainer list is in [GOVERNANCE.md](GOVERNANCE.md). Maintainers are
contributors who demonstrated sustained commitment and were invited by the Board.

### Promotion to maintainer

Criteria (after 6 months of active contribution):

- 10+ accepted PRs
- Consistent participation in RFCs
- Adherence to Code of Conduct
- Endorsement by 2 existing maintainers
- Board approval

---

## Recognition

Following the OpenClaw model, OpenBag recognizes contributors at multiple levels:

| Level | Criteria | Privileges |
|-------|----------|------------|
| 🐝 **Hexagon** | First accepted contribution | Listed in `CONTRIBUTORS.md` |
| 🐝 **Worker Bee** | 5+ contributions, active on Discord | Profile badge; Office Hours invite |
| 🍯 **Forager** | Community skill maintained on ClawHub-BR | Consultative voice in RFCs |
| 🛠️ **Drone Engineer** | Maintainer with merge privileges | Vote in technical decisions |
| 👑 **Queen** | Seat on OpenBag Foundation Board | RFC veto (with 6/9 quorum) |

Public recognition in monthly releases and in `CONTRIBUTORS.md`. For institutional
contributors (universities, NGOs, companies), recognition in
[`coalition/COALITION.md`](coalition/COALITION.md).

---

## OpenClaw alignment

OpenBag is a sibling project of OpenClaw and follows compatible conventions. See
[docs/OPENCLAW-ALIGNMENT.md](docs/OPENCLAW-ALIGNMENT.md) for details:

- Skill manifest format (compatible)
- Common lifecycle hooks
- Aligned permission model
- Portable reputation bridge between OpenClaw and OpenBag (via `skill-claw-bridge`)
- Governance model inspired by Apache Way + OpenClaw Foundation

If you already contribute to OpenClaw, onboarding to OpenBag should take < 30 minutes.

---

## Resources to get started fast

| Resource | Status |
|----------|--------|
| 📺 5-minute video on OpenBag | In production |
| 🎓 Architecture walkthrough | In production |
| 🛠️ [Local dev setup (EN)](docs/dev-setup.en.md) | ✅ Available |
| 🇧🇷 [Setup de dev (PT)](docs/dev-setup.md) | ✅ Available |
| 💬 [Discord · #new-contributors](https://discord.gg/openbag) | ✅ Active |
| 📅 [Meetup SP](https://meetup.com/openbag-sp) | ✅ Active |
| 🐛 [Good first issues](https://github.com/OpenBagFoundation/OpenBag/issues?q=label%3Agood-first-issue) | ✅ Available |

---

*Welcome to the hive. Each one brings honey.* 🐝
