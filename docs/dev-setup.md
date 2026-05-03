# Setup de Desenvolvimento · OpenBag

> Guia completo para configurar seu ambiente local e contribuir com o OpenBag.
> 🇬🇧 [English version](dev-setup.en.md)

---

## Pré-requisitos

| Ferramenta | Versão mínima | Recomendado |
|------------|---------------|-------------|
| **Node.js** | 18.0.0 | 20.x LTS |
| **npm** | 9.0.0 | 10.x |
| **Git** | 2.30.0 | 2.40+ |
| **Python** (CI tools) | 3.9 | 3.11+ |

### Ferramentas opcionais (recomendadas)

- **gh** (GitHub CLI) — para abrir PRs do terminal
- **VS Code** com extensões: ESLint, Prettier, EditorConfig, GitLens, YAML
- **direnv** — para variáveis de ambiente por projeto
- **markdownlint-cli** — para validar Markdown localmente
- **lychee** — para verificar links

---

## Setup inicial

### 1. Clone o repositório

```bash
git clone https://github.com/OpenBagFoundation/OpenBag.git
cd OpenBag/
```

### 2. Instale o CLI do SDK

```bash
cd sdk/cli
npm install
npm link        # disponibiliza o comando `openbag` globalmente
cd ../..
```

Verifique a instalação:

```bash
openbag --version
openbag --help
```

### 3. Instale ferramentas de validação (opcional)

```bash
# Linter de Markdown
npm install -g markdownlint-cli

# Verificador de links
cargo install lychee   # ou: brew install lychee

# Verificador ortográfico
pipx install codespell
```

---

## Estrutura do projeto

```
OpenBag/
├── docs/        — Documentação pública (RFC, manifesto, FEATURES-100)
├── spec/        — Especificações técnicas (11 specs + API + VC)
├── sdk/         — SDK do agente, CLI e skills de referência
├── apps/        — Aplicações cidadãs (Verifica PWA, Coverage)
├── tools/       — Ferramentas de dev (seal-v0)
├── assets/      — Brand kit e imagens
├── registry/    — ClawHub-BR registry seed
├── coalition/   — Lista de parceiros institucionais
└── .github/     — CI/CD workflows e issue templates
```

---

## Desenvolvendo uma Skill

### Criar uma nova skill

```bash
openbag init my-cool-skill
```

O wizard pergunta:
- **Name** (kebab-case, deve começar com `skill-`)
- **Display name** (legível para humanos)
- **Description** (1-3 frases)
- **Category** (`core`, `community`, `experimental`)
- **Maturity** (`alpha`, `beta`, `stable`)
- **Permissions** (a partir de 25+ categorias)
- **Hooks** (lifecycle hooks que sua skill implementará)

### Validar a skill

```bash
openbag validate ./skill-my-cool-skill
```

Valida `SKILL.yaml` contra o JSON Schema oficial e reporta violações com linha/coluna.

### Rodar testes

```bash
openbag test ./skill-my-cool-skill
```

Executa todos os arquivos `.js` em `test/`. Sucesso = exit 0.

### Listar skills disponíveis

```bash
openbag list
```

### Publicar no ClawHub-BR

```bash
openbag publish ./skill-my-cool-skill
```

Imprime instruções para abrir um PR no registry comunitário.

---

## Validação local antes de PR

Antes de abrir um PR, rode o equivalente local do CI:

```bash
# Lint Markdown
markdownlint '**/*.md' --ignore node_modules

# Verificar links (em PR)
lychee --config .lychee.toml docs/ spec/

# Spell-check (PT + EN)
codespell --config .codespellrc docs/ spec/ coalition/

# Validar todas as skills
for skill in sdk/skills/*/; do
  openbag validate "$skill"
done

# Validar JSON Schema do registry
node -e "
  const Ajv = require('ajv');
  const fs = require('fs');
  const schema = JSON.parse(fs.readFileSync('sdk/skill-manifest.schema.json'));
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  console.log('Schema valid:', validate(JSON.parse(fs.readFileSync('registry/index.json'))));
"
```

---

## Rodar a landing page localmente

A landing page (`docs/index.html`) é HTML puro:

```bash
# Opção 1: Python
python3 -m http.server 8080 --directory docs/

# Opção 2: Node.js
npx http-server docs/ -p 8080

# Opção 3: VS Code Live Server extension
```

