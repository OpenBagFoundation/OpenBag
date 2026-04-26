# Spec 01 · Arquitetura

> Documento técnico detalhado dos três pilares físicos. Para visão geral, ver [RFC-001](../docs/RFC-001.md). Para protocolo de implantação por fases, ver [RFC-002](../docs/RFC-002.md).

---

## Duas camadas de implementação · Selo Digital v0 e Selo Físico v1

Para resolver o problema de cold start (ver [RFC-002](../docs/RFC-002.md)), o Selo OpenBag é implementado em duas camadas que coexistem:

### Selo Digital v0

- Emitido via Gov.br + biometria + KYC, **sem hardware**
- Verificação: foto + token rotativo no smartphone do entregador (5 min TTL) + selo dinâmico no app cidadão Verifica
- Custo unitário: ~R$ 5
- Time-to-cobertura: 24-48 horas após KYC aprovado
- Cobre Pilares 01 (Identidade) e 04 (Agente Pessoal) integralmente
- **Único caminho viável** para Onda 01 (Fases α e β)

### Selo Físico v1

- Hardware completo conforme descrito abaixo (chip NFC + BLE + e-paper + lacre)
- Custo unitário: ~R$ 320
- Migração gradual a partir da Onda 02 (Fase γ)
- Continua válido em paralelo ao Digital indefinidamente
- Adiciona Pilares 02 (Equipamento) e 03 (Crachá) sobre identidade já estabelecida

A migração é **não-disruptiva**: o agente local (Pilar 04) já roda independente do hardware. O chip apenas adiciona camada física sobre identidade já estabelecida via Selo Digital.

---

## Pilar 01 · Identidade Soberana

### Fluxo de emissão do selo

```
1. Entregador inicia jornada na OpenBag Academy (CEU Heliópolis ou parceiro)
   OU
   Entregador já ativo na plataforma solicita opt-in via app

2. Plataforma submete API call ao Gov.br Selo:
   POST /selo/issue
   {
     "cpf": "***.***.***-XX",
     "platform_id": "ifood",
     "platform_user_id": "abc123",
     "academy_certificate": "openbag-academy/2026-04/heliopolis/042" (se aplicável)
   }

3. Gov.br executa verificações:
   - Liveness biometric match (face vs Serpro registry)
   - SINESP background check
   - CPF status (ativo, sem restrições críticas)
   - Conformity hooks (LGPD opt-in)

4. Se todos checks passam:
   - Gov.br emite Verifiable Credential (formato W3C-DID compatible)
   - Vinculação com chip-ID do equipamento (pareamento PUF)
   - Status inicial: ATIVO

5. Selo é entregue ao OpenBag Agent local do entregador
```

### Estados do selo

| Estado | Descrição | Transições permitidas |
|--------|-----------|----------------------|
| `PENDENTE` | Solicitação recebida, validações em curso | → ATIVO, REJEITADO |
| `ATIVO` | Selo válido, entregador autorizado | → EM_ROTA, SUSPENSO, REVOGADO |
| `EM_ROTA` | Entregador em corrida ativa | → ATIVO, SUSPENSO, REVOGADO |
| `SUSPENSO` | Suspensão temporária (denúncia em apuração) | → ATIVO, REVOGADO |
| `REVOGADO` | Selo terminado, kill switch propagado | (final) |
| `REJEITADO` | Emissão negada (fail nos checks) | (final) |

### Kill switch

Propagação garantida em < 30 segundos:

1. Gatilho: plataforma, cidadão (denúncia confirmada por CIOPS), entregador (auto-revogação) ou Foundation
2. Gov.br Selo atualiza status para REVOGADO
3. Push notification para todos os relays BLE da Foundation
4. Push notification para o agente local do entregador
5. App Verifica de cidadãos atualiza cache local na próxima verificação
6. Detecta-SP recebe webhook de revogação

### LGPD compliance

Base legal: art. 7º IX (segurança pública) + legítimo interesse art. 7º IX (proteção de terceiros).

Dados expostos publicamente em verificação cidadã:
- Foto (apenas em verificação, não armazenada pelo cidadão)
- Primeiro nome + inicial do sobrenome
- CPF mascarado (***.***.***-XX)
- Plataformas vinculadas (lista pública)
- Status (ATIVO/EM_ROTA/SUSPENSO/REVOGADO)
- Hash do equipamento
- Selo emitido em (mês/ano)
- Número de denúncias procedentes (agregado público, não nominal)

Dados que **NUNCA** são expostos:
- CPF completo
- Endereço residencial
- Histórico de rotas
- Histórico de denúncias enviadas (Skill Sentinela)
- Tier de reputação (apenas o próprio entregador escolhe expor)

DPIA (Data Protection Impact Assessment) será publicado em `docs/dpia.md`.

---

## Pilar 02 · Equipamento Inviolável

### Bag · especificação técnica

| Componente | Spec | Justificativa |
|------------|------|---------------|
| Material exterior | Polietileno reforçado, certificação INMETRO | Resistência operacional |
| Chip NFC | Secure Element passport-grade (e.g., NXP P71 ou equivalente) | Chave privada não-extraível |
| Beacon BLE | Nordic nRF52840 (sugestão) | Baixo consumo, criptografia AES-128, alcance 30m |
| Bateria interna | LiPo 200mAh | Autonomia 60+ dias para BLE |
| QR display | E-paper 1.54" (200×200px) | TTL rotation 5min sem consumir bateria |
| Lacre eletrônico | Tamper switch + encrypted alert | Detecta remoção indevida |
| Selo holográfico | UV-reactive microimpressão | Barreira anti-falsificação artesanal |
| Numeração serial | 12 chars, único, gravado em chip + impresso | Cadeia de custódia |

