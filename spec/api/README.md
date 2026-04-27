# OpenBag API Specifications

Formal OpenAPI 3.1 specifications for the OpenBag Foundation public APIs.

## Files

| File | Surface | Status |
|------|---------|--------|
| [`govbr-seal.openapi.yaml`](./govbr-seal.openapi.yaml) | Digital Seal issuance, verification, kill switch | Draft v0.1.0 |
| `clawhub-br.openapi.yaml` | Skill registry (planned) | Not yet drafted |
| `sentinel.openapi.yaml` | Anonymous report ingest (planned) | Not yet drafted — depends on mixnet design |

## Design philosophy

### LGPD-first

- **No raw PII over the wire after issuance.** CPF enters once at `POST /issue`,
  is hashed immediately, and only `worker_hash = SHA256(cpf || foundation_salt)` is
  used in subsequent calls.
- **Consent versioning.** Every issuance request carries a `consent_version`
  field referencing the exact LGPD consent document the worker signed.
- **Right to deletion.** A `DELETE /worker/{worker_hash}` endpoint (planned
  v0.2) tombstones the record while preserving cryptographic continuity for
  audit trails.

### Public verification is the only unauthenticated surface

`GET /verify/{seal_code}` is the citizen-facing endpoint. Everything else
requires either a Gov.br OAuth2 token (with explicit scopes) or a platform API
key issued under signed MOU. Rate limits on the public endpoint are aggressive
(100 req/min/IP) and tracked for transparency reporting.

### Kill switch SLO

`PATCH /worker/{worker_hash}/status` to `REVOGADO` MUST propagate to all CDN
edges and platform mirrors in **<30 seconds (p95)**. Beyond 60 seconds an
on-call alert fires. The propagation latency is published in `/health`.

### Audit trail as a public good

Every write endpoint is marked `x-openbag-audit: true`. Audit logs are:

1. Append-only (immutable storage)
2. Periodically (hourly) committed as a Merkle root to the Foundation's
   transparency endpoint
3. Each operator action carries `operator_id` and `reason`

This means a citizen, journalist, or auditor can independently verify that no
record has been silently modified or deleted post-hoc.

## Auth flows

### Gov.br OAuth2 (for human admins / Foundation operators)

```
1. Operator hits /authorize on idp.gov.br
2. Receives JWT with scopes: openbag:read | openbag:issue | openbag:admin
3. Operator presents JWT in Authorization: Bearer header
4. OpenBag API verifies signature against Gov.br JWKS (cached 1h)
```

### Platform API key (for iFood, Rappi, Keeta, etc.)

```
1. Platform signs MOU with Foundation
2. Foundation issues key pair (rotated quarterly)
3. Platform sends X-OpenBag-Platform-Key: <key> header
4. All actions audit-logged with platform identity
```

### Citizen verification (no auth)

```
1. App Verifica scans QR / NFC / BLE
2. App Verifica calls GET /verify/{seal_code}
3. Response cached locally (TTL = expires_at - now, max 5 min)
```

## Rate limits

| Endpoint | Scope | Limit |
|----------|-------|-------|
| `GET /verify/{seal_code}` | per IP | 100/min |
| `GET /coverage` | per IP | 30/min |
| `POST /issue` | per Gov.br operator | 60/min |
| `PATCH /worker/{worker_hash}/status` | per Gov.br operator | 30/min |
| `GET /worker/{worker_hash}` | per platform key | 1000/min |

429 responses include `Retry-After` and `X-RateLimit-Reset` headers.

## Versioning

URL-based versioning: `/v0/selo`. Breaking changes bump the version. v0 is
explicitly unstable and may be revised during Phase α/β. v1 is the first
backwards-compatible API.

## Testing

A mock server can be spun up from this spec via:

```bash
npx @stoplight/prism-cli mock spec/api/govbr-seal.openapi.yaml
```

Or imported into Postman / Insomnia for interactive exploration.

## Related documents

- [`docs/RFC-001.md`](../../docs/RFC-001.md) — Architecture overview
- [`spec/01-architecture.md`](../01-architecture.md) — Pillar 01 detail
- [`docs/LGPD-analysis.md`](../../docs/LGPD-analysis.md) — Compliance analysis
- [`SECURITY.md`](../../SECURITY.md) — Threat model and disclosure policy
