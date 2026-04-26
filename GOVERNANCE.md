# Governança do OpenBag

Este documento descreve a estrutura de governança do projeto OpenBag durante sua fase pré-fundação (atual) e o destino institucional planejado.

---

## Princípios fundadores

1. **Neutralidade** · nenhum stakeholder isolado tem controle sobre o protocolo
2. **Transparência** · toda decisão estrutural é registrada publicamente como RFC
3. **Auditabilidade** · todo código é MIT-licensed e auditado publicamente
4. **Prioridade ao entregador** · em decisões com trade-off, o agente deve favorecer o trabalhador, não a plataforma
5. **Pluralidade** · a Board reflete a coalizão (academia, ONGs, empresas, gov, comunidades)

---

## Estado atual · fase pré-fundação

Enquanto a OpenBag Foundation não é formalmente constituída, o projeto opera sob **stewardship temporário** com a seguinte estrutura:

### Maintainers Council

Grupo inicial de maintainers responsável por:
- Aceitar/recusar PRs
- Conduzir o processo de RFC
- Mediar conflitos comunitários
- Convidar novos maintainers
- Catalisar a constituição da Foundation

A composição inicial será divulgada após a publicação do manifesto e o primeiro Meetup. Buscamos pluralidade — pelo menos 2 representantes de cada uma das frentes da [coalizão](coalition/COALITION.md).

### Custódia institucional

A custódia inicial do repositório será negociada com **ITS-Rio** (Instituto de Tecnologia e Sociedade do Rio) — referência em civic tech brasileiro com lastro internacional. Alternativas em discussão: Open Knowledge Brasil, ou universidade pública (USP/UFRJ).

A custódia institucional é **temporária**: a posse migra para a OpenBag Foundation assim que ela for legalmente constituída.

---

## Estado-alvo · OpenBag Foundation

Inspirada no modelo OpenClaw / Linux Foundation / Apache Foundation. Constituída como **organização sem fins lucrativos**, com:

### Board

Composição-alvo (9 cadeiras, mandatos de 2 anos, escalonados):
- 2 cadeiras · academia (universidades)
- 2 cadeiras · sociedade civil (ONGs civic tech)
- 1 cadeira · plataformas (rotativa entre membros do consórcio)
- 1 cadeira · setor público (rotativa estado/federação)
- 2 cadeiras · entregadores em Tier Diamante (eleitos pelos pares)
- 1 cadeira · OpenBag Foundation Executive Director

Critérios de elegibilidade:
- Maioria de 5/9 não-corporativos (academia + ONG + entregadores)
- Quórum de decisão estrutural: 6/9
- Veto de RFC requer 7/9

### Comitês

- **Technical Steering Committee (TSC)** · spec, RFCs, releases
- **Security and Privacy Committee** · threat modeling, incident response, LGPD
- **Community Committee** · meetups, Discord, comunicação, advocacy
- **Audit and Compliance Committee** · finanças, transparência, conflitos de interesse
- **Inclusion and Diversity Committee** · academy, periferias, comunidades

### Funding

A Foundation aceita doações de:
- Plataformas (consórcio · vetor I do tripartite)
- Estado (Marco Legal Startups · Lei do Bem · vetor II)
- Seguro embarcado (vetor III)
- Funders filantrópicos (Lemann, Tide Setubal, Itaú Social, Hewlett, Ford, Open Society)
- Indivíduos (GitHub Sponsors, Open Collective)

**Veto técnico de doadores é proibido.** Doadores institucionais podem participar de comitês não-técnicos, nunca do TSC.

---

## Processo de RFC (Request for Comments)

Mudanças estruturais seguem o processo RFC:

1. **Draft** · contribuidor escreve `rfcs/NNNN-titulo.md` baseado em `rfcs/0000-template.md`
2. **PR + label `rfc-discussion`** · PR aberto, anúncio no Discord
3. **Discussão pública · 14+ dias** · todos podem comentar
4. **Revisão pelo TSC** · análise técnica formal
5. **Decisão** · consenso aproximado (lazy consensus); em impasse, voto da Board
6. **Status final** · `accepted`, `rejected`, `withdrawn`, ou `superseded`

RFCs aceitos viram normativos para o projeto. RFCs rejeitados ficam públicos como aprendizado.

---

## Resolução de conflitos

Conflitos seguem o caminho:

1. **Mediação direta entre as partes** (preferencialmente em DM no Discord)
2. **Mediação por um maintainer neutro** (em canal privado)
3. **Maintainers Council / Board** (decisão registrada em ata pública)
4. **Comitê de Conduta** (em casos de violação do Code of Conduct)

Conflitos sobre captura corporativa, neutralidade ou prioridade ao entregador têm tratamento expedito — qualquer membro pode invocar diretamente o Comitê de Conduta.

---

## Transparência financeira

A Foundation publicará trimestralmente:

- Demonstrativos financeiros completos
- Lista de doadores e valores recebidos
- Aplicação de recursos por programa
- Compensação de Executive Director e staff
- Conflitos de interesse declarados pelo Board

---

## Histórico

- **2026-04** · publicação do manifesto e RFC-001 (versão atual)
- **2026-Q3** · constituição informal do Maintainers Council
- **2026-Q4** · primeira Assembleia da Comunidade
- **2027-Q1** · constituição formal da OpenBag Foundation (alvo)
- **2027-Q2** · transferência de custódia · ITS-Rio → Foundation

---

*A governança é o protocolo dos protocolos. Mantê-la pública é a primeira responsabilidade da comunidade.* 🐝
