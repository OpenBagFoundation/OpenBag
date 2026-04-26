# Como Contribuir com o OpenBag

Bem-vindo à colmeia. 🐝

O OpenBag é um projeto comunitário, MIT-licensed, mantido por contribuidores independentes. Não há vagas a preencher — há issues a resolver, RFCs a discutir, skills a publicar, comunidades a mobilizar.

Este documento descreve como você pode contribuir.

---

## Antes de começar

1. Leia o [Código de Conduta](CODE_OF_CONDUCT.md). Adesão é condição de participação.
2. Leia o [Manifesto](docs/MANIFESTO.md) para entender o "porquê" do projeto.
3. Leia o [RFC-001](docs/RFC-001.md) para entender o "como".
4. Junte-se ao [Discord da comunidade](https://discord.gg/openbag) e apresente-se em `#new-contributors`.

---

## Tipos de contribuição

O projeto se beneficia de muitas formas de contribuição — não apenas código.

### 1. Código e arquitetura
- Implementação de Skills nativas e comunitárias
- Spec de protocolos (BLE rotativo, Sentinel mixnet, Reputation tier)
- SDK do app cidadão (iOS/Android)
- Stub e integrações com Gov.br
- Auditoria de segurança (red-team, threat modeling)

### 2. Hardware
- BOM e schematic do crachá vivo (e-paper + BLE + bateria)
- Bag certificada (Secure Element + lacre eletrônico)
- Capacete com beacon

### 3. Pesquisa
- Análise de conformidade LGPD
- Threat model formal (STRIDE)
- Estudos de impacto e métricas
- Pesquisa qualitativa com entregadores e comunidades

### 4. Documentação
- Tradução RFCs para EN/ES (essencial para coalizão LATAM)
- Tutoriais e onboarding
- Casos de uso documentados

### 5. Comunidade e advocacy
- Organização de Meetups regionais (SP, RJ, BH, Recife, CDMX, Bogotá)
- Curadoria do servidor Discord
- Engajamento com fundações e funders
- Articulação política com setor público

### 6. Design e narrativa
- Sistema visual e mascote
- Comunicação para o Facebook e LinkedIn (públicos diferentes)
- Vídeos didáticos para a Academy
- Material para Mídia tradicional

---

## Fluxo de contribuição (código)

```bash
# 1. Fork o repositório
gh repo fork openbag/spec --clone

# 2. Crie uma branch para sua contribuição
cd spec/
git checkout -b feature/skill-finance-sebrae-integration

# 3. Faça suas alterações com commits descritivos
git commit -m "feat(skill-finance): add Sebrae MEI registration flow"

# 4. Atualize testes e documentação relevantes
# 5. Abra um pull request descritivo

gh pr create --title "Skill-Finance · Sebrae MEI integration" \
  --body "Closes #042 · adds skill module for MEI registration via Sebrae API..."
```

### Convenções de commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` mudança de documentação
- `spec:` mudança em RFC ou spec
- `chore:` build, infra, deps
- `refactor:` refactor sem mudança de comportamento
- `test:` testes

Exemplo: `feat(skill-sentinel): add mixnet relay rotation`

---

## Fluxo RFC (mudanças estruturais)

Para mudanças no protocolo, na arquitetura, ou em decisões fundadoras, abrimos um RFC:

1. Crie um arquivo `rfcs/NNNN-titulo-curto.md` baseado em `rfcs/0000-template.md`
2. Abra um PR marcado com label `rfc-discussion`
3. A discussão fica aberta por **mínimo 14 dias**
4. Decisão por consenso aproximado (lazy consensus); em impasse, voto da Foundation Board
5. RFC aceita: status passa a `accepted`, branch principal incorpora

---

## Issues

### Reportar bug

Use o template `Bug Report` em `.github/ISSUE_TEMPLATE/bug_report.md`. Inclua:
- Descrição clara do bug
- Passos para reproduzir
- Comportamento esperado vs observado
- Ambiente (OS, versão do agente, hardware)

### Propor feature

Use o template `Feature Proposal`. Para features grandes (>2 semanas de trabalho), considere abrir um RFC primeiro.

### Vulnerabilidade de segurança

**NÃO** abra issue pública. Veja [SECURITY.md](SECURITY.md) para responsible disclosure.

---

## Code review

Toda contribuição passa por revisão de pelo menos um maintainer. Critérios:

1. **Aderência ao spec** · a contribuição respeita os RFCs vigentes?
2. **Qualidade técnica** · código limpo, testado, documentado?
3. **Privacidade por design** · dados sensíveis ficam no dispositivo do entregador?
4. **Backward compatibility** · não quebra implementações existentes sem RFC?
5. **Segurança** · não introduz vetores de ataque?

Reviewers tem **7 dias** para resposta inicial. PRs sem resposta após esse prazo, contate `@maintainers` no Discord.

---

## Maintainers

A lista atual de maintainers está em [GOVERNANCE.md](GOVERNANCE.md). Maintainers são contribuidores que demonstraram comprometimento sustentado e foram convidados pelo Board.

### Promoção a maintainer

Critério (após 6 meses de contribuição ativa):
- 10+ PRs aceitos no projeto
- Participação consistente em RFCs
- Aderência ao Code of Conduct
- Indicação de 2 maintainers existentes
- Aprovação da Board

---

## Recompensas e reconhecimento

Seguindo o modelo OpenClaw, o OpenBag reconhece contribuidores em níveis:

- **Hexagon** · primeira contribuição aceita (issue, PR, RFC, doc)
- **Worker Bee** · 5+ contribuições, ativo no Discord
- **Forager** · skill comunitária mantida no ClawHub-BR
- **Drone Engineer** · maintainer com privilégios de merge
- **Queen** · cadeira na OpenBag Foundation Board

Reconhecimento público nos releases mensais e no `CONTRIBUTORS.md`. Para contribuidores institucionais (universidades, ONGs, empresas), reconhecimento na seção `coalition/COALITION.md`.

---

## Recursos para começar rápido

- 📺 [Vídeo · 5 minutos sobre o OpenBag](#) (em produção)
- 🎓 [Walkthrough da arquitetura](#) (em produção)
- 🛠️ [Setup de dev local](docs/dev-setup.md) (em produção)
- 💬 [Discord · #new-contributors](https://discord.gg/openbag)

---

*Bem-vindo à colmeia. Cada um traz mel.* 🐝
