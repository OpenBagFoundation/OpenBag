# Análise de Conformidade LGPD · OpenBag Foundation

> 🇬🇧 *English version below — this document is primarily in English for international legal reference, with a Portuguese executive summary above.*

| Campo | Valor |
|-------|-------|
| **Versão** | 0.1.0-rascunho |
| **Data** | 2026-04-26 |
| **Status** | Rascunho para comentário público — resolve issue #007 |
| **Lei aplicável** | Lei Geral de Proteção de Dados (LGPD), Lei 13.709/2018 |
| **Órgão regulador** | ANPD (Autoridade Nacional de Proteção de Dados) |
| **Autores** | Grupo de Trabalho Jurídico · OpenBag Foundation |

> **Aviso legal**: Este documento é uma análise de boa-fé para revisão pública. Não constitui aconselhamento jurídico. A Fundação contratará assessoria certificada em LGPD e submeterá à revisão da ANPD antes de qualquer implantação em produção.

---

## Resumo executivo (PT-BR)

O OpenBag processa dados pessoais — incluindo dados biométricos classificados como sensíveis pelo Art. 11 da LGPD — a serviço de uma missão clara de segurança pública: reduzir crimes violentos contra e por meio de entregadores no Brasil.

**Decisões de design que minimizam o risco LGPD:**

1. **Arquitetura local-first** — o agente pessoal do trabalhador roda no próprio dispositivo. Dados sensíveis (biometria bruta, histórico de rotas, relatos Sentinel) nunca chegam aos servidores da Fundação.
2. **Nenhum CPF bruto armazenado** — o CPF entra no sistema uma única vez (na emissão do selo), é imediatamente hasheado (`SHA-256(cpf || salt_fundacao)`) e apenas o hash é persistido.
3. **Identificadores rotativos** — MAC BLE e QR codes rotacionam a cada 5 minutos; nenhum identificador persistente é transmitido.
4. **Consentimento granular e revogável** — os trabalhadores fornecem consentimento informado e versionado no onboarding, auditável retroativamente.
5. **Anonimato criptográfico no Sentinel** — relatos passam por mixnet/onion network; nem mesmo operadores da Fundação conseguem vincular um relato à identidade do reporter.

**Postura geral de conformidade**: Média–Alta. Lacunas existem (ver Seção 10) e estão sendo endereçadas; nenhuma é bloqueante para a Fase α com fluxos de consentimento adequados e DPAs em vigor.

Para o DPIA formal (Art. 38), veja [dpia.md](dpia.md).

---



OpenBag processes personal data — including biometric data classified as sensitive under Art. 11 LGPD — in service of a clear public safety mission: reducing violent crime against and using delivery workers (entregadores) in Brazil.

**Key design decisions that minimise LGPD risk:**

1. **Local-first architecture** — the worker's personal agent runs on their own device. Sensitive data (raw biometrics, route history, Sentinel reports submitted) never reaches Foundation servers.
2. **No raw CPF storage** — CPF enters the system exactly once (at seal issuance), is immediately hashed (`SHA-256(cpf || foundation_salt)`), and only the hash (`worker_hash`) is stored.
3. **Rotating identifiers** — BLE MAC and QR codes rotate every 5 minutes; no persistent identifier is broadcast.
4. **Explicit tiered consent** — workers provide granular, informed, revocable consent at onboarding, versioned so past consents are auditable.
5. **Cryptographic anonymity for Sentinel** — reports pass through a mixnet/onion network; even Foundation operators cannot link a report to a reporter's identity.

**Overall compliance posture**: Medium–High. Gaps exist (see Section 10) and are being addressed; none are blocking for Phase α with appropriate consent flows and DPA agreements in place.

---

## 2. Legal Basis for Data Processing (Art. 7 and Art. 11)

### 2.1 Ordinary personal data (Art. 7)

