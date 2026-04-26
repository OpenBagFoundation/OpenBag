# Spec 03 · Catálogo de Skills

> Skills modulares do OpenBag Agent. Inspirado no AgentSkills do OpenClaw e no ClawHub registry.

---

## Categorias

- **Core** · skills nativas mantidas pela Foundation. Pré-instaladas. Não-removíveis.
- **Core sensível** · core skills que envolvem segurança/proteção física (Sentinel, Shield)
- **Community** · skills publicadas pela comunidade no ClawHub-BR. Opcionais. Removíveis.
- **Experimental** · skills em desenvolvimento, com badge de aviso

---

## Skills core

### `skill-verify`
**Categoria**: core
**Status**: stable
**Mantida por**: Foundation TSC

Responde automaticamente a verificações solicitadas por cidadãos. Implementa a trifecta operacional:
- BLE beacon broadcast (a cada 30s)
- QR código rotativo no e-paper (5min TTL)
- NFC tap response (sob demanda)

Hooks com `skill-route` para apresentar status ATIVO/EM_ROTA. Integração com `skill-rep` para expor (opcionalmente, escolha do usuário) o tier no resultado.

---

### `skill-sentinel`
**Categoria**: core sensível
**Status**: stable
**Mantida por**: Foundation TSC + Security Committee
**Detalhamento**: [`04-sentinel.md`](04-sentinel.md)

Canal anônimo criptográfico para denúncia de fraudadores conhecidos pelo entregador legítimo.

Tres camadas:
1. Anonimato técnico (mixnet onion routing)
2. Anonimato operacional (atendentes não pedem CPF, modelo Disque-Denúncia 181)
3. Programa Shield (proteção familiar quando a denúncia escala)

---

### `skill-rep`
**Categoria**: core
**Status**: stable
**Mantida por**: Foundation TSC
**Detalhamento**: [`05-reputation.md`](05-reputation.md)

Cálculo do tier de reputação cívica baseado em eventos:
- Tempo ativo no sistema
- Verificações cidadãs sem incidente
- Denúncias procedentes (via Sentinela)
- Ausência de complaints
- Conclusão de trainings
- Mentoria a outros entregadores

Resultado: Tier Bronze, Prata, Ouro ou Diamante.

---

### `skill-rewards`
**Categoria**: core
**Status**: stable
**Mantida por**: Foundation TSC

Resgate de benefícios escalonados:

| Bronze | Microcrédito Caixa simplificado, voz comunidade |
| Prata | + bônus R$ 80/mês, plano saúde -30% (BB), prioridade rotas |
| Ouro | + bônus R$ 200/mês, plano saúde grátis família, vagas CLT |
| Diamante | + trilha CLT garantida, bolsa universitária, cadeira Board |

Hooks com `skill-rep` para verificar tier corrente. Integração com APIs de parceiros (Caixa, BB Seguros, plataformas).

---

### `skill-panic`
**Categoria**: core sensível
**Status**: stable
**Mantida por**: Foundation Security Committee

Botão de pânico georreferenciado, integrado ao CIOPS estadual.

Acionamento:
- Botão físico no crachá (3 segundos)
- Botão no app (toque longo na tela inicial)
- Voice trigger (configurável)
- Anomalia detectada (acelerômetro: queda + ausência de movimento)

Resultado:
- Push notification ao CIOPS com geo + timestamp + hash do equipamento
- GPS em alta frequência por 10 minutos
- Áudio iniciado (se consentido)
- Smartphone do usuário entra em modo emergência (interface limpa, prioridade chamadas)

Disponível também para cidadãos durante verificação suspeita.

---

### `skill-shield`
**Categoria**: core sensível
**Status**: stable
**Mantida por**: Foundation Security Committee + SENASP/PROVITA hooks

Programa de proteção familiar ativado quando:
- Denúncia da Sentinela escalou para investigação
- Risco identificado de vazamento de identidade
- Auto-ativação por gatilhos (ameaça recebida, etc.)

Componentes:
- Realocação dentro da plataforma para outra cidade (com bônus)
- Inclusão em PROVITA quando aplicável
- Suporte psicossocial (CRAS + Sou da Paz + Igarapé)
- Ronda extra discreta na zona da família via PM
- Recompensa via PIX-anônimo do programa de denúncia premiada

Detalhamento em [`04-sentinel.md`](04-sentinel.md).

---

