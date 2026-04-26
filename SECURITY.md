# Política de Segurança · OpenBag

A segurança do OpenBag não é apenas uma feature técnica — é responsabilidade direta para com:

- **Entregadores** que usam a Skill Sentinela e o Programa Shield (vidas em risco real)
- **Cidadãos** que dependem da verificação para sua segurança física
- **Comunidades** que adotam o protocolo como infraestrutura cívica

Tratamos vulnerabilidades de segurança com seriedade proporcional ao impacto.

---

## Responsible Disclosure

**NÃO** abra issues públicas para vulnerabilidades. Reporte privadamente em:

- **E-mail**: `security@openbag.org` (a constituir; até lá: contato via DM aos maintainers no Discord)
- **GPG**: chave pública será publicada quando o domínio for ativado
- **Bug bounty**: em desenvolvimento (RFC-009)

### O que incluir no report

1. **Tipo da vulnerabilidade** (criptografia, deanonimização, supply chain, etc.)
2. **Componente afetado** (spec, agente, hardware, integração)
3. **Reprodução** (passos detalhados, ambiente, payload se aplicável)
4. **Impacto** (vidas em risco? privacidade comprometida? denúncias deanonimizadas?)
5. **Mitigação sugerida** (opcional)
6. **Tempo de embargo desejado** (default: 90 dias antes de divulgação pública)

### Nosso compromisso

- **Confirmação de recebimento** em até 72 horas
- **Avaliação inicial** em até 7 dias
- **Atualização periódica** durante a remediação
- **Crédito público** ao reporter (se desejado), em `SECURITY-HALL-OF-FAME.md`
- **Recompensa financeira** quando aplicável (programa em desenvolvimento)

---

## Severidade · classificação interna

### Crítica · resposta em 24h
- Deanonimização de denúncia da Skill Sentinela
- Comprometimento do Programa Shield (exposição de dados de protegidos)
- RCE no agente pessoal
- Forjar selos válidos sem CPF/biometria correspondente

### Alta · resposta em 7 dias
- Bypass de revogação de selo
- Replay attack no QR dinâmico ou BLE rotativo
- Vazamento de dados sensíveis em logs do agente
- Falha de criptografia em comunicação agente-Foundation

### Média · resposta em 30 dias
- DoS contra a verificação cidadã
- Bypass parcial de validação biométrica
- Vazamento de metadados não-críticos

### Baixa · resposta em 90 dias
- Race conditions sem impacto em segurança
- UI/UX que poderiam levar usuário a erro

---

## Threat Model

O threat model formal (STRIDE) está em desenvolvimento — RFC-009. Resumo dos atores adversários considerados:

### A1 · Bandido individual
**Objetivo**: usar bag falsa para abordar vítimas.
**Capacidade**: baixa-média. Pode comprar bag pirata, falsificar selo holográfico simples.
**Mitigação**: chip Secure Element + biometria + BLE rotativo.

### A2 · Crime organizado (facção/quadrilha)
**Objetivo**: clonar selos em escala, ou tomar conta de selos legítimos via coação.
**Capacidade**: alta. Recursos para hardware hacking, infiltração, coação.
**Mitigação**: kill switch, Skill Sentinela com mixnet, Programa Shield, auditoria.

### A3 · Plataforma adversa
**Objetivo**: capturar o protocolo para benefício próprio, deanonimizar denúncias contra ela.
**Capacidade**: alta. Recursos técnicos e legais.
**Mitigação**: governança neutra, código MIT auditável, dados sensíveis ficam no agente local.

### A4 · Estado adversário
**Objetivo**: usar denúncias da Skill Sentinela para perseguição política.
**Capacidade**: muito alta. Acesso legal a infra de telecom.
**Mitigação**: arquitetura sem origem rastreável + relays voluntários internacionais + publicação pública de subpoenas recebidas (warrant canary).

### A5 · Insider malicioso
**Objetivo**: maintainer ou Foundation member comprometido tenta inserir backdoor.
**Capacidade**: alta dentro do escopo de acesso.
**Mitigação**: code review obrigatório (4 olhos), reproducible builds, auditoria pública contínua, separação de privilégios.

---

## Defesas em camadas

### Layer 1 · criptográfica
- Chip NFC com Secure Element (chave privada não-extraível)
- Hash rotativo no BLE beacon (anti-replay)
- QR dinâmico com TTL de 5 min em e-paper
- TLS 1.3 + certificate pinning em toda comunicação
- Sentinel mixnet com onion routing + perfect forward secrecy

### Layer 2 · biométrica
- Liveness detection na ativação do crachá
- Face match contra registro Gov.br
- Re-auth periódica (intervalo a definir, alvo: 24h)

### Layer 3 · operacional
- Kill switch propaga em < 30 segundos
- Logs locais cifrados, auto-destruição configurável
- Lacre eletrônico na bag

### Layer 4 · social
- Verificação cidadã universal e gratuita cria pressão pública
- Skill Sentinela permite denúncia interna da categoria
- Programa Shield protege quem se arrisca

### Layer 5 · institucional
- Auditoria pública trimestral (entidade independente rotativa)
- Bug bounty contínuo
- Warrant canary (publicação mensal de não-recebimento de subpoena, ausência indica recebimento)
- Reproducible builds com signing keys públicas dos maintainers

---

## Histórico de vulnerabilidades

Lista pública de CVEs e disclosures será publicada em `SECURITY-DISCLOSURES.md` quando houver.

---

## Recursos

- [OpenSSF best practices](https://openssf.org)
- [W3C DID Security Considerations](https://www.w3.org/TR/did-core/#security-considerations)
- [Tor Project · onion routing reference](https://www.torproject.org/)
- [Disque-Denúncia 181 · modelo Brasil](https://disquedenuncia181.es.gov.br/)

---

*Segurança que protege quem se arrisca pela comunidade.* 🐝
