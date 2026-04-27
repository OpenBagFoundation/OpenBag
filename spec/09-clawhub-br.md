# Spec 09 — ClawHub-BR

**Status**: Draft | **Version**: 0.1.0 | **Date**: 2026-04

---

## 1. Overview

**ClawHub-BR** is the community skill registry for the OpenBag ecosystem — a Brazilian fork of the OpenClaw ClawHub architecture, adapted for the civic-tech and last-mile delivery context. It allows third-party developers (fintechs, platforms, NGOs, municipalities) to publish, discover, and install Skills that extend the OpenBag Agent.

ClawHub-BR is **not** an app store. It is a curated, open-source registry of signed, reviewed Skills, all published under OSI-approved licenses, all audited for LGPD compliance.

---

## 2. Registry Structure

```
clawhub-br/
├── registry/
│   ├── skill-route/          # one directory per skill
│   │   ├── SKILL.yaml        # flat manifest (spec 03)
│   │   ├── README.md         # usage docs
│   │   ├── index.js          # entrypoint (or as declared in manifest)
│   │   ├── scripts/          # hook implementations
│   │   └── test/             # automated tests
│   ├── skill-academy-quiz/
│   └── ...
├── index.json                # generated registry index (CI)
├── TRUST.md                  # trust tier definitions
└── CONTRIBUTING.md           # submission guide
```

### index.json

`index.json` is a machine-readable registry index regenerated on every merge to `main` by CI. The Agent Gateway uses this index for skill discovery and update checks.

```typescript
interface RegistryIndex {
  generated_at: string;   // ISO 8601
  schema_version: '1';
  skills: SkillIndexEntry[];
}

interface SkillIndexEntry {
  name:         string;
  display_name: string;
  version:      string;
  category:     'core' | 'core-sensitive' | 'community' | 'experimental';
  maturity:     'stable' | 'beta' | 'alpha';
  license:      string;
  description:  string;
  authors:      string[];
  trust_tier:   'foundation' | 'verified' | 'community' | 'experimental';
  checksum:     string;   // SHA-256 of the skill bundle (zip)
  published_at: string;   // ISO 8601
  docs?:        string;
  audit_url?:   string;
}
```

---

## 3. Trust Tiers

ClawHub-BR uses a four-tier trust model. The Agent Gateway displays the trust tier to the user at install time.

| Tier | Who | Requirements | Icon |
|------|-----|-------------|------|
| `foundation` | OpenBag Foundation | Full audit + TSC approval + core category | 🔵 |
| `verified` | Known orgs (Sebrae, iFood, Caixa, Prefeitura SP) | Identity verification + LGPD review + stable maturity | 🟢 |
| `community` | Any developer | OSI license + automated tests + LGPD self-declaration | 🟡 |
| `experimental` | Any developer | OSI license only | ⚪ |

**Tier assignment** is determined by the ClawHub-BR review committee during the PR review process. Developers may request tier upgrades by submitting supporting evidence (audit reports, org verification, etc.).

---

## 4. Submission Workflow

### Step 1: Scaffold

```bash
openbag skill init
# Follow wizard, select category: community or experimental
cd skill-<yourname>
openbag skill validate
openbag skill test
```

### Step 2: Fork and Add

```bash
git clone https://github.com/openbagfoundation/clawhub-br
cd clawhub-br
cp -r /path/to/skill-<yourname> registry/skill-<yourname>/
git checkout -b add-skill-<yourname>
git add registry/skill-<yourname>/
git commit -m "[skill] add skill-<yourname> v0.1.0"
git push origin add-skill-<yourname>
```

### Step 3: Open Pull Request

PR title format: `[skill] add skill-<name> v<version>`

The PR description must include:

```markdown
## Skill Summary
- **Name**: skill-<name>
- **Category**: community | experimental
- **Permissions**: <list all permissions>
- **LGPD legal basis**: <legitimate interest | consent | vital interest>
- **Data stored locally**: <yes/no — what>
- **Data sent externally**: <yes/no — to where, under what permission>

## Test results
<!-- paste output of: openbag skill test -->

## Self-LGPD declaration
I confirm this skill:
- [ ] does not transmit worker CPF or biometrics externally
- [ ] declares all external HTTP endpoints in permissions
- [ ] stores only what is declared in the SKILL.yaml description
- [ ] provides a data deletion path (on_uninstall hook)
```

