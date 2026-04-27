# OpenBag Verifiable Credentials

This directory holds reference examples of the W3C Verifiable Credentials
issued and consumed by the OpenBag ecosystem.

| File | Credential type | Issuer | Subject |
|------|-----------------|--------|---------|
| [`worker-seal.example.json`](./worker-seal.example.json) | `OpenBagWorkerSeal` | Foundation | Worker DID |
| [`platform-affiliation.example.json`](./platform-affiliation.example.json) | `PlatformAffiliation` | Platform | Worker DID |
| [`academy-completion.example.json`](./academy-completion.example.json) | `AcademyCompletion` | Foundation | Worker DID |
| [`reputation-attestation.example.json`](./reputation-attestation.example.json) | `ReputationAttestation` | Foundation | Worker DID |
| [`presentation.example.json`](./presentation.example.json) | Verifiable Presentation | Worker | (verifier challenge) |

## JSON-LD context

OpenBag credential types extend the W3C VC v1 context with our own
property definitions, hosted at:

> https://openbag.foundation/contexts/v1

The full context document is mirrored in [`context-v1.json`](./context-v1.json)
in this directory for offline development.

## Signature suite

All examples use **Ed25519Signature2020**. Verifiers should also accept
`Ed25519Signature2018` for backward compatibility with older agents.

| Field | Value |
|-------|-------|
| `type` | `Ed25519Signature2020` |
| `proofPurpose` | `assertionMethod` |
| `verificationMethod` | `did:web:openbag.foundation#key-2026-04` |
| `proofValue` | base58-btc-encoded signature |

## Privacy guarantees

These credentials never contain:

- Raw CPF (only `cpfHash = SHA-256(cpf || foundation_salt)`)
- GPS coordinates (geohash-5 at most, only when status is EM_ROTA)
- Biometric template (Foundation never receives it)
- Real full name (`masked_name` only, e.g. `J*** S****`)
- Reporter identity (Sentinel reports never carry attribution)

## Selective disclosure (roadmap)

For Wave 2+, OpenBag will adopt **BBS+ signatures** to enable selective
disclosure: a worker can prove they are at least Prata tier without
revealing their exact score, or prove they are affiliated with iFood
without disclosing other platform affiliations.

The current Ed25519 examples are the v1 minimum interop floor.

## Verification flow

For citizen verification (App Verifica), the flow is:

```
1. Browser generates 16-byte random nonce (challenge)
2. Browser displays QR: { type: "openbag-verify-request", nonce, expires_in: 120 }
3. Worker's Agent scans QR, builds VP wrapping the OpenBagWorkerSeal VC,
   signs VP with the nonce in the proof.challenge field
4. Agent shows VP as QR (or sends over BLE in proximity mode)
5. Browser scans VP QR, resolves issuer DID, verifies Ed25519 signature
6. Browser checks proof.challenge matches the nonce it generated
7. Browser displays verification result (green check / red X)
```

The challenge–response prevents replay attacks. The verifier (citizen's
browser) caches the issuer's public key for 24 h to enable offline
verification.

See [`spec/10-interop.md`](../10-interop.md) for the full DID + VC spec.