Abra `http://localhost:8080` no navegador.

---

## Rodar o app Verifica localmente

```bash
python3 -m http.server 8080 --directory apps/verifica/
```

Para testar PWA features (instalação, offline), sirva via HTTPS:

```bash
# Use ngrok, mkcert, ou o servidor de dev do Vite/Vercel
npx http-server apps/verifica/ -p 8080 -S -C cert.pem -K key.pem
```

---

## Convenções de código

### Commits — Conventional Commits

```
feat(skill-verify): add NFC scan support
fix(cli): handle missing SKILL.yaml gracefully
docs(readme): refresh contribution section
spec(rfc-002): clarify gate metric for Phase β
chore(deps): bump ajv to 8.12.0
test(skill-rep): add tier transition coverage
refactor(gateway): split permission enforcer
```

### Branch naming

```
feat/skill-finance-sebrae-integration
fix/cli-init-empty-permissions
docs/translate-rfc-001-spanish
spec/rfc-003-national-expansion
```

### JavaScript style

- ESM ou CommonJS (siga o estilo do diretório onde está editando)
- 2 espaços de indentação
- Single quotes para strings
- Semicolons obrigatórios
- `'use strict';` no topo de todo arquivo Node.js

### Markdown style

- Linhas até 100 caracteres (exceto links e tabelas)
- ATX headers (`#`, `##`, `###`)
- Listas com `-` (não `*`)
- Code blocks com linguagem identificada (` ```js `, ` ```yaml `)

---

## Hardware Development (avançado)

Para contribuir com firmware do crachá vivo (e-paper + BLE + bateria):

### Toolchain

```bash
# Nordic SDK para nRF52840
# Veja: https://www.nordicsemi.com/Products/Development-software/nRF-Connect-SDK

# Zephyr RTOS
west init -m https://github.com/nrfconnect/sdk-nrf
west update
```

### Simulador (sem hardware físico)

Use o [Renode](https://renode.io/) para emular nRF52840:

```bash
renode --console -e "include @scripts/nrf52840/run.resc"
```

### Spec de referência

Veja [spec/07-ble-beacon.md](../spec/07-ble-beacon.md) para protocolo BLE rotativo e
[spec/01-architecture.md](../spec/01-architecture.md) para BOM e schematics.

---

## Troubleshooting

### `openbag: command not found`

O `npm link` falhou ou o npm global bin não está no PATH.

```bash
npm bin -g                                    # mostra o path
export PATH="$(npm bin -g):$PATH"             # adicione ao .bashrc/.zshrc
```

### CI falha em `lychee` (link 404)

Adicione o domínio à exclusion list em `.lychee.toml` se for infraestrutura ainda não-deployada (com explicação no commit).

### CI falha em `codespell` com palavra portuguesa

Adicione a palavra ao `.codespellrc` na linha `ignore-words-list`.

### CI falha em `markdownlint`

Rode localmente para reproduzir:

```bash
markdownlint '**/*.md' --ignore node_modules
```

A maioria das regras é auto-correção:

```bash
markdownlint --fix '**/*.md' --ignore node_modules
```

---

## Recursos adicionais

- [CONTRIBUTING.md](../CONTRIBUTING.md) — Visão geral de contribuição
- [GOVERNANCE.md](../GOVERNANCE.md) — Estrutura de governança
- [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) — Código de conduta
- [SECURITY.md](../SECURITY.md) — Reporte de vulnerabilidade
- [SDK README](../sdk/README.md) — Documentação do SDK
- [CLI README](../sdk/cli/README.md) — Referência do CLI
- [spec/03-skills.md](../spec/03-skills.md) — Catálogo de Skills
- [spec/08-gateway.md](../spec/08-gateway.md) — Gateway e sandbox

---

## Suporte

- 💬 Discord: [discord.gg/openbag](https://discord.gg/openbag) · canal `#new-contributors`
- 🐛 Issues: [github.com/OpenBagFoundation/OpenBag/issues](https://github.com/OpenBagFoundation/OpenBag/issues)
- 📧 Maintainers: `maintainers@openbag.foundation` (a configurar)

---

*Bem-vindo à colmeia. Cada um traz mel.* 🐝
