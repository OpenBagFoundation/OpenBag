# Spec 11 — Fluxo de Onboarding do Entregador · Worker Onboarding Flow

> **Resumo (PT-BR):** Esta especificação define o fluxo completo que um novo entregador percorre desde a primeira abertura do app OpenBag Agent até ter um Selo Digital ativo transmitindo na bag. O fluxo foi desenhado para funcionar em celulares de entrada com conexão intermitente, respeitar a LGPD em cada etapa, e completar o onboarding essencial em menos de 10 minutos. A especificação técnica está em inglês; a UX de onboarding visível ao trabalhador é totalmente em português.

**Status**: Draft | **Version**: 0.1.0 | **Date**: 2026-04

This spec defines the end-to-end flow a new worker (entregador) follows
from first opening the OpenBag Agent app to having an active Digital Seal
broadcasting on their bag.

---

## 1. Goal and constraints

The onboarding flow has to satisfy four constraints simultaneously:

1. **LGPD-compliant from step 1** — explicit, granular, plain-Portuguese consent
   captured *before* any sensitive data is collected.
2. **Local-first** — keys generated on-device; raw biometric never leaves
   Serpro infrastructure; CPF hashed client-side.
3. **Usable on a R$400 phone** — no large model downloads; works on Android 9+.
4. **Field-coordinator–compatible** — at academy graduation, a coordinator
   can guide a cohort of 50 workers through the flow in under 90 minutes.

Target completion time end-to-end: **8 minutes** for a self-driven worker,
**12 minutes** in an assisted academy session.

---

## 2. Flow overview

```
[1. Welcome]
    │
    ▼
[2. LGPD consent (granular, versioned)]
    │
    ▼
[3. Gov.br OAuth login]
    │   (Serpro biometric liveness happens inside Gov.br webview)
    │
    ▼
[4. Foundation /issue call]
    │   POST cpf+name+platforms+biometric_session_id+consent_version
    │   ←  seal_code, seal_id, tier=BRONZE, status=ATIVO
    │
    ▼
[5. On-device DID generation (Ed25519)]
    │   private key → secure enclave; public key → DID document
    │
    ▼
[6. Hardware pairing (BLE LESC)]
    │   bag/colete + crachá vivo if present
    │
    ▼
[7. Skill bootstrap]
    │   install: skill-verify, skill-rep, skill-panic, skill-academy
    │   each surfaces a permission dialog
    │
    ▼
[8. First-run hooks fire]
    │   skill-verify begins BLE advertise; skill-rep records seal_issued_at
    │
    ▼
[9. Done — home screen]
```

---

## 3. Step-by-step

### Step 1 — Welcome (15 s)

| Element | Content |
|---------|---------|
| Title | "Bem-vinda ao OpenBag" |
| Body | One paragraph: what the app does, who runs it, that it is open-source |
| Footer | Two buttons: "Começar" / "Já tenho selo" (recovery flow, see §6) |

### Step 2 — LGPD consent (60 s)

The user is shown a single screen with **four toggles**, each defaulting to OFF.
The user must tick at least the first to proceed; the others are optional.

| Toggle | Required? | What it covers |
|--------|-----------|----------------|
| Identity processing (CPF hash, name, platform list) | **Required** | Art. 7, I + IX |
| Biometric liveness (Serpro one-time, hash-only) | **Required** | Art. 11, I |
| Anonymised geohash-5 sharing while EM_ROTA | Optional | Art. 7, I |
| Tier history retention for benefit eligibility | Optional | Art. 7, I |

The exact `consent_version` string ("lgpd-consent-2026-04-15") is stored
locally and submitted to `/issue`. The consent text itself is fetched from
`https://transparency.openbag.foundation/consent/<version>.md` for the
worker's archive.

### Step 3 — Gov.br OAuth (90 s)

The agent opens an in-app webview to `https://idp.gov.br/authorize` with:

```
response_type=code
client_id=<openbag-prod-client>
scope=openid+profile+cpf+phone+biometric.match
redirect_uri=openbag://oauth/callback
state=<csrf>
nonce=<replay-protection>
```

Inside the webview, Serpro performs a liveness check and matches against
the federal biometric registry. On success, the redirect carries a
short-lived code; the agent exchanges it for a JWT and a `biometric_session_id`
(≤ 300 s TTL).

### Step 4 — Foundation issuance (10 s)

```
POST /v0/selo/issue
Authorization: Bearer <gov.br JWT>
Content-Type: application/json

{
  "cpf":                   "<11 digits>",
  "full_name":             "<from Gov.br profile>",
  "birth_date":            "<from Gov.br profile>",
  "platforms":             ["IFOOD", "RAPPI"],
  "biometric_session_id":  "<from step 3>",
  "academy_certificate":   "openbag-academy/2026-04/heliopolis/042",
  "consent_version":       "lgpd-consent-2026-04-15"
}
```

Response (201):

```json
{
  "seal_id": "uuid-v4",
  "seal_code": "OBAG-A1B2C3-Z9Y8-X4",
  "worker_hash": "sha256:9f7b...",
  "status": "ATIVO",
  "tier": "BRONZE",
  "platforms": ["IFOOD", "RAPPI"],
  "issued_at": "2026-04-26T14:00:00-03:00",
  "expires_at": "2027-04-26T14:00:00-03:00"
}
```

The Foundation server immediately discards the raw CPF. It is hashed on
receipt and the hash is what is stored.

### Step 5 — On-device DID generation (5 s)

The agent generates an Ed25519 keypair using the device Secure Enclave
(iOS) or Android Keystore. The private key is non-extractable. The public
key is encoded as `did:key:z6Mk...` (multibase Ed25519).

The DID is bound to the seal by storing it in `~/.openbag/identity.json`:

