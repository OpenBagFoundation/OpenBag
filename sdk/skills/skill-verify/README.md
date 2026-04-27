# skill-verify

> Core verification handler for the OpenBag Agent. Responds to citizen
> verification events triggered via QR scan, NFC tap, or BLE proximity.

| Field | Value |
|-------|-------|
| **Skill ID** | `skill-verify` |
| **Version** | 1.0.0 |
| **Category** | core |
| **Maturity** | stable |
| **License** | MIT |

## What it does

This skill is the worker-side counterpart to App Verifica. When a citizen
triggers a verification (QR, NFC, BLE), the Agent fires an `on_verify` event;
this skill answers with the worker's:

- Seal code (the public OBAG-XXXXXX-XXXX-XX identifier)
- Masked name (`J*** S****`)
- Current status (`ATIVO`, `EM_ROTA`, `SUSPENSO`, `REVOGADO`)
- Reputation tier (`BRONZE`/`PRATA`/`OURO`/`DIAMANTE`)
- Active platform affiliations
- Issuance and expiry dates

Raw CPF, real full name, GPS coordinates, route history, and biometric
identifiers are **never** included in the response. Only the strictly
necessary minimum.

## Lifecycle hooks

| Hook | Effect |
|------|--------|
| `on_install` | Initialise storage, set defaults |
| `on_first_run` | Begin BLE advertising of the worker's seal code |
| `on_verify` | Build and return the verification payload |
| `on_wake` | Refresh BLE advertising every 5 min; stop if status revoked |

## Permissions

| Permission | Why |
|------------|-----|
| `read:reputation_tier` | Include tier in the verification response |
| `read:platform_list` | Show which platforms the worker is currently active on |
| `read:status_current` | Read seal status to enforce kill switch locally |
| `ble:advertise` | Broadcast seal beacon (rotating, see [spec/07](../../../spec/07-ble-beacon.md)) |
| `nfc:read` | Receive NFC-triggered verification challenges |
| `notifications:local` | Optional: notify the worker when verified |
| `storage:encrypted_local` | Persist the verify counter and config |

## Installation

```bash
openbag skill install skill-verify
```

## Tests

```bash
cd sdk/skills/skill-verify
node test/index.js
```

## Files

```
skill-verify/
  SKILL.yaml
  index.js
  scripts/
    on_install.js
    on_first_run.js
    on_verify.js
    on_wake.js
  test/
    index.js
  README.md
```
