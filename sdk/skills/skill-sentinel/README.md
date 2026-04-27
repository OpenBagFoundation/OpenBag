# skill-sentinel

> Anonymous incident reporting skill. Encrypts reports client-side, routes
> through the Foundation mixnet, never logs reporter identity.

| Field | Value |
|-------|-------|
| **Skill ID** | `skill-sentinel` |
| **Version** | 1.0.0 |
| **Category** | core-sensitive |
| **Maturity** | beta |
| **License** | MIT |

## Anonymity guarantees

This skill is intentionally a **core-sensitive** capability. The threat
model assumes the reporter (a delivery worker) is reporting on people
they may have to interact with daily; protecting their identity is
non-negotiable.

| Threat | Mitigation |
|--------|-----------|
| Report content readable by Foundation operators | Client-side encryption to Foundation public key (ECIES). Operators decrypt only inside an air-gapped enclave for the assigned case. |
| Report linkable to reporter | No auth header. Mixnet (Tor-style) routing strips IP. |
| Report linkable to seal_code | Each envelope has a fresh 16-byte nonce. No seal_code, worker_hash, or DID in the outer envelope. |
| Replay or tampering | Envelope has a server-side timestamp; tampering breaks the AEAD tag. |
| Coercion to retract | Reports are write-only from worker side; the worker cannot "see" or "delete" what they sent. |

See [`spec/04-sentinel.md`](../../../spec/04-sentinel.md) for the full
3-layer protection model (technical + operational + physical).

## Report types

| Type | Use case |
|------|----------|
| `suspicious_verification` | A bag that fails BLE/NFC/QR verification |
| `fake_bag` | Visible counterfeit OpenBag equipment |
| `hostility_against_worker` | Citizen aggression toward a legitimate worker |
| `incorrect_seal_data` | Worker's own seal shows wrong tier/platform |
| `other` | Free-form |

## Lifecycle hooks

| Hook | Effect |
|------|--------|
| `on_install` | Initialise local storage; reset queues |
| `on_verify` | Auto-submit if event has `flag_suspicious: true` |

The skill also exposes `submitReport(context, report)` for direct use
from app UI.

## Permissions

| Permission | Why |
|------------|-----|
| `read:status_current` | Don't submit if seal is REVOGADO (user would never see it) |
| `write:agent_inbox` | Surface "Relato enviado" in agent inbox |
| `location:geohash7` | Coarse location (~150 m) attached to incident |
| `notifications:local` | Confirm submission to the worker |
| `storage:encrypted_local` | Queue reports when offline |
| `http:sentinel.openbag.foundation/v0/reports` | The single allowed network destination |

## Tests

```bash
cd sdk/skills/skill-sentinel
node test/index.js
```
