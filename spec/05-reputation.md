# Spec 05 · Reputação Cívica

> Cidadania boa vira credencial portátil. Sistema escalonado em 4 tiers com benefícios materiais reais.

---

## Princípios

1. **Ganhos materiais reais** · não é gamificação
2. **Critérios verificáveis** · não é avaliação subjetiva
3. **Portabilidade** · acompanha o entregador entre plataformas e empresas
4. **Reconhecimento jurídico** · serve como prova de boa conduta laboral
5. **Reversibilidade limitada** · perde tier apenas por violações graves

---

## Os 4 Tiers

### Tier I · Bronze · "Verificado"

**Critério**:
- Selo emitido (KYC + biometria + SINESP OK)
- Ativo há ≥ 30 dias
- Sem ocorrências (denúncias procedentes, suspensões) no período

**Benefícios**:
- Verificação cidadã pública (com sua foto e plataforma visíveis)
- Botão de pânico ativo
- Microcrédito Caixa MEI simplificado
- Voz nas Assembleias da Comunidade Heliópolis (e outras)
- Selo digital portátil em formato W3C-DID

**Bônus financeiro**: nenhum (entrada).

---

### Tier II · Prata · "Confiável"

**Critério (qualquer um dos seguintes)**:
- 6+ meses ativo no Tier Bronze
- 1ª denúncia procedente via Skill Sentinela
- 1.000+ verificações cidadãs sem incidente

**Benefícios**:
- Tudo do Bronze
- **Bônus mensal R$ 80** do fundo tripartite
- Plano saúde com 30% desconto (parceria BB Seguros)
- Prioridade em rotas premium das plataformas
- Selo "Top Civil" visível no app cidadão
- Skills opcionais sob avaliação preferencial pela Foundation

**Reversão**: 1 violação grave → Bronze.

---

### Tier III · Ouro · "Sentinela"

**Critério (todos)**:
- 12+ meses ativo
- 3+ denúncias procedentes via Skill Sentinela
- Mentor designado de outros entregadores Bronze
- Conclusão de módulo "Cidadania Ativa" da Academy

**Benefícios**:
- Tudo do Prata
- **Bônus mensal R$ 200** + carga horária reduzida
- Plano saúde gratuito · família incluída (cônjuge + filhos)
- Acesso prioritário a vagas CLT em logística
- **Voz no Conselho Comunitário OpenBag** (assento rotativo)
- Acesso a missões exclusivas (mentoria, hackathons, audiências)

**Reversão**: 1 violação grave → Prata.

---

### Tier IV · Diamante · "Embaixador"

**Critério (todos)**:
- 24+ meses ativo
- Liderança comprovada (testemunhal + objetiva)
- Risco real assumido pela comunidade (caso Shield ativo, ou denúncia de alto impacto)
- Indicação por 3+ entregadores Tier Ouro
- Aprovação por Comitê de Reconhecimento da Foundation

**Benefícios**:
- Tudo do Ouro
- **Trilha CLT garantida** em logística (iFood Logística, Mercado Livre Hub, Magalu Entregas)
- **Bolsa universitária** (parceria Estácio, Universidade Cruzeiro do Sul)
- "Carteira diplomática" civic tech LATAM (acesso a eventos internacionais)
- **Cadeira na OpenBag Foundation Board** (2 das 9 cadeiras totais)
- Acesso ao programa global de mentoria (Aspen, Hewlett, GOYN)

**Reversão**: 1 violação extrema (fraude grave própria) → Bronze + revisão pelo Comitê.

---

## Eventos que afetam tier

### Eventos positivos

| Evento | Peso |
|--------|------|
| Verificação cidadã sem incidente | Baixo (cumulativo) |
| Tempo ativo (cada mês) | Médio |
| Denúncia procedente · Sentinela | Alto |
| Conclusão de módulo Academy | Médio |
| Mentoria a Bronze (cada 100 horas) | Alto |
| Liderança em Meetup, hackathon, audiência | Alto |
| Ato heroico documentado (proteger vítima de bandido) | Muito alto |

### Eventos negativos

| Evento | Peso |
|--------|------|
| Complaint de cliente (1ª) | Aviso, sem rebaixamento |
| Complaint de cliente (3+) | Pode rebaixar tier |
| Suspensão temporária de plataforma | Suspende ganhos do tier |
| Denúncia procedente CONTRA o entregador | Rebaixamento direto |
| Selo revogado (kill switch) | Rebaixa para Bronze, com revisão |
| Fraude documentada (própria) | Rebaixa para Bronze + bloqueio temporário |
| Violação do Code of Conduct | Aviso → suspensão → rebaixamento |

---

## Cálculo do tier

O agente local calcula o tier via `skill-rep`. Algoritmo simplificado:

```
tier = max([Bronze, Prata, Ouro, Diamante]
           where critérios do tier são satisfeitos
           e nenhuma violação grave nos últimos 30 dias)
```

Eventos são acumulados localmente no agente. Validação periódica contra a Foundation (a cada 24h) garante consistência. Disputas são resolvidas via Comitê de Reconhecimento.

---

## Reconhecimento jurídico

A reputação acumulada é reconhecida como:

### Para microcrédito

Bancos parceiros (Caixa, BB) aceitam o tier como **comprovante de boa conduta laboral** em análise de risco para microcrédito MEI.

### Para emprego CLT

Empresas comprometidas (iFood Logística, Mercado Livre, Magalu, etc.) reconhecem o tier como **diferencial qualificável** em processos seletivos. Diamante: vaga garantida.

### Para juízo trabalhista

A reputação histórica pode ser apresentada como prova em ações trabalhistas (ex: contestação de bloqueio injusto).

### Para governo

Programas governamentais podem usar o tier como critério em vagas de auxiliar de logística pública, segurança municipal, monitoramento.

---

## Privacidade da reputação

- O tier é **propriedade do entregador**. Ele decide quando e a quem expor.
- Em verificação cidadã pública: tier opcional (default oculto)
- Em busca de emprego: compartilhamento via QR ou link único, com expiração
- Em auditoria interna: dados detalhados ficam no agente local; Foundation só vê tier consolidado

---

## Não-objetivos

A reputação NÃO mede:

- Velocidade de entrega
- Quantidade de entregas (volume bruto)
- Avaliação de cliente (rating de plataforma)
- Métricas de produtividade comercial

Estas métricas continuam com as plataformas. O OpenBag não compete com elas — ele é ortogonal, focado em **cidadania, não em produtividade comercial**.

---

## Próximos documentos

- [01 · Arquitetura](01-architecture.md)
- [02 · Agente Pessoal](02-agent.md)
- [03 · Catálogo de Skills](03-skills.md)
- [04 · Skill Sentinela](04-sentinel.md)
- [06 · Academy](06-academy.md)

🐝
