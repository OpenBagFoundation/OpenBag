# Spec 02 · OpenBag Agent (agente pessoal)

> Cada entregador legítimo opera localmente um agente pessoal — software MIT-licensed, rodando no próprio smartphone — que defende seus interesses, acumula sua reputação cívica, recebe missões, e oferece skills modulares contribuíveis pela comunidade.

---

## Inspirações

| Conceito | Origem | Aplicação no OpenBag |
|----------|--------|---------------------|
| **Agente local-first** | OpenClaw | Roda no dispositivo do dono, dados não saem |
| **Skills modulares** | OpenClaw AgentSkills · ClawHub | Módulos contribuíveis pela comunidade |
| **Identidade portátil** | W3C-DID | Selo viaja entre plataformas |
| **Padrão público** | Pix (BCB) | Adoção universal sem dono corporativo |

---

## Princípios fundadores

### 1. Local-first

Dados sensíveis ficam no dispositivo do entregador:
- Biometria registrada (template, não imagem)
- Histórico completo de denúncias enviadas pela Skill Sentinela
- Histórico de rotas
- Métricas de reputação detalhadas
- Comunicações com a Foundation

O agente apenas comunica **resultados criptografados** ao mundo externo. Plataformas, governos e a própria Foundation não veem os dados brutos.

### 2. Privacy by design

- Comunicações com Gov.br: TLS 1.3 + certificate pinning + ephemeral session keys
- Comunicações com plataformas: APIs apenas com tokens de escopo mínimo
- Comunicações Sentinela: mixnet com onion routing (ver `04-sentinel.md`)
- Logs locais: cifrados com chave derivada de biometria viva
- Backup: cifrado E2E, custódia opcional pela Foundation com chave do usuário

### 3. Portabilidade

O agente vai junto quando:
- Entregador troca de plataforma (mantém Selo + Reputação)
- Entregador troca de aparelho (restore via Gov.br + verificação biométrica)
- Entregador se candidata a vaga CLT (apresenta Selo Diamante via QR)
- Entregador busca microcrédito (compartilha apenas o tier, não o histórico)

### 4. Extensibilidade

Skills modulares no padrão OpenClaw permitem que a comunidade estenda o agente. Skills nativas são mantidas pela Foundation; comunitárias são publicadas no **ClawHub-BR** (registry comunitário, fork da arquitetura ClawHub do OpenClaw).

### 5. Inversão de poder

O agente trabalha **a favor do entregador**, não da plataforma:
- Negocia condições (rejeita rotas com taxa abaixo do limiar configurável)
- Protege contra coação (alerta de pânico se detectar tentativa de takeover)
- Registra incidentes para uso jurídico futuro
- Acumula créditos cívicos como ativo profissional

---

## Arquitetura técnica

```
┌──────────────────────────────────────────────────┐
│            Smartphone do entregador              │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │         OpenBag Agent (local)              │  │
│  │                                            │  │
│  │  ┌──────────────────────────────────────┐  │  │
│  │  │  Gateway (control plane)             │  │  │
│  │  │  - Channel routing                   │  │  │
│  │  │  - Skill orchestration               │  │  │
│  │  │  - Encrypted local store             │  │  │
│  │  └─────┬───────┬────────┬────────┬──────┘  │  │
│  │        │       │        │        │         │  │
│  │   ┌────▼──┐ ┌──▼───┐ ┌──▼───┐ ┌──▼───┐     │  │
│  │   │skill- │ │skill-│ │skill-│ │skill-│     │  │
│  │   │verify │ │senti-│ │rep   │ │rewar-│ ... │  │
│  │   │       │ │nel   │ │      │ │ds    │     │  │
│  │   └───────┘ └──────┘ └──────┘ └──────┘     │  │
│  │                                            │  │
│  │  Local store (encrypted):                  │  │
│  │  - Biometric template                      │  │
│  │  - Sentinela queue                         │  │
│  │  - Reputation events                       │  │
│  │  - Communication logs                      │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
└──────┬───────────────────────────────────────────┘
       │
       │ Encrypted channels:
       ├──→ Gov.br Selo (Verifiable Credentials)
       ├──→ Plataforma (status updates)
       ├──→ Foundation Sentinela mixnet
       ├──→ Hardware (BLE pairing com bag/crachá)
       └──→ ClawHub-BR (skill updates)
```

### Tecnologias-alvo

- **Mobile runtime**: React Native (cross-platform iOS/Android) ou Flutter
- **Native modules** (críticos): Rust via FFI para crypto, BLE, NFC
- **Storage**: SQLCipher (cifrado em disco)
- **Crypto**: libsodium / NaCl
- **BLE**: Nordic SoftDevice integration
- **NFC**: padrão NDEF + Secure Element APDU commands

