# Platform Integration Guide

> **Audience**: engineering teams at iFood, Rappi, Keeta, Uber Eats, Mercado
> Livre, Loggi, Shopper, and any future delivery platform that wants to
> integrate with the OpenBag standard.

| Field | Value |
|-------|-------|
| **Version** | 0.1.0 |
| **Date** | 2026-04 |
| **Status** | Draft for partner review |
| **Contact** | partnerships@openbag.foundation |

---

## 1. Why integrate?

Three concrete benefits for the platform:

1. **Lower fraud rate** — only workers who passed Gov.br liveness can
   present a valid OpenBag seal. Counterfeit accounts can be detected at
   verification time, not after the fact.
2. **Civic reputation as a hiring signal** — Ouro/Diamante tier is a
   third-party-verifiable indicator of long-term reliability.
3. **Compliance hedge** — public verification reduces exposure to civil
   liability when a counterfeit-bag attack happens through your brand.

Three concrete benefits for the workers your platform employs:

1. **Identity portability** — they keep their reputation if they switch
   platforms.
2. **Tier-based benefits** — Caixa microcredit, BB Seguros health discount,
   priority CLT vacancies (where applicable).
3. **Safety** — panic button, anonymous reporting, mesh BLE relay.

---

## 2. Integration surface (5 endpoints)

The full API spec is in [`spec/api/govbr-seal.openapi.yaml`](../spec/api/govbr-seal.openapi.yaml).
For platform integrators, the four endpoints that matter are:

| Endpoint | Purpose | Auth |
|----------|---------|------|
| `POST /v0/selo/issue` | Co-issue a seal during your onboarding flow | Gov.br JWT (`openbag:issue`) |
| `GET /v0/selo/worker/{worker_hash}` | Check seal status for a worker on your platform | Platform API Key |
| `PATCH /v0/selo/worker/{worker_hash}/status` | Kill switch (your worker is terminated) | Gov.br JWT (`openbag:admin`) |
| `GET /v0/selo/coverage` | Public coverage stats (no auth) | none |
| `POST /v0/selo/worker/{worker_hash}/verify-biometric` | Trigger fresh liveness | Platform API Key |

---

## 3. Onboarding integration (POST /issue)

If your platform already runs its own KYC, you can co-issue an OpenBag
seal at the same time. The flow is:

```
Worker             Your Platform                Foundation
  │                     │                           │
  │── KYC submission ──>│                           │
  │   (CPF, biometric)  │                           │
  │                     │                           │
  │                     │── Gov.br liveness ───────>│ (Serpro)
  │                     │<── biometric_session_id ──│
  │                     │                           │
  │                     │── POST /v0/selo/issue ───>│ Foundation
  │                     │   {cpf, full_name,        │
  │                     │    platforms: ["IFOOD"],  │
  │                     │    biometric_session_id,  │
  │                     │    consent_version}       │
  │                     │<── 201 {seal_code, ...} ──│
  │<── seal_code, QR ───│                           │
```

Important constraints:

- The CPF you submit is **never stored** by Foundation. It is hashed on
  receipt and discarded.
- You must submit a fresh `biometric_session_id` (≤ 300 s old) from the
  same Gov.br session — Foundation re-validates.
- `consent_version` is the version of the LGPD consent the worker signed.
  Foundation stores this for audit.

---

## 4. Status check (GET /worker/{worker_hash})

Use this to verify a worker's seal status during a delivery.

```http
GET /v0/selo/worker/sha256:9f7b3a2e1d4c5b6a/?platform=IFOOD HTTP/1.1
Host: api.openbag.foundation
X-OpenBag-Platform-Key: <your-platform-key>
```

Response (200):

```json
{
  "seal_code": "OBAG-A1B2C3-Z9Y8-X4",
  "worker_hash": "sha256:9f7b3a2e1d4c5b6a",
  "status": "ATIVO",
  "tier": "PRATA",
  "platforms": ["IFOOD", "RAPPI"],
  "issued_at": "2026-04-01T12:00:00-03:00",
  "expires_at": "2027-04-01T12:00:00-03:00",
  "last_verified_at": "2026-04-26T14:30:00-03:00"
}
```

Caching: TTL 60 s. The `last_verified_at` field rotates every minute when
the worker is active; use it to detect stale caches.

