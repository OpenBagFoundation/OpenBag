# skill-rep

> Civic reputation engine for the OpenBag Agent. Calculates the worker's
> Bronze/Prata/Ouro/Diamante tier from local event history and exposes the
> current tier to other skills.

| Field | Value |
|-------|-------|
| **Skill ID** | `skill-rep` |
| **Version** | 1.0.0 |
| **Category** | core |
| **Maturity** | stable |
| **License** | MIT |

## Tier model

| Tier | Min age (days) | Min score | Min upheld reports | Notes |
|------|----------------|-----------|--------------------|-------|
| Bronze | 0 | 0 | 0 | Default on issuance |
| Prata | 180 | 1,000 | 1 | First tier with material benefit |
| Ouro | 365 | 5,000 | 3 | Mentor eligibility |
| Diamante | 730 | 15,000 | 5 | Foundation Board candidate |

Any worker with `recent_negatives > 2` is automatically capped at Bronze
until the negative window clears (90 days).

## Lifecycle hooks

| Hook | Effect |
|------|--------|
| `on_install` | Initialise tier=Bronze, score=0, empty event log |
| `on_first_run` | Read seal issuance date from agent for age calculation |
| `on_wake` | Recalculate tier every 6 h; emit `tier.changed` on transition |
| `on_tier_change` | Send local notification, append to tier history |

## Data stored locally

All reputation data lives in encrypted SQLCipher storage on the device.
Nothing leaves unless the worker explicitly exports a Verifiable Credential
(see [spec/10-interop.md](../../../spec/10-interop.md)).

| Key | Purpose |
|-----|---------|
| `current_tier` | Active tier (BRONZE/PRATA/OURO/DIAMANTE) |
| `score` | Aggregate civic score |
| `upheld_reports` | Sentinel reports confirmed by CIOPS |
| `recent_negatives` | Negative events in trailing 90 days |
| `tier_history` | Append-only list of `{ts, previous, current}` |

## Permissions

| Permission | Why |
|------------|-----|
| `read:reputation_tier` | Self-read for tier calculations |
| `read:platform_list` | Multi-platform weighted scoring |
| `read:status_current` | Cap tier when status is SUSPENSO |
| `write:reputation_event` | Append events to local log |
| `storage:encrypted_local` | Persist tier and history |
| `notifications:local` | Notify worker on tier change |

## Tests

```bash
cd sdk/skills/skill-rep
node test/index.js
```