### Step 4: Automated CI Checks

The ClawHub-BR CI pipeline runs automatically on every PR:

| Check | Tool | Failure = |
|-------|------|-----------|
| Schema validation | `openbag skill validate` | Block merge |
| Automated tests | `openbag skill test` | Block merge |
| License check | SPDX lint | Block merge |
| Spell check | codespell | Warning |
| Permission audit | custom linter | Warning for hardware write |
| Link check | lychee | Warning |

### Step 5: Human Review

A ClawHub-BR reviewer (Foundation TSC or community maintainer) reviews:

1. Permission justification — are all declared permissions necessary?
2. LGPD compliance — does the skill handle personal data appropriately?
3. Code quality — no obfuscation, no eval(), no dynamic require()
4. Test coverage — at minimum a smoke test for each hook
5. Documentation — clear description of what the skill does and doesn't do

Review SLA: **5 business days** for community tier, **10 business days** for verified tier (additional identity verification required).

---

## 5. Installation Protocol

When a user installs a skill via the Agent UI or `openbag skill install <name>`:

```
1. Agent Gateway fetches index.json from ClawHub-BR CDN
2. Locate skill entry by name
3. Download skill bundle (.zip) from CDN
4. Verify SHA-256 checksum against index.json entry
5. Verify bundle signature against Foundation public key (Ed25519)
6. Extract to ~/.openbag/skills/<skill-name>/
7. Display permission request dialog to user:
   - Show each permission with human-readable explanation
   - Show trust tier badge
   - Require explicit approval for each hardware permission
8. On approval: run on_install hook (30s timeout)
9. On first agent boot: run on_first_run hook
```

**Bundle format:**

```
skill-<name>-<version>.zip
├── SKILL.yaml
├── index.js (or declared entrypoint)
├── scripts/
├── test/
└── MANIFEST.sig  (Ed25519 signature over SHA-256 of all other files)
```

---

## 6. Version Management

ClawHub-BR follows semantic versioning for all skills:

- **Patch** (0.1.x): Bug fixes, no permission changes
- **Minor** (0.x.0): New features, backward-compatible, may add permissions (requires re-approval)
- **Major** (x.0.0): Breaking changes, full re-review required

**Auto-update policy:**
- Patch updates: applied silently if user opts in (default: yes)
- Minor updates: show changelog, request new permission approvals
- Major updates: treat as new install (full permission dialog)

**Yanking:** Foundation TSC or the skill author may yank a version. Yanked versions trigger an Agent notification: "skill-X has been recalled — please update or remove."

---

## 7. LGPD Compliance for Registry

ClawHub-BR itself processes minimal data:

| Data | Purpose | Retention | Legal basis |
|------|---------|-----------|-------------|
| GitHub username of PR author | Attribution in registry | Indefinite (public) | Legitimate interest |
| Skill download counts (aggregated) | Popularity metrics | 12 months | Legitimate interest |
| Abuse reports | Registry integrity | 24 months | Legal obligation |

No individual worker data passes through ClawHub-BR. The registry is a code repository, not a data processor.

---

## 8. Governance

ClawHub-BR is governed by the OpenBag Foundation Technical Steering Committee (TSC) as defined in [GOVERNANCE.md](../GOVERNANCE.md).

**Registry maintainers** are community volunteers with write access to the `clawhub-br` repository. They are nominated by TSC after contributing ≥ 3 reviewed skills.

**Appeals**: If a PR is rejected, the author may appeal to the TSC by opening an issue tagged `appeal`. TSC decision is final within 10 business days.

**Foundation veto**: The Foundation reserves the right to remove any skill that:
- Violates LGPD (especially biometric data leakage)
- Contains malware or obfuscated code
- Abuses platform APIs in violation of platform ToS
- Is no longer maintained (no update in 18+ months, no response to security reports)

---

## References

- [Spec 03 — Skills](03-skills.md)
- [Spec 08 — Gateway](08-gateway.md)
- [Spec 10 — Interoperability](10-interop.md)
- [GOVERNANCE.md](../GOVERNANCE.md)
- [LGPD Analysis](../docs/LGPD-analysis.md)
- OpenClaw ClawHub architecture (inspiration source)
