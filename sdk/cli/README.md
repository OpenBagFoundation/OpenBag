# @openbag/skill-cli

Command-line tool for creating, validating, testing, and publishing OpenBag skills.

## Installation

```bash
npm install -g @openbag/skill-cli
# or run directly without installing:
npx @openbag/skill-cli <command>
```

## Commands

### `openbag skill init`

Interactive wizard that scaffolds a new skill directory (OpenClaw flat SKILL.yaml format).

```bash
openbag skill init
# Prompts: name, display_name, description, author, permissions, hooks, category
# Creates: SKILL.yaml, index.js, scripts/<hook>.js, test/index.js, README.md

# Target a specific parent directory:
openbag skill init --dir ~/my-skills
```

### `openbag skill validate`

Validates `SKILL.yaml` against the OpenClaw-aligned JSON schema. Falls back to structural
checks if the schema file is not found.

```bash
openbag skill validate                        # validate ./SKILL.yaml
openbag skill validate --file path/to/SKILL.yaml
openbag skill validate --schema path/to/schema.json
```

### `openbag skill test`

Discovers and runs all `.js` files inside the skill's `test/` directory using Node.js.
Tests pass when the file exits with code 0.

```bash
openbag skill test                   # test skill in current directory
openbag skill test --dir ./skill-rep # test skill in a specific directory
```

### `openbag skill publish`

Guides you through publishing a skill to the **ClawHub-BR** registry.
Validates the manifest first; prints step-by-step manual PR instructions.

```bash
openbag skill publish
openbag skill publish --file path/to/SKILL.yaml
```

### `openbag skill list`

Lists all skills currently installed under `~/.openbag/skills/`.

```bash
openbag skill list
```

Example output:

```
Installed skills (/home/entregador/.openbag/skills):

  skill-verify            core          stable    v1.2.0
  skill-rep               core          stable    v1.0.1
  skill-motoboy-map       community     beta      v0.3.0
```

### `openbag skill info`

Shows full details for a skill manifest: permissions, hooks, dependencies, links.

```bash
openbag skill info                           # reads ./SKILL.yaml
openbag skill info --file path/to/SKILL.yaml
```

## SKILL.yaml reference (flat OpenClaw format)

```yaml
name: skill-example            # kebab-case, must start with "skill-"
version: 0.1.0                 # semver
license: MIT                   # SPDX identifier
authors:
  - Your Name <you@example.com>
display_name: Example Skill
description: >
  A one-to-three sentence description of what this skill does and
  who it is for. Shown in ClawHub-BR search results.
category: community            # core | community | experimental
maturity: alpha                # alpha | beta | stable
permissions:
  - read:reputation_tier
  - ble:scan
  - notifications:local
dependencies:
  agent: ">= 0.5.0"
hooks:
  on_install: scripts/on_install.js
  on_verify: scripts/on_verify.js
docs: https://github.com/openbagfoundation/clawhub-br/tree/main/registry/skill-example
repository: https://github.com/you/skill-example
```

### Available permissions

| Permission | What it grants |
|---|---|
| `read:reputation_tier` | Read worker reputation tier |
| `read:platform_list` | Read platform affiliations list |
| `read:status_current` | Read current worker status |
| `read:academy_progress` | Read Academy learning progress |
| `read:rewards_balance` | Read rewards/points balance |
| `read:route_current` | Read active delivery route |
| `write:agent_inbox` | Write messages to agent inbox |
| `write:reputation_event` | Emit reputation events |
| `write:route_event` | Emit route lifecycle events |
| `write:academy_event` | Emit Academy completion events |
| `ble:scan` | Scan for BLE devices (beacon detection) |
| `ble:advertise` | Advertise BLE beacon |
| `ble:pair_hardware` | Pair with OpenBag hardware (NFC bag/e-paper) |
| `nfc:read` | Read NFC tags |
| `nfc:write` | Write NFC tags |
| `location:geohash5` | Location at ~5 km precision (city-level) |
| `location:geohash7` | Location at ~150 m precision (neighborhood) |
| `location:exact` | Exact GPS coordinates |
| `notifications:local` | Local push notifications |
| `notifications:push` | Remote push notifications |
| `storage:encrypted_local` | Encrypted SQLCipher local store |
| `biometric:verify` | Device biometric confirmation (FaceID/fingerprint) |
| `camera:qr_only` | Camera access for QR scanning only |
| `camera:photo` | Full camera photo access |

### Lifecycle hooks

| Hook | When it fires |
|---|---|
| `on_install` | Once after install (setup, DB migration) |
| `on_first_run` | First agent boot after install (onboarding) |
| `on_uninstall` | Before removal (cleanup) |
| `on_wake` | Each time the agent wakes (periodic heartbeat) |
| `on_verify` | When a citizen triggers a verification event |
| `on_panic` | When panic mode is activated (core-sensitive only) |
| `on_route_start` | When worker starts a delivery route |
| `on_route_end` | When worker ends a delivery route |
| `on_tier_change` | When worker reputation tier changes |

## Development workflow

```bash
# 1. Scaffold
openbag skill init

# 2. Implement logic in scripts/<hook>.js and index.js

# 3. Validate manifest
openbag skill validate

# 4. Run tests
openbag skill test

# 5. Publish to ClawHub-BR
openbag skill publish
```