| Data category | Legal basis | Article |
|---------------|-------------|---------|
| Worker name, date of birth | Consent (onboarding) | Art. 7, I |
| CPF hash (`worker_hash`) | Consent + Legitimate interest (public safety) | Art. 7, I + IX |
| Platform affiliations | Consent | Art. 7, I |
| Civic reputation tier | Consent | Art. 7, I |
| Route geohash (anonymised, precision-5) | Consent | Art. 7, I |
| Academy graduation records | Consent | Art. 7, I |
| Seal status (ATIVO/SUSPENSO/REVOGADO) | Legitimate interest — public safety | Art. 7, IX |

### 2.2 Sensitive personal data (Art. 11)

Biometric data is **sensitive** under Art. 5, II and Art. 11 LGPD. Its processing requires heightened protection.

| Data category | Legal basis | Article | Mitigations |
|---------------|-------------|---------|-------------|
| Facial biometric (liveness + match) | Explicit consent | Art. 11, I | Hash-only storage; raw biometric processed by Serpro/Gov.br, not Foundation |
| Biometric session token | Legitimate interest (fraud prevention) | Art. 11, II, "a" | Short-lived token (≤300s TTL); not stored after issuance |

### 2.3 Sentinel reports

Anonymous crime reports processed by Skill Sentinel are:
- Not linked to a reporter's identity (mixnet anonymity — Foundation cannot de-anonymise)
- Processed for public safety / crime prevention purposes
- **Legal basis**: Art. 7, IX (legitimate interest) + Art. 7, III (compliance with a legal obligation when forwarded to CIOPS under SENASP protocol)

### 2.4 Why "legitimate interest" applies (Art. 10 balancing test)

The LGPD's Art. 10 requires that legitimate interest processing pass a three-part test:

1. **Purpose**: Preventing violent crime against/by delivery workers — a legitimate, specific public interest
2. **Necessity**: Processing the minimum data needed (worker_hash, not raw CPF; geohash-5, not GPS coordinates; masked name, not full name in public verification)
3. **Balancing**: Workers are the primary beneficiaries; they receive direct material benefits; they retain control via local-first agent; consent is layered and revocable

---

## 3. Data Inventory and Classification

| Data element | Category | Retention | Processing purpose | Storage location | Exported? |
|-------------|----------|-----------|-------------------|------------------|-----------|
| worker_hash (SHA-256 of CPF+salt) | Ordinary | Duration of active seal + 5 years (audit) | Identity anchor for verification | Foundation API DB (encrypted) | No |
| masked_name | Ordinary | Duration of active seal | Public verification display | Foundation API DB | Yes (public — partial) |
| Platform affiliations | Ordinary | Duration of seal | Verification context | Foundation API DB | Yes (public — verified only) |
| Seal status + tier | Ordinary | Duration of seal + 3 years | Verification + reputation | Foundation API DB | Yes (public) |
| active_geohash (precision-5, ~5km) | Ordinary | 60 seconds TTL in API cache | Live route indicator | Transient API cache only | Yes (public, limited precision) |
| Seal issuance date | Ordinary | Duration of seal | Reputation tier calculation | Foundation API DB | No |
| Biometric session ID | Sensitive | ≤300 seconds | Seal issuance authorisation | Memory only — never persisted | No |
| Facial biometric template | Sensitive | Not stored by Foundation | Liveness + match | Serpro infrastructure only | No |
| Academy records | Ordinary | 10 years (educational records) | Reputation + credential | Foundation DB + partner | Partially (certificate hash) |
| Sentinel report hash | Ordinary (de-identified) | 2 years after case closure | Crime investigation | CIOPS / SENASP | To law enforcement only (legal basis Art. 7, III) |
| Raw CPF | Sensitive (by association) | **Zero** — not stored | Issuance flow only | Memory: hashed and discarded | Never |
| Device keys (local agent) | Sensitive | Worker-controlled | Encryption / signing | Worker's device only | Never |

---

## 4. Sensitive Data — Biometrics (Art. 11 deep dive)

### 4.1 Why biometric processing is necessary

The biometric liveness check is the single hardest-to-counterfeit link in the chain. Without it:
- A criminal could register someone else's CPF
- Equipment theft would give the thief full seal privileges
- The whole trust model collapses