### BLE Beacon · protocol overview

Detalhes em RFC-002. Resumo:

- **Frequência de emissão**: 1 broadcast a cada 30 segundos
- **Payload**: 32 bytes
  - Magic prefix `OBAG` (4 bytes)
  - Selo hash atual (16 bytes, derivado de chave privada + timestamp + nonce)
  - Status code (1 byte: ATIVO/EM_ROTA/SUSPENSO)
  - TTL countdown (2 bytes)
  - Plataforma ID (1 byte)
  - Reservado (8 bytes)
- **Anti-replay**: hash inclui timestamp em window de 5 min, validade verificada pelo cliente
- **Anti-tracking**: hash rotativo impede que terceiros (não-OpenBag) rastreiem o entregador via MAC address Bluetooth (MAC randomization aplicada)

### QR dinâmico · e-paper

- Display e-paper 1.54" no front da bag (tamanho ~3cm × 3cm)
- Update a cada 5 minutos
- Conteúdo do QR: token assinado com TTL · `{selo_id, hash_corrente, timestamp, signature}`
- Verificação cliente: leitura → validação contra autoridade certificadora → resposta

### Cadeia de custódia industrial

Para garantir que bags só existam em quantidade autorizada:

1. Foundation autoriza fabricação de N unidades
2. OEM certificado (Positivo, Multilaser, ou equivalente) produz com chips fornecidos pela Foundation
3. Cada chip recebe sua chave privada **dentro da fábrica** com HSM auditado
4. Numeração serial registrada na blockchain Foundation (immutable record)
5. Bags entregues para hubs de distribuição (Academy, plataformas)
6. Pareamento com CPF/equipamento ocorre apenas em ativação Gov.br

---

## Pilar 03 · Crachá Vivo · spec

### Hardware

| Componente | Spec |
|------------|------|
| Form factor | Crachá magnético, ~9cm × 6cm × 1cm |
| Display | E-paper 4.2" (400×300px) |
| Microcontrolador | Nordic nRF52833 ou equivalente |
| GPS | u-blox CAM-M8 (ou equivalente, alcance assistido) |
| Bateria | LiPo 800mAh |
| Sensores | Acelerômetro (detecção de queda), botão de pânico físico |
| Conectividade | BLE 5.2 + Wi-Fi 802.11n (sync periódico) |
| Bateria estimada | 60-80 dias com uso típico |

### Estados do display

```
┌─────────────────────────┐
│        VERDE            │
│         ✓               │
│                         │
│       MARCOS S.         │
│       iFood             │
│       ROTA: ✓           │
│       4271              │
└─────────────────────────┘
```

| Cor | Significado | Quando acontece |
|-----|-------------|-----------------|
| Verde + ✓ | ATIVO + EM_ROTA | Entregador autenticado e em corrida |
| Amarelo + ! | ATIVO mas fora de rota | Aguardando próxima ordem |
| Vermelho + ✗ | SUSPENSO ou REVOGADO | Selo invalidado |
| Cinza apagado | Crachá desativado / inativo | Não-autenticado |

### Biometria de ativação

Início de turno:

1. Entregador escaneia rosto via câmera frontal do smartphone (app OpenBag Agent)
2. Liveness check + face match contra registro Gov.br
3. Se OK, agente envia comando BLE para crachá: `ACTIVATE`
4. Crachá liga display, começa a transmitir BLE, registra início de turno
5. Re-auth a cada 24h (configurável; em zonas de alto risco, mais frequente)

Se o crachá é **roubado** sem desautenticação:
- Lacre detecta remoção forçada
- Display imediatamente entra em estado VERMELHO + ✗
- BLE para de transmitir hash válido
- GPS continua reportando posição para o agente do dono original

### Botão de pânico

Botão físico oculto na lateral do crachá. Pressionar 3 segundos:

1. Beacon BLE muda para modo PÂNICO (hash especial, decodificável apenas por CIOPS)
2. GPS reporta posição em alta frequência (1 Hz por 10 minutos)
3. Smartphone do entregador (se conectado) envia push notification ao CIOPS estadual
4. Áudio do smartphone começa a gravar (apenas se usuário consentiu previamente)

Disponível também como skill no app (`skill-panic`) para o cidadão durante verificação suspeita.

---

## Integração com Detecta-SP

A integração com o Detecta-SP é o que torna o sistema **proativo** mesmo quando nenhum cidadão age. Resumo (detalhado em RFC-008):

1. Câmeras do Detecta detectam bag/crachá via Computer Vision
2. CV extrai: aparente plataforma + cor + posição GPS aproximada (timestamp)
3. Detecta consulta API Gov.br Selo: "há selo ATIVO ou EM_ROTA nesta coordenada agora?"
4. Resposta:
   - **MATCH**: ignorar (entregador legítimo, sem ação)
   - **MISMATCH**: alerta para CIOPS (bag presente sem selo correspondente)
   - **REVOGADO_NEARBY**: alerta crítico (equipamento ativo após revogação)
5. CIOPS analisa, despacha viatura se confirmado

Volume estimado SP: 38k entregadores em rota a qualquer momento. Latência alvo de consulta: < 200ms.

---

## Próximos documentos

- [02 · Agente Pessoal](02-agent.md)
- [03 · Catálogo de Skills](03-skills.md)
- [04 · Skill Sentinela](04-sentinel.md)
- [05 · Reputação Cívica](05-reputation.md)
- [06 · Academy](06-academy.md)

🐝
