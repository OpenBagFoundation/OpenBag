# Development Setup · OpenBag

> Complete guide to set up your local environment and contribute to OpenBag.
> 🇧🇷 [Versão em português](dev-setup.md)

---

## Prerequisites

| Tool | Minimum | Recommended |
|------|---------|-------------|
| **Node.js** | 18.0.0 | 20.x LTS |
| **npm** | 9.0.0 | 10.x |
| **Git** | 2.30.0 | 2.40+ |
| **Python** (CI tools) | 3.9 | 3.11+ |

### Optional tools (recommended)

- **gh** (GitHub CLI) — open PRs from terminal
- **VS Code** with extensions: ESLint, Prettier, EditorConfig, GitLens, YAML
- **direnv** — per-project environment variables
- **markdownlint-cli** — validate Markdown locally
- **lychee** — verify links

---

## Initial setup

### 1. Clone the repository

```bash
git clone https://github.com/OpenBagFoundation/OpenBag.git
cd OpenBag/
```

### 2. Install the SDK CLI

```bash
cd sdk/cli
npm install
npm link        # makes the `openbag` command globally available
cd ../..
```

Verify installation:

```bash
openbag --version
openbag --help
```

### 3. Install validation tools (optional)

```bash
# Markdown linter
npm install -g markdownlint-cli

# Link checker
cargo install lychee   # or: brew install lychee

# Spell checker
pipx install codespell
```

---

## Project layout

```
OpenBag/
├── docs/        — Public documentation (RFC, manifesto, FEATURES-100)
├── spec/        — Technical specifications (11 specs + API + VC)
├── sdk/         — Agent SDK, CLI, and reference skills
├── apps/        — Citizen applications (Verifica PWA, Coverage)
├── tools/       — Dev tools (seal-v0)
├── assets/      — Brand kit and images
├── registry/    — ClawHub-BR registry seed
├── coalition/   — Institutional partner list
└── .github/     — CI/CD workflows and issue templates
```

---

## Building a Skill

### Create a new skill

```bash
openbag init my-cool-skill
```

The wizard prompts for:
- **Name** (kebab-case, must start with `skill-`)
- **Display name** (human-readable)
- **Description** (1–3 sentences)
- **Category** (`core`, `community`, `experimental`)
- **Maturity** (`alpha`, `beta`, `stable`)
- **Permissions** (from 25+ capability categories)
- **Hooks** (lifecycle hooks your skill will implement)

### Validate the skill

```bash
openbag validate ./skill-my-cool-skill
```

Validates `SKILL.yaml` against the official JSON Schema and reports violations with line/column.

### Run tests

```bash
openbag test ./skill-my-cool-skill
```

Executes all `.js` files in `test/`. Pass = exit 0.

### List installed skills

```bash
openbag list
```

### Publish to ClawHub-BR

```bash
openbag publish ./skill-my-cool-skill
```

Prints instructions to open a PR against the community registry.

---

## Local validation before PR

Before opening a PR, run the local equivalent of CI:

```bash
# Markdown lint
markdownlint '**/*.md' --ignore node_modules

# Link check
lychee --config .lychee.toml docs/ spec/

# Spell-check (PT + EN)
codespell --config .codespellrc docs/ spec/ coalition/

# Validate all skills
for skill in sdk/skills/*/; do
  openbag validate "$skill"
done
```

---

## Run the landing page locally

The landing page (`docs/index.html`) is plain HTML:

```bash
# Option 1: Python
python3 -m http.server 8080 --directory docs/

# Option 2: Node.js
npx http-server docs/ -p 8080

# Option 3: VS Code Live Server extension
```

Open `http://localhost:8080` in your browser.

---

## Run the Verifica app locally

```bash
python3 -m http.server 8080 --directory apps/verifica/
```

To test PWA features (install, offline), serve via HTTPS:

```bash
npx http-server apps/verifica/ -p 8080 -S -C cert.pem -K key.pem
```

---

## Code conventions

### Commits — Conventional Commits

```
feat(skill-verify): add NFC scan support
fix(cli): handle missing SKILL.yaml gracefully
docs(readme): refresh contribution section
spec(rfc-002): clarify gate metric for Phase β
chore(deps): bump ajv to 8.12.0
test(skill-rep): add tier transition coverage
refactor(gateway): split permission enforcer
```

### Branch naming

```
feat/skill-finance-sebrae-integration
fix/cli-init-empty-permissions
docs/translate-rfc-001-spanish
spec/rfc-003-national-expansion
```

### JavaScript style

- ESM or CommonJS (follow the directory's existing style)
- 2-space indentation
- Single quotes for strings
- Mandatory semicolons
- `'use strict';` at the top of every Node.js file

### Markdown style

- Lines up to 100 characters (except links and tables)
- ATX headers (`#`, `##`, `###`)
- Lists with `-` (not `*`)
- Code blocks with language identifier (` ```js `, ` ```yaml `)

---

## Hardware Development (advanced)

To contribute firmware for the live badge (e-paper + BLE + battery):

### Toolchain

```bash
# Nordic SDK for nRF52840
# See: https://www.nordicsemi.com/Products/Development-software/nRF-Connect-SDK

# Zephyr RTOS
west init -m https://github.com/nrfconnect/sdk-nrf
west update
```

### Reference spec

See [spec/07-ble-beacon.md](../spec/07-ble-beacon.md) for the rotating BLE protocol and
[spec/01-architecture.md](../spec/01-architecture.md) for BOM and schematics.

---

## Troubleshooting

### `openbag: command not found`

The `npm link` failed or the npm global bin is not on PATH.

```bash
npm bin -g                                    # show the path
export PATH="$(npm bin -g):$PATH"             # add to .bashrc/.zshrc
```

### CI fails on `lychee` (link 404)

Add the domain to the exclusion list in `.lychee.toml` if it's infrastructure not yet deployed.

### CI fails on `codespell` with a Portuguese word

Add the word to `.codespellrc` on the `ignore-words-list` line.

### CI fails on `markdownlint`

Run locally to reproduce:

```bash
markdownlint '**/*.md' --ignore node_modules
markdownlint --fix '**/*.md' --ignore node_modules
```

---

## Additional resources

- [CONTRIBUTING.en.md](../CONTRIBUTING.en.md) — Contribution overview
- [GOVERNANCE.md](../GOVERNANCE.md) — Governance structure
- [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) — Code of conduct
- [SECURITY.md](../SECURITY.md) — Vulnerability reporting
- [SDK README](../sdk/README.md) — SDK documentation
- [CLI README](../sdk/cli/README.md) — CLI reference
- [spec/03-skills.md](../spec/03-skills.md) — Skill catalogue
- [spec/08-gateway.md](../spec/08-gateway.md) — Gateway & sandbox

---

## Support

- 💬 Discord: [discord.gg/openbag](https://discord.gg/openbag) · channel `#new-contributors`
- 🐛 Issues: [github.com/OpenBagFoundation/OpenBag/issues](https://github.com/OpenBagFoundation/OpenBag/issues)
- 📧 Maintainers: `maintainers@openbag.foundation` (TBD)

---

*Welcome to the hive. Each one brings honey.* 🐝