The ANPD has recognised (Res. CD/ANPD nº 4/2023) that biometric processing for identity verification can be lawful under explicit consent when it is the least-invasive method capable of achieving the purpose.

### 4.2 How OpenBag minimises biometric risk

| Risk | Mitigation |
|------|-----------|
| Foundation storing biometric templates | Foundation **never** receives the biometric template. Processing occurs at Serpro/Gov.br infrastructure only. Foundation receives a boolean (match/no-match) + short-lived session token. |
| Template reconstruction from hash | Foundation stores only `SHA-256(biometric_template)` — a one-way hash. Template cannot be reconstructed. |
| Continuous surveillance via biometric | Biometric is checked only at (a) seal issuance, (b) annual renewal, (c) worker-initiated re-verification. Not used for continuous tracking. |
| Biometric data breach at Foundation | N/A — Foundation does not hold biometric data. Breach at Serpro/Gov.br is their responsibility under their own LGPD compliance programme. |

### 4.3 Consent requirements for biometric processing

Per Art. 11, I LGPD, explicit consent is required. The consent form must:
- Be written in plain Portuguese (not legalese)
- Clearly state what biometric data is collected, by whom, and for what purpose
- Be separate from general terms of service (Art. 8, §1 — consent cannot be bundled)
- Be signed digitally via Gov.br (ICP-Brasil Level 1 minimum) to create an auditable record
- Allow revocation at any time (Art. 15, revocation mechanism)

---

## 5. Data Subject Rights (Art. 18)

OpenBag implements all Art. 18 rights. The worker's local agent is the primary interface.

| Right | Art. 18 | OpenBag implementation |
|-------|---------|----------------------|
| **Confirmation of processing** | Art. 18, I | Agent dashboard shows all data held locally and list of data shared with Foundation API |
| **Access** | Art. 18, II | Worker can export their full data profile from local agent as JSON at any time |
| **Correction** | Art. 18, III | Correction requests via in-app flow; name corrections processed in 5 business days |
| **Anonymisation / blocking** | Art. 18, IV | Worker can set their seal to "INATIVO" (invisible mode) while retaining the record |
| **Deletion** | Art. 18, VI | Worker can request full deletion; Foundation retains worker_hash + audit log for 5 years (legitimate interest — fraud prevention). Biometric data not held by Foundation. |
| **Portability** | Art. 18, V | Local-first architecture means the worker already has all their data. JSON export provided. Standard format: W3C Verifiable Credentials. |
| **Revocation of consent** | Art. 18, IX | One-tap revocation in agent. Propagates to Foundation API within 30 seconds (same kill-switch mechanism as revocation). |
| **Right to know about sharing** | Art. 18, VII | Agent shows a live list of entities that have queried the worker's seal in the past 30 days (by category: platform/citizen/gov). |
| **Review of automated decisions** | Art. 20 | Tier upgrades and downgrades are algorithm-driven but appealable. Worker can request human review of any tier change within 30 days. |

---

## 6. Local-First Architecture as Privacy Safeguard

The OpenBag Agent's local-first design is the most significant LGPD risk mitigation in the system. It directly implements the **data minimisation** principle (Art. 6, III) and **purpose limitation** (Art. 6, I).

### What never leaves the device

- Raw CPF (hashed before any API call)
- Biometric templates (processed at Gov.br only)
- Sentinel reports (report text encrypted and anonymised before transmit; origin unlinkable)
- Full route history (only a 60-second geohash-5 "live position" is optionally shared)
- Contacts and social graph used for Sentinel tips
- Private cryptographic keys

### What the Foundation API receives (minimum necessary)

- `worker_hash` — pseudonymous identifier
- Seal status transitions and timestamps (for kill-switch propagation)
- Tier events (for benefit calculation)
- `active_geohash` — precision-5 (~5km), 60-second TTL, only when EM_ROTA
- Academy completion certificates (hash only)

### What platforms receive

