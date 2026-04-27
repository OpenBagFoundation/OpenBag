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

| Category       | Description                                                          |
|----------------|----------------------------------------------------------------------|
| `core`         | Built-in, pre-installed, maintained by Foundation TSC               |
| `community`    | Published to ClawHub-BR by community contributors                   |
| `experimental` | In active development; marked with a warning badge                  |

### Lifecycle hooks

A skill can implement any of these lifecycle hooks:

| Hook           | When it fires                                        |
|----------------|------------------------------------------------------|
| `onInstall`    | Immediately after the skill is installed             |
| `onUninstall`  | Before the skill is removed                         |
| `onVerify`     | When a citizen triggers a verification event         |

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
  test/
    index.js        # starter test
  README.md
```

### 2. Implement your logic

Edit `index.js` and export the hook functions your skill needs:

```js
'use strict';

module.exports = {
  async onVerify(context) {
    // context.emit('ble-broadcast', { payload: context.badge.id });
  },
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
apiVersion: openbag.org/v1alpha1
kind: Skill
metadata:
  name: skill-example          # kebab-case, unique in the registry
  version: 0.1.0               # semantic versioning
  description: One-line summary
  author: your-github-handle
  category: community          # core | community | experimental
  license: MIT
spec:
  permissions:                 # only request what you need
    - ble-scan
    - location
  entrypoint: index.js         # relative to the skill directory
  hooks:
    onInstall: null            # set to a function name to override
    onUninstall: null
    onVerify: null
```

## Resources

- [CLI Reference](./cli/README.md)
- [Skill Catalogue spec](../spec/03-skills.md)
- [Manifest JSON Schema](./skill-manifest.schema.json) _(generated — see schema source)_
- [Contributing Guide](../CONTRIBUTING.md)
- [ClawHub-BR Registry](https://github.com/openbag/clawhub-br)
