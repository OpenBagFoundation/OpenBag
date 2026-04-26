# Spec 04 · Skill Sentinela

> Quem mais conhece o bandido é quem trabalha ao lado dele. A Skill Sentinela elimina o medo de denunciar de forma técnica e estrutural — protegendo o anonimato em três camadas e garantindo proteção familiar quando a investigação escala.

---

## Premissa

A confissão silenciosa de toda a categoria: muitos entregadores honestos sabem quem são os fraudadores na própria comunidade. Vizinhos de prédio, conhecidos da quebrada, contatos do mesmo grupo de WhatsApp. Não denunciam por uma única razão — **medo de represália a si mesmos e à família**.

> *"A gente sabe quem é. Mora no mesmo prédio, anda na mesma quebrada, manda mensagem no grupo do WhatsApp. Mas se eu falar, eles me pegam. Pegam minha família."* — relato coletado em entrevistas com entregadores · SP centro · 2025

A Skill Sentinela traduz esse medo em **arquitetura técnica de proteção**, em três camadas redundantes.

---

## Inspirações

| Conceito | Origem | Como aplicamos |
|----------|--------|---------------|
| **Onion routing** | Tor Project | Mensagens passam por relays voluntários, origem indeterminável |
| **Mixnet** | Loopix, Nym | Mensagens são misturadas, dificultando análise de tráfego |
| **Anonimato operacional** | Disque-Denúncia 181 | Atendentes treinados, ligações não-rastreadas |
| **Programa de proteção** | PROVITA · SENASP | Realocação, suporte familiar, recompensa anônima |

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Entregador legítimo (denunciante)                      │
│  ↓ usa Skill Sentinela no agente local                  │
│                                                         │
│  ┌────────────────────────────────────────────────┐     │
│  │  Camada 01 · Anonimato técnico                 │     │
│  │  - Onion routing por 3+ relays voluntários     │     │
│  │  - Padding aleatório · resistente a análise    │     │
│  │  - Sem logs de IP em qualquer ponto            │     │
│  │  - Forward secrecy (chaves rotativas)          │     │
│  └────────────────────┬───────────────────────────┘     │
│                       ▼                                 │
│  ┌────────────────────────────────────────────────┐     │
│  │  Camada 02 · Anonimato operacional             │     │
│  │  - Atendente treinado (modelo Disque-181)      │     │
│  │  - Nunca pede CPF, nome ou contato             │     │
│  │  - Gera protocolo via hash anônimo             │     │
│  │  - Análise de credibilidade desacoplada        │     │
│  └────────────────────┬───────────────────────────┘     │
│                       ▼                                 │
│  ┌────────────────────────────────────────────────┐     │
│  │  Camada 03 · Proteção física (Skill Shield)    │     │
│  │  - Realocação para outra cidade (+ bônus)      │     │
│  │  - PROVITA quando aplicável                    │     │
│  │  - Suporte psicossocial família                │     │
│  │  - Ronda discreta da PM na zona                │     │
│  │  - Recompensa via PIX anônimo SENASP           │     │
│  └────────────────────┬───────────────────────────┘     │
│                       ▼                                 │
│  CIOPS / Polícia Civil                                  │
│  → Ação investigativa sem expor denunciante             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Camada 01 · Anonimato Técnico

### Spec do mixnet

A denúncia é encapsulada em pacotes que passam por **três ou mais relays** antes de chegar ao destino final (servidor anônimo da Foundation, que despacha ao CIOPS):

```
Denunciante → Relay A → Relay B → Relay C → Servidor Foundation → CIOPS
```

Cada relay:
- Conhece apenas o relay anterior e o seguinte
- Não consegue ler o conteúdo da mensagem (cifrada em camadas concêntricas, modelo onion)
- Adiciona padding e delay aleatório (proteção contra análise de tráfego)
- Não mantém logs de IP, timestamps ou metadados

### Relays voluntários

Operados por organizações independentes que assinam compromisso de:
- Não manter logs (audit periódica)
- Aplicar atualizações de segurança em até 7 dias
- Operar em jurisdições diversas (Brasil, EUA, Alemanha, Suíça, etc.)
- Publicar warrant canary mensal

Mínimo de **15 relays** para garantir disponibilidade e diversidade jurisdicional. Lista em `coalition/sentinel-relays.md`.

### Forward secrecy

Chaves de sessão são rotacionadas a cada nova denúncia. Mesmo se uma chave é comprometida no futuro, não permite descriptografar denúncias passadas.

### Anti-correlação

Para evitar correlação por horário/volume:
- Agente envia "denúncias falsas" (com flag interno) periodicamente, indistinguíveis das reais para observadores externos
- Tempo entre envios é distribuído conforme distribuição de Poisson randomizada
- Volume de tráfego entre relays é constante (cobertura traffic)

### Threat model coberto

Atacantes endereçados:
- ✅ Plataformas (não conseguem identificar denunciante mesmo com acesso a logs próprios)
- ✅ ISPs nacionais (não vêem destino final)
- ✅ Atacante na conexão Wi-Fi do entregador
- ✅ Foundation (mesmo administradores não conseguem deanonimizar)
- ⚠️ Estado adversário com acesso global a múltiplas jurisdições (ataque parcialmente mitigado por relays internacionais)
- ⚠️ Compromisso simultâneo de múltiplos relays consecutivos no caminho (probabilidade baixa por design)

---

## Camada 02 · Anonimato Operacional

Espelha o modelo do **Disque-Denúncia 181**, que opera há 25+ anos no Brasil com sigilo absoluto da identidade do denunciante.

### Princípios