- Whether a given `worker_hash` has an active seal (boolean)
- Tier level
- Platform affiliation confirmation
- Nothing else

---

## 7. Data Minimisation Analysis (Art. 6, III)

### Pillar 01 — Sovereign Identity

| Data point | Minimised form | Rejected alternatives |
|-----------|----------------|----------------------|
| CPF | worker_hash = SHA-256(cpf+salt) — stored only in Foundation DB | Raw CPF in DB (rejected) |
| Name | masked_name ("J*** S****") in public API | Full name public (rejected) |
| Birth date | Age group (18–25, 26–35…) if needed for statistics | Full DOB stored (rejected — not needed for verification) |
| Biometric | Boolean match result from Serpro | Foundation receiving template (rejected) |

### Pillar 02 — Inviolable Equipment

| Data point | Minimised form | |
|-----------|----------------|---|
| BLE identifier | Rotates every 5 min — unlinkable across windows | Static MAC (rejected) |
| QR content | Rotates every 5 min — screenshot becomes invalid | Static QR (rejected) |
| NFC payload | Ephemeral challenge-response — no persistent ID in payload | Static NFC UID (rejected) |

### Pillar 03 — Live Badge

| Data point | Minimised form | |
|-----------|----------------|---|
| GPS location | Only collected during active route (EM_ROTA) and panic mode | Always-on GPS (rejected) |
| Location precision | Geohash-5 (~5km) for public heat-map | Exact GPS public (rejected) |
| Panic location | Exact GPS for 10 min during panic, then reverts to geohash-5 | Exact GPS permanent (rejected) |

### Pillar 04 — Sentinel

| Data point | Minimised form | |
|-----------|----------------|---|
| Reporter identity | Mixnet anonymity — technically unlinkable | Reporter CPF logged (rejected) |
| Report content | Free text, no mandatory fields except report type | Mandated PII fields (rejected) |
| Investigation hash | Random UUID — no link to reporter | Sequential ID (rejected — timing correlation) |

---

## 8. Data Sharing and Third Parties (Art. 26)

All third-party sharing requires a Data Processing Agreement (DPA) compliant with Art. 26 LGPD.

| Partner | Data shared | Legal basis | DPA required | Notes |
|---------|------------|-------------|-------------|-------|
| **Gov.br / Serpro** | CPF (one-way, for biometric match) | Consent + Art. 7, III (legal obligation — identity verification framework) | Yes — government protocol | Serpro is a LGPD controller in its own right |
| **iFood / Rappi / Keeta / Uber Eats** | worker_hash, seal status, tier | Consent + legitimate interest | Yes — platform MOU | Platforms receive minimum necessary for their own compliance |
| **Caixa Econômica Federal** | worker_hash, tier level | Consent | Yes | For microcredit benefit activation |
| **BB Seguros** | worker_hash, tier level | Consent | Yes | For health plan discount |
| **CIOPS / SSP** | Anonymised Sentinel report hash + anonymised geohash | Art. 7, III (legal obligation — crime reporting) | Yes — government protocol | No reporter identity ever shared |
| **SENASP** | Aggregated statistics (no individual data) | Legitimate interest — public policy | Yes | Aggregate only |
| **Citizens (App Verifica)** | masked_name, status, tier, platforms, active_geohash-5 | Legitimate interest — public safety | N/A (public endpoint) | Minimum necessary for verification purpose |

---

## 9. International Data Transfers (Art. 33)

OpenBag is Brazil-only in Waves 01–03. However, infrastructure dependencies create potential international transfer risks:

| Dependency | Transfer risk | Mitigation |
|-----------|--------------|-----------|
| GitHub (Microsoft) | Source code, issue tracker — no personal data (code is MIT public) | No personal data stored in GitHub |
| CDN (TBD) | May serve API responses via international edge nodes | Evaluate Brazilian CDN providers first (Cloudflare BR POPs); add SCCs if needed |
| DNS / TLS infrastructure | Minimal metadata | Use Brazilian registrar + Let's Encrypt |