Rate limit: **1,000 requests/minute per platform key** (see
[`spec/api/README.md`](../spec/api/README.md#rate-limits)).

---

## 5. Kill switch (PATCH /status)

When you terminate a worker on your platform (fraud, ToS violation,
voluntary departure), call:

```http
PATCH /v0/selo/worker/sha256:9f7b3a2e1d4c5b6a/status HTTP/1.1
Host: api.openbag.foundation
Authorization: Bearer <your-gov.br-jwt-with-openbag:admin>
Content-Type: application/json

{
  "status":      "REVOGADO",
  "reason":      "Platform termination — case ifood-ops-2026-04-1138",
  "operator_id": "ifood-ops-204",
  "evidence_url":"https://ifood.com.br/cases/2026-04-1138"
}
```

The kill switch propagates to all CDN edges and platform mirrors in
**< 30 seconds (p95)**, alerted at > 60 s.

Important:

- Kill switch is for **your platform's relationship with this worker**.
  Other platforms can keep the worker active. Foundation only revokes the
  seal globally if all platforms have killed it OR if Gov.br itself
  revokes the underlying CPF.
- Every kill-switch action is audit-logged with `operator_id`, `reason`,
  and `evidence_url`. The audit log is published as a Merkle root (see
  [`spec/api/README.md` § Audit](../spec/api/README.md)).

---

## 6. Onboarding flow (your side)

Recommended user journey when adding OpenBag to your existing courier
onboarding:

```
Step 1. Standard KYC (your existing flow)
Step 2. "Want to also enrol in OpenBag?" — opt-in screen
        - One paragraph: what OpenBag is, in plain Portuguese
        - Three bullets: lower-fraud, civic reputation, microcredit access
        - "Saiba mais" link to openbag.foundation/sobre
Step 3. If yes → call POST /issue with the biometric_session_id you
        already have from your Gov.br session
Step 4. Display seal_code + QR to the worker
Step 5. Email/SMS the worker the seal and a link to install
        the OpenBag Agent app for full features (panic, mesh, mentor)
```

**Default to opt-in, never opt-out.** LGPD requires the worker to
explicitly consent.

---

## 7. Reputation event ingestion (write API, planned)

Coming in Wave 2: platforms can submit reputation events via:

```http
POST /v0/selo/worker/{worker_hash}/reputation-event
```

Allowed event types:
- `delivery_completed` — basic positive event (+1 score)
- `customer_rating_5_star` — bonus (+5 score)
- `dispute_resolved_in_favor` — major (+50 score)
- `safety_incident_resolved` — bonus (+20 score)
- `payment_dispute_lost` — negative (−10 score, contributes to negatives count)
- `late_delivery_repeated` — negative (−5 score)

Constraints:
- Each event must reference a verifiable underlying transaction (delivery
  ID, dispute ID, etc.) — Foundation may audit these on request.
- Platforms cannot submit unbounded events; rate-limited per worker per day.
- Workers can appeal any event within 72 h (Art. 20 LGPD).

---

## 8. LGPD obligations for platforms

Once you accept seal data via this API, you become a **data controller**
under Lei 13.709/2018 alongside Foundation. Specifically:

| Obligation | What you must do |
|------------|------------------|
| DPA with Foundation | Sign the standard MOU before key issuance |
| No CPF storage | You may submit a CPF to /issue but must not store it; only `worker_hash` |
| Honor kill switch | When Foundation revokes a seal, you must honour it within 30 s |
| Log all reads | Internal audit log of every `worker_hash` lookup, retained 24 mo |
| Respond to Art. 18 requests | Workers can request the list of times you queried their seal |

---

## 9. SLA and rate limits

| Endpoint | SLA target | Rate limit |
|----------|-----------|------------|
| `GET /worker/{hash}` | p99 < 200 ms | 1000 req/min/platform |
| `POST /issue` | p99 < 2 s | 60 req/min/operator |
| `PATCH /worker/{hash}/status` | p95 propagation < 30 s | 30 req/min/operator |
| `GET /coverage` | p99 < 500 ms | 30 req/min/IP |

If you exceed limits, you receive `429` with `Retry-After`.

---

## 10. Sandbox and testing

A staging environment is available at:

```
https://api-staging.openbag.foundation/v0/selo
```

Staging accepts test CPFs in the range `99999999000`–`99999999999` and
synthesises a `biometric_session_id` automatically (no real Gov.br call).
**Never use production CPFs in staging.**

Mock server from the OpenAPI spec:

```bash
npx @stoplight/prism-cli mock spec/api/govbr-seal.openapi.yaml
```

---

## 11. Onboarding checklist

Before going live:

- [ ] DPA / MOU signed with Foundation
- [ ] Platform API key issued (rotated quarterly)
- [ ] Gov.br OAuth app registered with `openbag:issue` and `openbag:admin` scopes
- [ ] Worker opt-in screen reviewed by your LGPD counsel
- [ ] Internal audit log for `worker_hash` lookups in place
- [ ] Kill-switch automation tested end-to-end
- [ ] Staging integration smoke test passing
- [ ] On-call playbook for kill-switch propagation > 60 s alert

---

## 12. Contact

| Topic | Contact |
|-------|---------|
| Partnership inquiries | partnerships@openbag.foundation |
| Technical integration | tech@openbag.foundation |
| Security disclosures | security@openbag.foundation (PGP key in [SECURITY.md](../SECURITY.md)) |
| LGPD / DPO | dpo@openbag.foundation |
