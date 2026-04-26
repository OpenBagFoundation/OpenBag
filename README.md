# OpenBag

> **Open identity, agent, and civic reputation for last-mile delivery.**
> Identidade aberta, agente pessoal e reputação cívica para a última milha.

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)
[![RFC: 001](https://img.shields.io/badge/RFC-001-amber.svg)](docs/MANIFESTO.md)
[![Status: Public Discussion Draft](https://img.shields.io/badge/Status-Public%20Draft-amber.svg)]()

---

## Bag legítima emite sinal. Bag fraudada é silenciosa.

A bag de delivery deixou de ser equipamento logístico e virou uma **credencial implícita** — um uniforme de invisibilidade explorado por bandidos para se aproximar de vítimas. Casos recentes em São Paulo (Moema, abril/2026; Vila Olímpia; Higienópolis) mostram um padrão sistêmico: entregador falso aborda, vítima reage ou hesita, alguém morre.

O **OpenBag** é uma iniciativa **MIT-licensed**, mantida por contribuidores independentes, para construir um padrão público que:

- **Verifica** qualquer entregador em menos de 5 segundos, à distância, sem login de plataforma
- **Defende** o entregador legítimo — ele opera um agente pessoal local que protege seus dados e acumula sua reputação cívica portátil
- **Recompensa** quem é cidadão de bem com bônus financeiros, seguro saúde, trilha CLT e voz na governança
- **Protege** quem denuncia: a Skill Sentinela combina anonimato criptográfico, anonimato humano (modelo Disque-Denúncia 181) e Programa Shield de proteção familiar
- **Forma** novas turmas via OpenBag Academy, plugada no Pacto Nacional pela Inclusão Produtiva (1MiO/UNICEF)

A primeira turma da Academy começa no **CEU Heliópolis**, São Paulo.

---

## Filosofia (estilo OpenClaw)

```
Open    — código MIT, governança neutra, auditável publicamente
Agent   — cada entregador opera um agente pessoal local que defende seus interesses
Reward  — reputação cívica vira credencial portátil e benefício real
Sentinel — denúncia anônima protegida com programa de proteção familiar
Universal — qualquer cidadão verifica, sem cadastro, sem custo
```

**Princípio inegociável da implantação**:
> *Presença prova. Ausência não condena.*

O sinal verde do OpenBag confirma legitimidade. A ausência do selo **não é** prova de fraude — durante a Onda 01, a maioria dos entregadores legítimos ainda não tem selo. Detalhes do protocolo de cold start em [RFC-002](docs/RFC-002.md).

**Stewardship**: OpenBag Foundation (a constituir). Inspirado em OpenClaw, OpenStreetMap, Linux Foundation. Doadores institucionais sem direito de veto técnico.

---

## Arquitetura · 3 pilares + 1 agente

| Pilar | O que é | Owner |
|-------|---------|-------|
| **Identidade Soberana** | Selo emitido como carteira digital Gov.br Nível Ouro, vinculando pessoa + biometria + plataforma + equipamento | Gov.br · Serpro · ITI |
| **Equipamento Inviolável** | Bag/capacete/colete com chip NFC Secure Element, beacon BLE rotativo, QR dinâmico em e-paper, lacre eletrônico | OpenBag Foundation · OEMs |
| **Crachá Vivo** | Display e-paper visível a 15m, GPS embarcado, botão de pânico, biometria de ativação, 60+ dias de bateria | Plataformas · SSP estaduais |
| **Agent Pessoal** | Software MIT-licensed rodando localmente no smartphone do entregador, com Skills modulares contribuíveis | Comunidade |

---

## Skills nativas do agente

- **skill-verify** — verificação cidadã via NFC, BLE, ou câmera
- **skill-sentinel** — denúncia anônima protegida (3 camadas)
- **skill-rep** — reputação cívica em 4 tiers (Bronze → Diamante)
- **skill-rewards** — resgate de benefícios escalonados
- **skill-panic** — botão de pânico georreferenciado
- **skill-shield** — proteção familiar quando denúncia ativa
- **skill-academy** — trilha de formação
- **skill-route** — heat-map público com posição anonimizada

Plus skills comunitárias (skill-finance, skill-health, skill-defensive...) e abertura para devs publicarem na **ClawHub-BR** (registry comunitário).

---

## Como começar a contribuir

```bash
# Clone o repositório
git clone https://github.com/openbag/spec.git
cd spec/

# Leia os documentos fundadores
cat docs/MANIFESTO.md
cat CONTRIBUTING.md
cat CODE_OF_CONDUCT.md
cat docs/RFC-001.md

# Encontre uma issue para começar
# https://github.com/openbag/spec/issues?q=label:good-first-issue

# Junte-se à comunidade
# Discord:  https://discord.gg/openbag
# Meetup:   https://meetup.com/openbag-sp
# Forum:    https://forum.openbag.org
```

---

## Documentos essenciais

- 📜 [Manifesto público](docs/MANIFESTO.md)
- 📋 [RFC-001 · visão geral](docs/RFC-001.md)
- 🚦 [RFC-002 · cold start e implantação por fases](docs/RFC-002.md)
- 🏗️ [Arquitetura](spec/01-architecture.md)
- 🤖 [Agente pessoal](spec/02-agent.md)
- 🧩 [Catálogo de Skills](spec/03-skills.md)
- 🛡️ [Skill Sentinela · denúncia protegida](spec/04-sentinel.md)
- 🏆 [Sistema de Reputação Cívica](spec/05-reputation.md)
- 🎓 [OpenBag Academy](spec/06-academy.md)
- 🤝 [Coalizão de Talentos](coalition/COALITION.md)
- 🗺️ [Roadmap](ROADMAP.md)
- 📐 [Governança](GOVERNANCE.md)
- 🔒 [Segurança · responsible disclosure](SECURITY.md)

📊 **Dashboard executivo:** [`assets/dashboard.html`](assets/dashboard.html) — abra em qualquer navegador.

---

## Issues prioritárias (good-first-issue / help-wanted)

| ID | Área | Descrição | Dificuldade |
|----|------|-----------|-------------|
| `#001` | core/spec | Especificação do beacon BLE rotativo | ★★★ |
| `#002` | mobile/ios | Background BLE scanner | ★★ |
| `#003` | hardware | Protótipo do crachá vivo (e-paper + BLE) | ★★★ |
| `#004` | cv/badge-reader | Leitura óptica do código rotativo | ★★ |
| `#005` | gov/api | Stub da integração Gov.br Selo | ★ |
| `#006` | docs/i18n | Tradução RFC 001 para EN/ES | ★ |
| `#007` | policy/lgpd | Análise de conformidade LGPD | ★★ |
| `#008` | brand | Sistema visual + mascote | ★ |
| `#009` | audit/redteam | Bug bounty + threat model | ★★★ |

---

## Família OpenBag · extensibilidade

A arquitetura é projetada para extensão. **OpenRide** (mobilidade Uber/99/InDrive) é o irmão natural — endereçando os vetores de risco simétricos de falso motorista e falso passageiro. Spec em desenho na branch `openride-spec`.

---

## Licença

[MIT License](LICENSE) · forking encorajado · contribuições bem-vindas.

---

*"A bag legítima emite sinal. O entregador legítimo é reconhecido. O bandido é silenciado."* 🐝
