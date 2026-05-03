# Guia de Publicação · OpenBag → GitHub

> Este pacote contém **toda a estrutura inicial do projeto OpenBag** pronta para ser publicada num repositório GitHub. Este documento traz o passo a passo exato.

---

## Pré-requisitos

- Conta no GitHub
- `git` instalado localmente (`git --version` deve responder)
- (Opcional, recomendado) `gh` CLI instalado e autenticado: https://cli.github.com

---

## Opção A · Via GitHub CLI (mais rápido)

```bash
# 1. Descompacte o pacote
tar -xzf openbag-repo.tar.gz
cd openbag-repo/

# 2. Inicialize o git e faça primeiro commit
git init
git add .
git commit -m "Initial commit: OpenBag RFC-001 + RFC-002 v1.1 public discussion draft"

# 3. Crie o repositório no GitHub e faça push
# Usando a org OpenBag Foundation (ou substitua por --org openbagfoundation se fizer fork)
gh repo create openbagfoundation/OpenBag --public \
  --description "Open identity, agent, and civic reputation for last-mile delivery" \
  --homepage "https://openbag.org" \
  --push --source=.

# 4. Adicione tópicos ao repo (melhora descoberta)
gh repo edit --add-topic civic-tech \
              --add-topic last-mile-delivery \
              --add-topic identity \
              --add-topic open-source \
              --add-topic brasil \
              --add-topic latam \
              --add-topic privacy \
              --add-topic agent

# 5. Configure branch padrão (caso necessário)
gh repo edit --default-branch main

# Pronto · repo em https://github.com/openbagfoundation/OpenBag
```

---

## Opção B · Via GitHub web + git push tradicional

```bash
# 1. Descompacte o pacote
tar -xzf openbag-repo.tar.gz
cd openbag-repo/

# 2. Inicialize git
git init
git add .
git commit -m "Initial commit: OpenBag RFC-001 + RFC-002 v1.1 public discussion draft"

# 3. No navegador, abra https://github.com/new
#    - Repository name: openbag
#    - Description: "Open identity, agent, and civic reputation for last-mile delivery"
#    - Public
#    - NÃO marque "Initialize with README" (já temos)
#    - Crie o repositório

# 4. Conecte o local ao remote
git branch -M main
git remote add origin https://github.com/openbagfoundation/OpenBag.git
git push -u origin main

# 5. Na página do repo no GitHub, clique no ícone de engrenagem ao lado de "About"
#    e adicione tópicos: civic-tech, last-mile-delivery, identity, open-source, brasil, latam, privacy, agent
```

---

## Opção C · Repositório de organização (recomendado para Foundation)

O projeto já está publicado sob a org **OpenBag Foundation** no GitHub:

```bash
# Repo canônico — já publicado
gh repo clone openbagfoundation/OpenBag
# OU
git remote add origin https://github.com/openbagfoundation/OpenBag.git

# Para adicionar co-maintainers à org:
#    Settings → People → Invite member
#    (sugestão: contatos da Frente VII · Governance Open-Source da coalizão)
```

---

## Após publicação · próximos passos

### Imediatamente

- [ ] Adicionar **descrição clara** e **homepage URL** ao repo (Settings → About)
- [ ] Adicionar **tópicos** (civic-tech, identity, last-mile-delivery, brasil, etc.)
- [ ] Habilitar **Discussions** (Settings → Features → Discussions)
- [ ] Habilitar **Issues** (já habilitado por padrão)
- [ ] Habilitar **Sponsors** se desejado (Settings → Sponsorships)
- [ ] Configurar **branch protection** em `main` (Settings → Branches)

### Nas primeiras 48h

- [ ] Criar issues a partir das colunas de "Issues prioritárias" do README
  - Use as labels: `good-first-issue`, `help-wanted`, `core-spec`, `hardware`, `mobile`
- [ ] Pin o `MANIFESTO.md` no repo
- [ ] Adicionar **GitHub Action** mínimo para markdown lint
- [ ] Configurar **GitHub Pages** apontando para `docs/` (landing em `docs/index.html`)

### Na 1ª semana

- [ ] Publicar release `v1.0-draft` (com o tag `v1.0-rfc-discussion-draft`)
- [ ] Anunciar no LinkedIn (use o post sugerido)
- [ ] Anunciar nos canais sugeridos (lista completa em separado)
- [ ] Criar Discord server "Hive"
- [ ] Configurar Meetup OpenBag SP