### `skill-academy`
**Categoria**: core
**Status**: stable
**Mantida por**: Foundation Inclusion Committee

Trilha de formação OpenBag Academy. Para egressos e ativos:

- Acesso ao currículo de 80 horas (módulos online + presenciais)
- Certificados portáteis (formato W3C Verifiable Credential)
- Missões de mentoria (Tier Ouro+ → Bronze)
- Convocação para hackathons e eventos

Hooks com `skill-rep` para registrar conclusões.

Detalhamento em [`06-academy.md`](06-academy.md).

---

### `skill-route`
**Categoria**: core
**Status**: stable
**Mantida por**: Foundation TSC

Heat-map público com posição anonimizada (~50m), visível no app cidadão.

Privacidade:
- Posição anonimizada via geohashing precisão 5
- Atualização a cada 60s (não tempo real preciso)
- Apenas durante turno EM_ROTA
- Opt-in granular (entregador pode esconder posição em zonas específicas, e.g., próximo de casa)

Função para o cidadão: verificar consistência. Bag parada na esquina mas mapa não acusa entregador → red flag.

---

## Skills comunitárias (ClawHub-BR)

Skills mantidas por contribuidores externos, publicadas no registry comunitário.

### `skill-finance`
**Mantida por**: Sebrae Brasil + comunidade
**Categoria**: community

Educação financeira:
- Planejamento mensal contextualizado
- Formalização MEI (passo a passo, integração API Receita)
- Separação pessoal × negócio
- Curso "Tamo Junto" do Sebrae integrado
- Calculadora de impostos para entregadores

---

### `skill-health`
**Mantida por**: UFRJ COPPE + SUS Digital
**Categoria**: community

Saúde ocupacional:
- Lembretes ergonômicos durante turno
- Detecção de fadiga via análise de padrão de uso
- Telemedicina via SUS Digital (videoconsulta)
- Histórico de saúde ocupacional para perícia futura
- Alertas de condições de trânsito de risco (chuva forte, etc.)

---

### `skill-defensive`
**Mantida por**: SENAI Transportes + comunidade
**Categoria**: community

Direção defensiva:
- Coaching contextual baseado em IA local
- Análise de padrões de pilotagem (frenagem, curvas, velocidade)
- Conexão com cursos presenciais SENAI Transportes
- Gamificação (sem pontos transferíveis ao tier)

---

### `skill-legal` (em desenvolvimento)
**Mantida por**: Coding Rights + IRIS
**Categoria**: community
**Status**: experimental

Direitos digitais e trabalhistas:
- Templates de contestação de bloqueios indevidos
- Recursos jurídicos para reativação
- Análise LGPD do app da plataforma
- Conexão com Defensoria Pública

---

### `skill-language` (em desenvolvimento)
**Mantida por**: comunidade
**Categoria**: community
**Status**: experimental

Inglês básico para turismo e exportação. Para entregadores em rotas de aeroportos, hotéis, áreas de turismo. Microlessons offline.

---

### `skill-mentor` (em desenvolvimento)
**Mantida por**: Instituto PROA + comunidade
**Categoria**: community
**Status**: experimental

Mentoria estruturada:
- Conecta egresso da Academy com mentor profissional voluntário
- Encontros mensais por 12 meses
- Trilha de carreira longitudinal
- Hooks com `skill-academy` para certificações

---

## Como publicar uma skill no ClawHub-BR

```bash
# 1. Criar template
openbag skill init my-awesome-skill

# 2. Implementar (skill.yaml + código)

# 3. Testar localmente
openbag skill test my-awesome-skill

# 4. Publicar no ClawHub-BR
openbag skill publish my-awesome-skill --registry clawhub-br

# 5. Aguardar revisão (Foundation, ≤7 dias)

# 6. Skill listada no app dos entregadores
```

Critérios de aceitação:
- Manifest válido (yaml schema)
- Permissions justificadas e mínimas
- Sem código ofuscado
- Sem comunicação fora dos domínios declarados
- Sem dependências em recursos críticos do Estado (a menos que oficial)
- Code of Conduct + Contributor Agreement assinados

---

## Próximos documentos

- [01 · Arquitetura](01-architecture.md)
- [02 · Agente Pessoal](02-agent.md)
- [04 · Skill Sentinela](04-sentinel.md)
- [05 · Reputação Cívica](05-reputation.md)
- [06 · Academy](06-academy.md)

🐝