```json
{
  "did": "did:key:z6MkfooBar...",
  "seal_code": "OBAG-A1B2C3-Z9Y8-X4",
  "seal_id": "uuid-v4",
  "created_at": "2026-04-26T14:00:05-03:00",
  "recovery_phrase_acknowledged": true
}
```

A **12-word BIP-39 mnemonic** is shown to the worker exactly once. The
agent checks a confirmation tickbox before continuing — if the worker
loses the device, this phrase plus a fresh Gov.br session is the only
recovery path.

### Step 6 — Hardware pairing (60–120 s)

If hardware was distributed at academy graduation, the worker pairs it now.

Bag/colete (NFC + BLE):
1. Worker taps the bag NFC sticker against the phone.
2. Agent reads the factory-provisioned `device_pub_key`.
3. Agent initiates BLE LESC pairing (LE Secure Connections).
4. Agent sends an encrypted `seal_id` to the bag over the paired channel.
5. Bag derives `worker_key = HKDF(root_key, salt=seal_id, info="openbag-ble-v1")`.
6. Pairing channel closes; bag enters advertising-only mode.

Crachá vivo (BLE + e-paper + GPS):
- Same flow as bag, plus first e-paper push (status colour, rotating code).

If no hardware is distributed (Phase α digital-only mode), this step is
skipped and the worker uses screen-QR for verification.

### Step 7 — Skill bootstrap (60 s)

The agent installs the four core skills in sequence, showing a permission
dialog for each:

| Skill | Permissions surfaced to user |
|-------|------------------------------|
| `skill-verify` | "Para responder verificações: Bluetooth, NFC, notificações" |
| `skill-rep` | "Para calcular seu tier: ler tier, escrever eventos locais" |
| `skill-panic` | "Para o botão de pânico: localização exata, notificações, internet" |
| `skill-academy` | "Para sua trilha de formação: leitura/escrita Academy, internet" |

Each dialog explains in plain Portuguese what each scope means, with a
"Saiba mais" link. The user can decline any skill — `skill-verify` is the
only one that, if declined, blocks the flow.

### Step 8 — First-run hooks (10 s)

The agent fires `on_install` then `on_first_run` for each installed skill
in dependency order. Hooks have 30 s timeout each (see [spec/08](08-gateway.md)).

If any hook fails, the agent records the failure in the audit log and
continues — failed hooks can be retried from settings.

### Step 9 — Done (15 s)

Final screen: green check, the seal_code in large monospace, a small QR
preview, and a "Ver meu perfil" button leading to the agent home.

---

## 4. Failure modes and recovery

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Gov.br liveness fails | OAuth returns `error=biometric_failed` | Retry up to 3×; on 3rd failure, instruct visit to nearest Poupatempo |
| `/issue` returns 409 (active seal exists) | HTTP 409 | Offer "Recover existing seal" (§6) |
| `/issue` returns 403 (SINESP block) | HTTP 403 | Show "Seu CPF tem pendências SINESP. Veja em poupatempo.sp.gov.br" |
| Hardware pairing times out | BLE timeout 30 s | Skip step; mark hardware status `unpaired`; can retry from settings |
| Skill install fails | Hook timeout/error | Retry from settings; non-blocking unless skill-verify |
| Network unavailable mid-flow | `fetch` error | Cache state; resume from last completed step on reconnect |

---

## 5. Telemetry (LGPD-compliant)

The onboarding flow emits **anonymous** telemetry events to help iterate
on UX. None of these events carries the worker_hash, DID, or seal_code.

| Event | Payload |
|-------|---------|
| `onboarding.started` | `{client_version, locale}` |
| `onboarding.consent_granted` | `{consent_version, optional_toggles_count}` |
| `onboarding.gov_br_completed` | `{duration_ms}` |
| `onboarding.issue_succeeded` | `{duration_ms}` |
| `onboarding.hardware_paired` | `{hw_type, duration_ms}` |
| `onboarding.completed` | `{total_duration_ms, skipped_steps}` |
| `onboarding.failed` | `{step, error_code}` (no PII in error_code) |

Telemetry is opt-in at step 2 (one of the optional toggles). When opted
out, no event is emitted.

---

## 6. Recovery flow ("Já tenho selo")

If the worker reinstalls the app or moves to a new phone, they can
recover their seal:

1. Welcome → "Já tenho selo"
2. Gov.br OAuth (same as §3, full liveness)
3. Worker enters their **12-word recovery phrase**
4. Agent re-derives the Ed25519 keypair from the phrase
5. Agent calls `GET /v0/selo/worker/{worker_hash}` (the hash is rederivable from CPF+salt)
6. Foundation returns the existing seal payload
7. Skill bootstrap (§7) runs — skill data on the new device is empty;
   reputation history is recoverable only if previously exported as VC

Workers without their recovery phrase can re-enrol from scratch — they
will get a new DID but the same seal_code (Foundation links by `worker_hash`).

---

## 7. Field-coordinator mode

For academy graduations and similar batch events, coordinators can use
the **Selo v0 tool** (`tools/seal-v0/`) to issue Phase α seals without the
full Gov.br + biometric flow. This mode is explicitly limited to the α
polygon and produces seals with a 30-day TTL — they must be re-issued via
the normal flow before Phase β.

---

## References

- [Spec 01 — Architecture](01-architecture.md)
- [Spec 02 — Agent](02-agent.md)
- [Spec 07 — BLE Beacon](07-ble-beacon.md) (key derivation, pairing)
- [Spec 08 — Gateway](08-gateway.md) (skill install, permission dialogs)
- [Spec 10 — Interoperability](10-interop.md) (DID, VC)
- [LGPD Analysis](../docs/LGPD-analysis.md)
- [API Spec](api/govbr-seal.openapi.yaml)