---

## Skill manifest format

Inspirado no `SKILL.md` do OpenClaw. Cada skill tem um manifesto:

```yaml
# skill.yaml
name: skill-finance
version: 1.2.0
license: MIT
authors:
  - Sebrae Brasil <ti@sebrae.com.br>
  - OpenBag Foundation
description: |
  Educação financeira e formalização MEI integrado ao Sebrae.
  Skill comunitária mantida pela Foundation Sebrae.

category: community
maturity: stable

permissions:
  - read:reputation_tier
  - write:agent_inbox
  - http:sebrae.com.br/api/mei/*

dependencies:
  agent: ">= 0.5.0"
  
hooks:
  on_install: scripts/install.sh
  on_first_run: scripts/onboard_user.sh
  on_uninstall: scripts/cleanup.sh

ui:
  entry_point: ui/main.tsx
  icon: assets/icon.svg
  
docs: https://github.com/openbag/skill-finance/blob/main/README.md
```

### Permissions model

| Scope | Acesso |
|-------|--------|
| `read:reputation_tier` | Ler tier atual (Bronze/Prata/Ouro/Diamante) |
| `read:platform_list` | Ler lista de plataformas vinculadas |
| `read:status_current` | Ler status atual (ATIVO/EM_ROTA/etc) |
| `read:sentinel_log` | Acesso ao log local da Skill Sentinela (proibido por padrão) |
| `read:biometric_template` | **Proibido** para skills (apenas core) |
| `write:agent_inbox` | Postar mensagens visíveis ao usuário no agente |
| `http:domain.com/*` | Realizar requests HTTP a domínio específico |
| `ble:hardware_pair` | Acesso a comandos BLE para bag/crachá (apenas core) |

Permissions são declarativas e auditáveis. O usuário aprova explicitamente cada permissão na instalação. Skills com permissões além do mínimo passam por revisão da Foundation antes de listar no ClawHub-BR.

---

## Lifecycle do agente

### Onboarding inicial

```
1. Egresso da Academy ou opt-in via plataforma
2. Download do agent app (App Store / Play Store / GitHub Releases)
3. Pareamento Gov.br via guest mode (KYC + biometria)
4. Recebimento do Selo (Verifiable Credential) no agente local
5. Pareamento com hardware (BLE NFC com bag e crachá)
6. Instalação automática de skills core
7. Tier inicial: Bronze
```

### Operação contínua

```
- Wake-up periódico (a cada N segundos, configurável)
- Heart-beat para Foundation (apenas confirmação de presença, sem dados)
- Coleta de eventos relevantes para reputação
- Sync periódico de updates de skills (apenas se aprovado)
- Escuta passiva BLE para verificações de cidadãos
```

### Skill installation

```bash
# Via CLI (modo dev)
openbag skill install skill-finance

# Via UI
# Loja interna do agente lista skills do ClawHub-BR
# Usuário escolhe skill, aprova permissions
```

### Backup e recovery

- **Backup automático local** cifrado (E2E)
- **Backup opcional na Foundation** (chave de cifra continua com usuário)
- **Recovery via Gov.br** + biometria viva + dispositivo de confiança

---

## Comunicação entre agentes

Em alguns cenários, agentes se comunicam:

- **Mentoria** (Tier Ouro): mentor envia missões e dicas para mentees, via canal cifrado
- **Mesh BLE em zona de baixo sinal**: agentes próximos relayam pacotes anônimos da Skill Sentinela (sem expor identidade)
- **Verificação cruzada**: agente pode ser solicitado a confirmar presença de outro entregador legítimo na vizinhança (com consentimento explícito)

---

## Open-source · estado atual

| Componente | Status | Repo |
|------------|--------|------|
| Spec do agente | Draft 0.5 | `openbag/spec` |
| Mobile app reference | Em desenvolvimento (alpha) | `openbag/agent-mobile` (a criar) |
| ClawHub-BR registry | Em desenvolvimento | `openbag/clawhub-br` (a criar) |
| Skill SDK | Em desenvolvimento | `openbag/skill-sdk` (a criar) |
| Reference skills (core) | Em desenvolvimento | `openbag/skill-*` (a criar) |

Issues abertas para contribuidores:
- `#101` Implementação do gateway local em Rust
- `#102` BLE scanner background no iOS (limitação do iOS)
- `#103` Skill SDK · spec final do manifest
- `#104` Recovery flow + backup E2E

---

## Próximos documentos

- [01 · Arquitetura](01-architecture.md)
- [03 · Catálogo de Skills](03-skills.md)
- [04 · Skill Sentinela](04-sentinel.md)
- [05 · Reputação Cívica](05-reputation.md)
- [06 · Academy](06-academy.md)

🐝
