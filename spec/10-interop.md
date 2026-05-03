# Spec 10 — Interoperabilidade · Interoperability

> **Resumo (PT-BR):** Esta especificação define como o OpenBag se conecta a quatro camadas externas: (1) Identificadores Descentralizados W3C (DID) para identidade soberana portátil; (2) Credenciais Verificáveis W3C (VC) para credenciais à prova de adulteração; (3) Gov.br para âncora de identidade brasileira (CPF + biometria); e (4) ecossistema OpenClaw para reputação portátil via `skill-claw-bridge`. O objetivo é que um entregador possa carregar sua identidade e reputação entre plataformas, países e sistemas sem depender de nenhum provedor central.

**Status**: Draft | **Version**: 0.1.0 | **Date**: 2026-04

---

## 1. Overview

OpenBag is designed to interoperate with four external layers:

1. **W3C Decentralized Identifiers (DID)** — portable sovereign identity
2. **W3C Verifiable Credentials (VC)** — tamper-evident, privacy-preserving credential format
3. **Inter-agent communication** — mentor-mentee relationships, mesh BLE relay, presence verification
4. **Platform integrations** — iFood, Rappi, Uber Eats, Keeta, and future delivery platforms

---

## 2. W3C DID Integration

### 2.1 DID Method

OpenBag uses `did:web` for Foundation-issued identifiers and `did:key` for worker self-sovereign identifiers.

```
Worker DID:       did:key:z6Mk...      (Ed25519, generated on-device)
Foundation DID:   did:web:openbag.foundation
Platform DID:     did:web:api.ifood.com.br
```

**DID Document (worker):**

```json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:key:z6Mk...",
  "verificationMethod": [{
    "id": "did:key:z6Mk...#key-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:key:z6Mk...",
    "publicKeyMultibase": "z6Mk..."
  }],
  "authentication": ["did:key:z6Mk...#key-1"],
  "assertionMethod": ["did:key:z6Mk...#key-1"]
}
```

**Key management:**
- Private key generated in device Secure Enclave (iOS) or Android Keystore
- Key never leaves the device
- DID rotation supported: old DID remains valid for 90 days after rotation (revocation list)
- Recovery: 12-word BIP-39 mnemonic, shown once at setup, user stores offline

### 2.2 DID Resolution

The Agent Gateway includes a lightweight DID resolver:

```typescript
interface DIDResolver {
  resolve(did: string): Promise<DIDDocument>;
  verify(did: string, signature: Uint8Array, message: Uint8Array): Promise<boolean>;
}
```

For `did:web` resolution, the Gateway fetches `https://<domain>/.well-known/did.json`.
For `did:key`, resolution is deterministic (no network required).

Resolution results are cached for 1 hour with a 24-hour stale-while-revalidate window.

---

## 3. Verifiable Credentials

### 3.1 OpenBag Credential Types

| Credential Type | Issuer | Subject | Purpose |
|----------------|--------|---------|---------|
| `OpenBagWorkerSeal` | OpenBag Foundation (Gov.br) | Worker DID | Primary verification credential |
| `PlatformAffiliation` | Delivery platform | Worker DID | Confirms active employment |
| `ReputationAttestation` | OpenBag Foundation | Worker DID | Encodes tier snapshot |
| `AcademyCompletion` | OpenBag Foundation | Worker DID | Certifies training completion |
| `HardwareBinding` | Worker (self-issued) | Worker DID | Binds NFC/BLE hardware to identity |