1. **Atendente nunca solicita identificação** — não pede nome, CPF, telefone, endereço
2. **Sem rastreamento de origem** — IP do servidor da Foundation não tem origem do denunciante (mixnet absorve)
3. **Sem gravação** — atendimento por texto cifrado, não armazenado após processamento
4. **Protocolo de acompanhamento** — denunciante recebe hash anônimo para acompanhar evolução
5. **Análise de credibilidade desacoplada da identidade** — atendente avalia conteúdo da denúncia, não o denunciante

### Fluxo

```
1. Entregador abre Skill Sentinela
2. Wizard guiado coleta:
   - Tipo de fraude (lista)
   - Localização aproximada (zona, não endereço preciso)
   - Como o denunciante sabe (testemunhou, ouviu falar, vizinho de bairro)
   - Identificação do suspeito (apelido, características, plataformas usadas, foto se possível)
   - Urgência percebida
3. Mensagem cifrada → mixnet → Foundation Sentinela Hub
4. Atendente humano (treinado) avalia em até 4 horas
5. Se válida e crível, encaminha ao CIOPS via canal cifrado
6. Denunciante recebe hash de protocolo
7. Acompanhamento opcional (denunciante checa por hash, sem expor identidade)
```

### Treinamento dos atendentes

Atendentes são contratados pela Foundation, com:
- Background check rigoroso
- Treinamento em escuta ativa, não-julgamento, sigilo
- Compromisso jurídico de sigilo profissional
- Rotacionamento periódico (cada atendente serve por mandato fixo de 18 meses)
- Auditoria de atendimentos por amostragem (com consentimento do denunciante)

---

## Camada 03 · Proteção Física (Skill Shield)

A camada técnica protege o anonimato. Mas em alguns casos, a investigação evolui ao ponto em que **há risco real** de represália — vazamento, intimidação, agressão. A Skill Shield ativa um pacote de proteções físicas.

### Gatilhos de ativação

- Denúncia escala para investigação ativa pela Polícia Civil
- Denunciante reporta proativamente sentir risco
- Análise de risco da Foundation indica probabilidade não-trivial de exposição
- Auto-ativação por sinais (mensagens ameaçadoras recebidas via número conhecido, etc.)

### Componentes

#### Realocação dentro da plataforma

Plataformas comprometidas (consórcio) oferecem realocação para outra capital, com:
- Bônus de transferência (10× o ganho médio mensal)
- Prioridade de rota nas primeiras 12 semanas
- Suporte de moradia provisória (parceria com ONGs e Caixa)
- Manutenção do tier de reputação

#### PROVITA hooks

Quando o caso se enquadra no Programa de Proteção a Vítimas e Testemunhas Ameaçadas (Lei 9.807/1999):
- Inclusão formal no PROVITA via SENASP
- Mudança de identidade (em casos extremos)
- Vigilância policial periódica
- Realocação para estado diferente

#### Cobertura familiar

- Cônjuge: realocação conjunta, vagas em programas paralelos quando aplicável
- Filhos: escola alternativa em casos de risco escolar
- Pais: alarme residencial pago + ronda discreta da PM

#### Suporte psicossocial

- Atendimento psicológico via CRAS local
- Grupo de apoio com o Sou da Paz e Instituto Igarapé
- Mentoria de longo prazo
- Cobertura confidencial de despesas médicas relacionadas ao trauma

#### Recompensa anônima

Programa de denúncia premiada da SENASP, pago via canal cifrado:
- PIX anônimo (chave rotativa) para o agente do denunciante
- Valor proporcional ao impacto da denúncia (estatuto de valores em RFC-007)
- Sem identificação do recebedor ao Fisco até saque (compatibilidade com BCB em estudo)

---

## Limitações e riscos conhecidos

### Limitação 1 · ataque global

Adversário com acesso simultâneo a múltiplas jurisdições e capacidade de análise de tráfego global pode, teoricamente, deanonimizar via análise de timing. Mitigação parcial via cover traffic e padding, mas não absoluta.

### Limitação 2 · denúncia coagida

Adversário pode forçar entregador a abrir falsa denúncia para deanonimizar (ataque de coação). Mitigação: feature de "duress code" — uma palavra/PIN especial que o entregador insere e o sistema simula envio enquanto na verdade aciona alerta de coação para a Foundation.

### Limitação 3 · denúncia caluniosa

Adversário pode usar o canal para denunciar inocentes. Mitigação: análise de credibilidade pelos atendentes, peso das denúncias reduzido conforme padrões suspeitos, e investigação policial sempre como filtro independente. Tier de reputação não pune por denúncia improcedente isolada (apenas padrão sustentado).

### Limitação 4 · captura institucional

Adversário pode tentar comprometer relays ou Foundation. Mitigação: descentralização de relays, governança neutra, auditorias trimestrais públicas, warrant canary, e — last resort — fork OSS pela comunidade.

---

## Métricas de sucesso

A Skill Sentinela é avaliada por:

- **Volume de denúncias** (proxy de adoção e confiança)
- **% de denúncias procedentes** (conforme avaliação CIOPS)
- **Tempo médio entre denúncia e ação policial**
- **Taxa de retalhamento** (deve ser próxima de zero)
- **Tier dos denunciantes** (concentração em Tier Ouro+ indica que a comunidade reconhece o risco)
- **Net Promoter Score do programa** entre denunciantes ativos

Dados publicados anonimizados em relatórios trimestrais da Foundation.

---

## Próximos documentos

- [01 · Arquitetura](01-architecture.md)
- [02 · Agente Pessoal](02-agent.md)
- [03 · Catálogo de Skills](03-skills.md)
- [05 · Reputação Cívica](05-reputation.md)
- [06 · Academy](06-academy.md)

🐝
