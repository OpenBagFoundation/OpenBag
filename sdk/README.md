# OpenBag Skill SDK

The Skill SDK is the developer toolkit for building, validating, and publishing
**OpenBag Skills** — modular capabilities that run inside the OpenBag Agent on a
delivery worker's device.

## What is a Skill?

A Skill is a sandboxed, declarative unit of functionality that extends the OpenBag Agent.
Skills follow a capability-permission model: each skill declares exactly which device
capabilities it needs (BLE, NFC, GPS, network, etc.) and those permissions are shown
to the worker before installation.

Skills are distributed through **ClawHub-BR**, the community registry, or shipped as
**Core skills** maintained by the Foundation TSC. See [`spec/03-skills.md`](../spec/03-skills.md)
for the full catalogue and category definitions.

### Categories

| Category | Description |
|----------|-------------|
| `core` | Built-in, pre-installed, maintained by Foundation TSC |
| `community` | Published to ClawHub-BR by community contributors |
| `experimental` | In active development; marked with a warning badge |

### Lifecycle hooks

A skill can implement any of these lifecycle hooks:

| Hook | When it fires |
|------|---------------|
| `on_install` | Immediately after the skill is installed |
| `on_uninstall` | Before the skill is removed |
| `on_verify` | When a citizen triggers a verification event |
| `on_wake` | Each time the agent wakes (heartbeat) |
| `on_route_start` | When a delivery route begins |
| `on_route_end` | When a delivery route ends |
| `on_tier_change` | When the worker's reputation tier changes |
| `on_panic` | When panic mode is activated (core-sensitive only) |

## Building a Skill

### 1. Scaffold with the CLI

```bash
npx @openbag/skill-cli skill init
```

The wizard prompts for name, description, author, permissions, and category, then
generates a ready-to-edit directory:

```
skill-example/
  SKILL.yaml        # manifest (source of truth)
  index.js          # skill entrypoint
  scripts/          # lifecycle hook implementations
  test/
    index.js        # starter test
  README.md
```

### 2. Implement your logic

Edit `index.js` and export the hook functions your skill needs:

```js
'use strict';

module.exports = {
  on_verify: require('./scripts/on_verify.js'),
};
```

### 3. Validate the manifest

```bash
npx @openbag/skill-cli skill validate
```

The CLI validates `SKILL.yaml` against [`skill-manifest.schema.json`](./skill-manifest.schema.json)
and reports any schema violations with precise field-level error messages.

### 4. Run tests

```bash
npx @openbag/skill-cli skill test
```

Any `.js` file inside `test/` is executed with Node.js. Tests pass if they exit 0.

### 5. Publish

```bash
npx @openbag/skill-cli skill publish
```

The command validates your manifest and then prints step-by-step instructions for
opening a Pull Request against the ClawHub-BR registry. Automated publishing via
API token is on the roadmap.

## SKILL.yaml reference

```yaml
name: skill-example
version: 0.1.0
license: MIT
authors:
  - Your Name <you@example.com>
display_name: Example Skill
description: A short description of what this skill does (20-600 chars).
category: community
maturity: alpha
permissions:
  - read:reputation_tier
  - write:agent_inbox
dependencies:
  agent: '>= 0.5.0'
hooks:
  on_verify: scripts/on_verify.js
```

## Resources

- [CLI Reference](./cli/README.md)
- [Skill Catalogue spec](../spec/03-skills.md)
- [Agent Gateway spec](../spec/08-gateway.md)
- [ClawHub-BR Registry spec](../spec/09-clawhub-br.md)
- [Manifest JSON Schema](./skill-manifest.schema.json)