### 3.2 OpenBagWorkerSeal Credential

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://openbag.foundation/contexts/v1"
  ],
  "type": ["VerifiableCredential", "OpenBagWorkerSeal"],
  "id": "urn:uuid:...",
  "issuer": "did:web:openbag.foundation",
  "issuanceDate": "2026-04-01T00:00:00Z",
  "expirationDate": "2027-04-01T00:00:00Z",
  "credentialSubject": {
    "id": "did:key:z6Mk...",
    "cpfHash": "sha256:...",
    "sealCode": "OBAG-a1b2c3-d4e5-f6",
    "tier": "prata",
    "platforms": ["ifood", "rappi"],
    "status": "ATIVO",
    "issuedAt": "2026-04-01T00:00:00Z"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2026-04-01T00:00:00Z",
    "verificationMethod": "did:web:openbag.foundation#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "..."
  }
}
```

**LGPD note**: CPF is never included in the credential — only `SHA256(cpf + per-worker-salt)`. The salt is stored only on the worker's device and in the Gov.br backend (under legal basis Art. 11, Lei 13.709/2018).

### 3.3 Presentation Protocol

For citizen verification, workers present a **Verifiable Presentation (VP)** via QR code or BLE:

```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiablePresentation"],
  "verifiableCredential": ["<OpenBagWorkerSeal>"],
  "proof": {
    "type": "Ed25519Signature2020",
    "challenge": "<random-nonce-from-verifier>",
    "domain": "openbag.foundation",
    "proofValue": "..."
  }
}
```

The challenge-response prevents replay attacks. The verifier (citizen's browser) generates a nonce, encodes it in the QR code, and the worker's Agent signs the VP with that nonce.

**Verification flow (citizen side — browser-only):**

```
1. Browser generates 16-byte random nonce
2. Displays QR: { type: "openbag-verify-request", nonce, expires_in: 120 }
3. Worker's Agent scans QR, signs VP with nonce
4. Agent displays VP as QR (or sends over BLE if proximity mode)
5. Browser scans VP QR, resolves worker's DID, verifies Ed25519 signature
6. Browser checks credential against Foundation's revocation list (optional)
7. Shows verification result (no server call required for offline mode)
```

---

## 4. Inter-Agent Communication

### 4.1 Mentor-Mentee Protocol

Experienced workers (Ouro/Diamante tier) can act as mentors for new workers. Mentorship creates a peer-to-peer trust relationship between two Agent instances.

**Mentorship establishment:**

```
Mentor Agent          Mentee Agent
     │                     │
     │──── BLE scan ───────>│
     │<─── beacon ──────────│
     │                     │
     │  BLE L2CAP channel  │
     │<════════════════════>│
     │                     │
     │  DID exchange (ECDH key agreement)
     │<════════════════════>│
     │                     │
     │  Mentor signs MentorshipCredential
     │  { mentee: DID, validUntil: 30 days }
     │─────────────────────>│
     │                     │
     │  Mentee Agent stores credential
     │  Mentor Agent records in audit log
```

**Mentorship effects:**
- Mentee earns +5% reputation score multiplier for first 30 days
- Mentor earns `write:reputation_event` for mentee (bounded: +/- 2 points/day)
- Visible in Verifica app: "Mentored by [Mentor Name] (Ouro)"

### 4.2 Mesh BLE Relay

In areas with poor connectivity (favelas, underground markets), Agents can relay verification events over a BLE mesh:

**Relay protocol:**

```
Node A (offline)   Node B (relay)    Node C (internet)
    │                   │                   │
    │── BLE adv ───────>│                   │
    │  { type: "openbag-relay-req",          │
    │    payload: <encrypted VP>,            │
    │    ttl: 3 }                            │
    │                   │                   │
    │                   │── BLE adv ───────>│
    │                   │  { ttl: 2 ... }   │
    │                   │                   │── HTTPS POST ──> Foundation API
    │                   │                   │<─ 200 OK ────────
    │                   │<── BLE ──────────│
    │                   │  { type: "openbag-relay-ack",
    │                   │    result: "verified" }
    │<── BLE ──────────│
    │  { result: "verified" }