**ANPD guidance**: For transfers to countries without an adequacy decision (Art. 33, I), standard contractual clauses (SCCs) are the primary mechanism. The Foundation will not transfer personal data internationally without either an adequacy decision or SCCs in place.

---

## 10. Risk Assessment and DPIA Triggers

Per ANPD Resolution CD/ANPD nº 2/2022, a Data Protection Impact Assessment (DPIA — RIPD) is required when processing is likely to result in high risk to data subjects. The following activities **require a DPIA before production deployment**:

| Processing activity | DPIA required? | Reason |
|--------------------|---------------|--------|
| Biometric processing for seal issuance | **Yes** | Art. 11 sensitive data; large-scale processing |
| Reputation scoring affecting credit/employment | **Yes** | Automated profiling with significant effects (Art. 20) |
| Sentinel + CIOPS integration | **Yes** | Law enforcement data; potential for misuse |
| BLE ambient scanning by App Verifica | **Borderline** — assess after scale | Mass-scale location-adjacent data collection |
| Public seal verification endpoint | No | Minimum data; no significant risk to workers |
| Academy records | No | Ordinary educational data |

---

## 11. Compliance Gaps and Roadmap

| Gap | Priority | Target wave | Owner |
|-----|---------|-------------|-------|
| DPA agreements with all platform partners | Critical | Phase α gate | Legal WG |
| DPA with Serpro/Gov.br | Critical | Phase α gate | Legal WG + Gov relations |
| DPIA for biometric processing | Critical | Phase α gate | Legal WG + DPO |
| DPIA for reputation scoring | High | Phase β gate | Legal WG + TSC |
| DPIA for Sentinel/CIOPS | High | Phase γ gate | Legal WG + TSC |
| Formal LGPD consent form (plain PT) | Critical | Phase α gate | Legal WG + Community |
| Deletion mechanism implementation | High | Phase β | Engineering |
| Art. 20 human review mechanism for tier changes | Medium | Phase β | Engineering + Policy |
| International transfer SCCs (CDN) | Medium | Phase β | Legal WG + Infra |
| Warrant canary procedure formalised | High | Phase α gate | TSC + Legal WG |

---

## 12. DPO Requirement (Art. 41)

**Does OpenBag need a Data Protection Officer?**

Under Art. 41 LGPD, controllers and processors must appoint a DPO. ANPD Resolution CD/ANPD nº 2/2022 provides that small organisations may self-assess whether a DPO is required; however, given that OpenBag:

- Processes sensitive biometric data at scale
- Processes data of a vulnerable population (low-income workers)
- Operates an automated decision-making system (reputation tiers)
- Integrates with law enforcement (CIOPS/SENASP)

**The Foundation requires a formal DPO from Phase α onward.** The DPO must:

- Have data protection expertise (CIPP/BR or equivalent)
- Be contactable by workers and ANPD (public contact published)
- Be independent — not the CEO or CTO
- Report directly to the Foundation Board
- Conduct or supervise all DPIAs
- Respond to data subject requests within 15 days (Art. 18, §3)

**Interim measure for Phase α**: The Foundation's designated maintainer acts as interim DPO; a formal appointment is a gate condition for Phase β.

---

## References

- Lei 13.709/2018 (LGPD) — [planalto.gov.br](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- ANPD Resolution CD/ANPD nº 2/2022 — DPIA guidance
- ANPD Resolution CD/ANPD nº 4/2023 — biometric data guidance
- ANPD — Guia de Boas Práticas para Implementação da LGPD
- W3C Verifiable Credentials Data Model — portable credential format
- OpenBag `spec/01-architecture.md` — technical implementation details
- OpenBag `spec/02-agent.md` — local-first agent architecture
- OpenBag `spec/04-sentinel.md` — anonymity layer for reporting
- OpenBag `SECURITY.md` — threat model and responsible disclosure

---

*Contribuições bem-vindas via Pull Request. Este documento é parte do processo de RFC da OpenBag Foundation.* 🐝
