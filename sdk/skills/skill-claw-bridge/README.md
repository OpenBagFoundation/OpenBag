# skill-claw-bridge · OpenClaw Bridge

> Portable reputation bridge between OpenBag and the OpenClaw ecosystem.
> 🇧🇷 [Versão PT-BR abaixo](#versão-em-português)

**Skill ID**: `skill-claw-bridge`
**Category**: community | **Maturity**: beta
**License**: MIT | **OpenClaw compatible**: ✅

---

## What it does

`skill-claw-bridge` enables **portable civic reputation** between OpenBag and OpenClaw:

1. **Export** — packages the worker's OpenBag civic tier as a W3C Verifiable Credential
   signed by the Foundation, readable by any OpenClaw-compatible agent
2. **Import** — accepts an OpenClaw reputation VC and maps it to the equivalent
   OpenBag tier (conservative: takes the lower of the two until Foundation verifies)
3. **Sync** — on every `on_wake` cycle, checks for updates and reconciles both sides

## Tier mapping

| OpenBag Tier | OpenClaw Equivalent |
|--------------|---------------------|
| Bronze | Hexagon / Worker Bee |
| Prata | Forager |
| Ouro | Drone Engineer |
| Diamante | Queen |

## Installation

```bash
openbag install skill-claw-bridge
```

Or clone this directory and run:

```bash
openbag validate sdk/skills/skill-claw-bridge/
openbag test sdk/skills/skill-claw-bridge/
```

## Permissions

- `read:reputation_tier` — read current civic tier
- `read:status_current` — read current seal status
- `write:reputation_event` — write imported tier event
- `storage:encrypted_local` — persist bridge state and VCs
- `notifications:local` — notify on sync and tier export
- `network:foundation_api` — issue/verify credentials with the Foundation

## Hooks

| Hook | What it does |
|------|-------------|
| `on_install` | Initialises bridge state in encrypted local storage |
| `on_first_run` | Prompts worker to link OpenClaw identity; shows current tier |
| `on_wake` | Syncs OpenClaw VC if present (throttled to 6 hours) |
| `on_tier_change` | Auto-exports updated VC to OpenClaw on every tier change |

## Security notes

- The bridge never sends personal identifiable information to OpenClaw Hub without
  explicit worker consent
- Conservative tier mapping prevents tier inflation from unverified sources
- All VCs are signed by the Foundation using Ed25519Signature2020
- Local storage is encrypted; exported VCs are not stored server-side

---

## Versão em português

O `skill-claw-bridge` permite **reputação cívica portátil** entre o OpenBag e o
ecossistema OpenClaw:

1. **Exportação** — empacota o tier cívico do entregador como uma Credencial
   Verificável W3C, legível por qualquer agente compatível com OpenClaw
2. **Importação** — aceita uma VC de reputação OpenClaw e mapeia para o tier
   equivalente do OpenBag (conservador: toma o menor dos dois até verificação)
3. **Sincronização** — a cada ciclo `on_wake`, verifica atualizações e reconcilia

---

*See [docs/OPENCLAW-ALIGNMENT.md](../../docs/OPENCLAW-ALIGNMENT.md) for the full compatibility map.*
