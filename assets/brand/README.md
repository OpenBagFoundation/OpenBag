# Brand Kit · OpenBag

> Guia de uso visual da identidade OpenBag. Para upload no GitHub, LinkedIn, sites parceiros, materiais da Academy e cobertura de imprensa.

---

## Avatar primário · uso geral

O **mascote** é uma abelha estilizada dentro de um hexágono alaranjado, sobre fundo creme. Símbolo escolhido para evocar:

- **Hexágono** · célula da colmeia · trabalho coletivo · padrão modular
- **Abelha** · cada contribuidor traz mel · construção comunitária
- **Cor amber/B8531F** · calor, urgência operacional, civic tech brasileiro

### Arquivos

| Arquivo | Tamanho | Uso recomendado |
|---------|---------|-----------------|
| `avatar-primary.svg` | vetorial | sempre que possível, escalável |
| `avatar-primary-1024.png` | 1024×1024 | banner de header de organização GitHub |
| `avatar-primary-512.png` | 512×512 | **avatar de organização GitHub** ⭐ |
| `avatar-primary-256.png` | 256×256 | LinkedIn page · perfil de coalizão |
| `avatar-primary-128.png` | 128×128 | menções inline, listas de coalizão |

### Como usar no GitHub (organização)

1. Crie a organização `openbag` em https://github.com/organizations/new
2. Settings → "Profile picture" → Upload `avatar-primary-512.png`
3. Settings → "Profile" → adicione o tagline:
   *"Open identity, agent, and civic reputation for last-mile delivery"*
4. Settings → "Profile" → URL: `https://openbag.org` (quando o domínio estiver registrado)

---

## Avatar minimal · contextos pequenos

Versão simplificada para contextos onde detalhes da abelha não são legíveis (favicon, ícone de app, tab do navegador).

| Arquivo | Tamanho | Uso |
|---------|---------|-----|
| `avatar-minimal.svg` | vetorial | base |
| `avatar-minimal-256.png` | 256×256 | ícone de app (resolução intermediária) |
| `avatar-minimal-128.png` | 128×128 | apple-touch-icon |
| `avatar-minimal-64.png` | 64×64 | favicon de alta resolução |
| `avatar-minimal-32.png` | 32×32 | favicon padrão |

---

## Avatar dark · fundos escuros

Variante com fundo escuro `#14181F` e hexágono em gradiente amber/honey, para uso quando a logo precisa contrastar em superfície escura (apresentações dark, GitHub README banners em modo escuro, slides técnicos).

| Arquivo | Uso |
|---------|-----|
| `avatar-dark.svg` | base vetorial |
| `avatar-dark-512.png` | 512×512 · uso geral |

---

## Wordmark · headers e materiais

Logo horizontal com hexágono à esquerda e nome "OpenBag" + tagline à direita. Para uso em headers de páginas, slides, materiais impressos.

| Arquivo | Tamanho | Uso |
|---------|---------|-----|
| `wordmark.svg` | vetorial | uso preferido |
| `wordmark-1200.png` | 1200×400 | apresentações, materiais impressos |

**Não use** o wordmark em espaços menores que 400px de largura — ilegível. Para esses casos, use apenas o avatar.

---

## Social banner · OG image

Banner 1200×630 px com headline visual *"Bag legítima emite sinal. A fraudada é silenciosa."* e marca destacada. Otimizado para LinkedIn, Twitter/X, Bluesky e GitHub social preview.

| Arquivo | Tamanho | Uso |
|---------|---------|-----|
| `social-banner.svg` | vetorial | base |
| `social-banner-1200x630.png` | 1200×630 | **OG image padrão** ⭐ |

### Como configurar no GitHub social preview

1. No repo: Settings → "Social preview"
2. Upload `social-banner-1200x630.png`
3. Quando alguém compartilha o link do repo no LinkedIn/Twitter/Slack, esta imagem aparece automaticamente

### Como usar como capa de post LinkedIn

Ao publicar o post de Day 0, anexe `social-banner-1200x630.png` como imagem do post. LinkedIn dimensiona corretamente.

---

## Paleta de cores oficial

| Token | Hex | Uso |
|-------|-----|-----|
| `--paper` | `#F5EFE2` | fundo principal claro |
| `--paper-2` | `#EAE2CF` | fundo secundário, gradiente |
| `--ink` | `#14181F` | texto principal escuro, fundo dark |
| `--ink-soft` | `#4A4F58` | texto secundário, descritivo |
| `--amber` | `#B8531F` | cor primária da marca · destaques |
| `--amber-2` | `#D87432` | gradiente, hover, dark mode |
| `--honey` | `#E0A82E` | acento brilhante, destaque positivo |
| `--gold` | `#B8911F` | tier ouro, distinções |
| `--verify` | `#2E5D3F` | verificação positiva, sinal verde |
| `--alert` | `#A8332B` | suspensão, revogação, atenção |

Variáveis CSS já estão no `dashboard.html`. Para uso fora do dashboard, copie os valores hex.

---

## Tipografia oficial

- **Display** · Fraunces (Google Fonts) · pesos 300, 400, 500, 600, 700 + itálico
- **Body** · Geist (Google Fonts) · pesos 300, 400, 500, 600, 700
- **Monospace** · Geist Mono (Google Fonts) · pesos 400, 500

Importação:

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Hierarquia de uso:
- Headlines, números grandes, citações: **Fraunces**, peso 300, itálico para destaque
- Corpo de texto, parágrafos: **Geist**, peso 400
- Tags, eyebrows, código, métricas: **Geist Mono**, peso 400-500, letter-spacing aumentado, uppercase

---

## Mascote · uso narrativo

A abelha 🐝 emoji é parte da identidade narrativa. Usar em:

- Final de comunicações públicas (manifesto, posts, releases)
- Como assinatura informal nos commits
- Em exemplos de skill manifests no ClawHub-BR

Evitar:
- Excesso. Uma vez por comunicação é suficiente.
- Em contextos formais (RFC headers, contratos, MOUs)

---

## Frases-âncora · podem ser usadas livremente

- *"Bag legítima emite sinal. Bag fraudada é silenciosa."*
- *"Cada um traz mel."*
- *"A colmeia recebe quem traz mel."*
- *"Não é app. É agente."*
- *"Cidadania boa vira credencial portátil."*
- *"A porta de entrada é a periferia, não a sala de reuniões corporativa."*
- *"Presença prova. Ausência não condena."* (princípio inegociável do RFC-002)
- *"Open: open source, open to everyone, community-driven."*

---

## Reuso por terceiros

Como o projeto é MIT-licensed, o brand kit também pode ser reusado livremente para:

- Implementações forks (com diferenciação visual recomendada)
- Cobertura jornalística
- Materiais acadêmicos (papers, apresentações)
- Materiais educativos da Academy e parceiros 1MiO/UNICEF

**Não-uso**:
- Não usar a marca para implicar endosso oficial sem que o uso esteja registrado em `coalition/MEMBERS.md`
- Não modificar o avatar primário com sobreposições ou alterações de cor que descaracterizem a identidade

---

🐝 *A marca é um portal, não um troféu. Use bem.*