```

**Relay constraints:**
- TTL ≤ 5 hops
- Payload encrypted to Foundation public key (workers can't read each other's VPs)
- Each relay node logs the event hash (not content) for spam detection
- Relay is opt-in — workers must enable "Mesh Relay" in Agent settings

### 4.3 BLE Proximity Verification

For same-location verification without internet:

```
Citizen Browser (WebBLE)     Worker Agent
        │                         │
        │── WebBLE scan ─────────>│
        │<─ GATT service ─────────│
        │   service: 0x4F42 (OB)  │
        │   char:    0x5645 (VE)  │
        │                         │
        │── read characteristic──>│
        │<── VP bytes (MTU chunks)│
        │                         │
        │  verify locally (Ed25519)
        │  → show result
```

This requires no internet connection. The citizen's browser verifies the credential cryptographically using the worker's public key (embedded in the VP or resolved from DID document cached on device).

---

## 5. Platform Integrations

### 5.1 Platform Identity Attestation

Delivery platforms (iFood, Rappi, Uber Eats, Keeta) can issue `PlatformAffiliation` credentials to workers via the Gov.br Seal API.

**Flow:**

```
Worker            Platform API         OpenBag Foundation
   │                   │                      │
   │── OAuth login ───>│                      │
   │<─ platform_token ─│                      │
   │                   │                      │
   │── POST /issue ────────────────────────>  │
   │   { cpf_hash, platform: "ifood",         │
   │     platform_token }                     │
   │                   │──── verify token ───>│ (platform side)
   │<─────────────────── 201 { seal_code } ───│
```

Platform API keys are issued by the Foundation under a participation agreement. Platforms must agree to:
- Not store the CPF hash on their end (they submit it, Foundation stores it)
- Honor the kill-switch API
- Notify Foundation of account termination within 24h

### 5.2 Cross-Platform Reputation

When a worker is active on multiple platforms, reputation events from all platforms are aggregated. Each platform event is weighted:

```
reputation_score = Σ (platform_weight[p] × events[p]) / Σ platform_weight[p]

platform_weight:
  ifood:     1.0   (largest market share)
  rappi:     1.0
  uber_eats: 1.0
  keeta:     0.9
  loggi:     0.9
  shopper:   0.8
  other:     0.7
```

A skill (`skill-platform-sync`) handles the periodic sync of reputation events from each platform, using the `http:platform.com.br/api/*` permission pattern.

### 5.3 Future Interop Targets

| System | Status | Notes |
|--------|--------|-------|
| SAMU (health emergency) | Planned | Panic button → SAMU dispatch integration |
| CIOPS-SP (civil police) | Planned | Sentinel module, worker ID for incident reports |
| Caixa Econômica Federal | Planned | Micro-credit integration (skill-finance) |
| BB Seguros | Planned | Accident insurance integration |
| Sebrae Brasil | Active | Academy content + MEI onboarding |
| DETRAN-SP | Exploratory | Driving record verification |
| Correios | Exploratory | Last-mile expansion to postal network |

---

## 6. Data Portability (LGPD Art. 18)

Workers may export all their OpenBag data in a portable format:

```
openbag-export-<timestamp>.zip
├── identity.json          # DID document + public key
├── credentials/
│   ├── worker-seal.json   # OpenBagWorkerSeal VC
│   ├── affiliations.json  # PlatformAffiliation VCs
│   └── academy.json       # AcademyCompletion VCs
├── reputation-history.json
├── audit-log.csv
└── README.txt
```

The export is generated on-device, encrypted with the worker's key, and never passes through Foundation servers. Workers can import this bundle on a new device or share it with a new platform.

---

## References

- [Spec 02 — Agent](02-agent.md)
- [Spec 03 — Skills](03-skills.md)
- [Spec 05 — Reputation](05-reputation.md)
- [Spec 06 — Academy](06-academy.md)
- [Spec 07 — BLE Beacon](07-ble-beacon.md)
- [Spec 08 — Gateway](08-gateway.md)
- [LGPD Analysis](../docs/LGPD-analysis.md)
- [W3C DID Core](https://www.w3.org/TR/did-core/)
- [W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)