### Nas primeiras 4 semanas

- [ ] Primeiros 10 issues triados pela comunidade
- [ ] Primeiro PR externo aceito
- [ ] Primeiro Meetup presencial em São Paulo
- [ ] Primeira reunião com 1MiO/UNICEF para parceria Academy
- [ ] Primeira reunião com SSP-SP / PRODESP
- [ ] Primeira reunião com ITS-Rio para custódia institucional

---

## Setup recomendado de GitHub Pages

Para servir o dashboard executivo direto do repo:

```bash
# Settings → Pages → Source: Deploy from a branch → main → / (root)
# URL final: https://openbagfoundation.github.io/OpenBag/
# Landing page: docs/index.html  |  Dashboard: docs/dashboard.html
```

---

## Domínio futuro

Quando a Foundation se constituir, registre:
- `openbag.org` (preferido)
- `openbag.dev` (alternativa tech)
- `.com.br` (defensivo)

E aponte para GitHub Pages do repo.

---

## Estrutura do repositório

```
openbag/
├── README.md                    # Página principal · primeira leitura
├── LICENSE                      # MIT
├── CONTRIBUTING.md              # Como contribuir
├── CODE_OF_CONDUCT.md           # Adaptado do Contributor Covenant 2.1
├── GOVERNANCE.md                # Governança pré-fundação + Foundation alvo
├── ROADMAP.md                   # 4 ondas com fases α-β-γ-δ e gates
├── SECURITY.md                  # Responsible disclosure + threat model
├── PUBLISH-GUIDE.md             # Este arquivo
│
├── docs/
│   ├── MANIFESTO.md             # Manifesto público (10 seções)
│   ├── RFC-001.md               # Visão geral arquitetural
│   └── RFC-002.md               # Cold start e implantação por fases ⭐
│
├── spec/
│   ├── 01-architecture.md       # Pilares · Selo Digital v0 e Físico v1
│   ├── 02-agent.md              # Agente pessoal (estilo OpenClaw)
│   ├── 03-skills.md             # Catálogo de Skills
│   ├── 04-sentinel.md           # Skill Sentinela · denúncia protegida
│   ├── 05-reputation.md         # Sistema 4 tiers
│   └── 06-academy.md            # OpenBag Academy · Heliópolis
│
├── coalition/
│   └── COALITION.md             # 8 frentes · ~80 instituições candidatas
│
├── academy/                     # (placeholder · materiais didáticos virão)
│
├── assets/
│   └── dashboard.html           # Dashboard executivo navegável v1.1
│
└── .github/
    ├── PULL_REQUEST_TEMPLATE.md
    └── ISSUE_TEMPLATE/
        ├── bug_report.md
        ├── feature_proposal.md
        └── skill_proposal.md
```

---

## Sobre o RFC-002 · cold start (importante)

Antes de fazer qualquer comunicação pública (LinkedIn, imprensa, podcasts), leia o **RFC-002 · Cold Start e Implantação por Fases**. Ele define:

- O **princípio inegociável** "Presença prova. Ausência não condena."
- As **quatro fases** α-β-γ-δ com gates objetivos entre elas
- O **polígono fundador** Heliópolis-Sacomã (~5 km²) que precisa ser saturado antes da campanha cidadã
- O **Selo Digital v0** que cobre 80% do valor com 5% do custo, antes do hardware estar pronto
- A regra: **LinkedIn post principal sai apenas na Fase γ** (Dia 120-270), não no Day 0

A primeira pergunta de qualquer engenheiro experiente, funder, ou jornalista crítico será sobre cold start. Ter o RFC-002 publicado no Day 0 muda a percepção de "ideia interessante" para "operação madura".

---

## Comandos úteis pós-publicação

```bash
# Ver release atual
gh release view v1.0-rfc-discussion-draft

# Listar issues abertas
gh issue list

# Estatísticas da semana
gh repo view --json stargazerCount,forkCount,watchers

# Adicionar contribuidor
gh repo add-collaborator USERNAME

# Habilitar Dependabot (security updates)
# (já vem por padrão em repos públicos)
```

---

🐝 *A colmeia recebe quem traz mel.*
