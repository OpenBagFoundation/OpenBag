# DPIA · Relatório de Impacto à Proteção de Dados Pessoais

> Documento previsto no Art. 38 da LGPD e na Resolução CD/ANPD nº 2/2022.

| Campo | Valor |
|-------|-------|
| **Versão** | 0.0.1-rascunho |
| **Status** | Pendente — a ser elaborado antes da Fase β |
| **Responsável** | Grupo de Trabalho Jurídico · OpenBag Foundation |
| **Lei aplicável** | LGPD · Lei 13.709/2018 · Art. 38 |
| **Órgão regulador** | ANPD — Autoridade Nacional de Proteção de Dados |

---

## Status

Este DPIA ainda não foi elaborado formalmente. O documento completo será produzido com assessoria jurídica especializada em LGPD antes de qualquer implantação em produção (Fase β).

Enquanto isso, veja a análise de conformidade preliminar em [LGPD-analysis.md](LGPD-analysis.md).

---

## Escopo previsto

| Categoria de dado | Base legal | Risco previsto |
|------------------|-----------|----------------|
| Dados biométricos (liveness) | Consentimento explícito (Art. 11, I) | Alto — exige DPIA obrigatório |
| CPF (hash SHA-256) | Consentimento + Interesse legítimo | Médio |
| Geolocalização anonimizada (geohash-7) | Consentimento | Médio |
| Tier de reputação cívica | Consentimento | Baixo |
| Registros de rota | Consentimento | Médio |
| Relatos Sentinel (anonimizados) | Interesse legítimo — segurança pública | Baixo (sem vínculo ao reportador) |
| Afiliações de plataforma | Consentimento | Baixo |

---

## Cronograma

| Fase | Ação |
|------|------|
| Fase α (atual) | Análise preliminar em `LGPD-analysis.md` · Consentimento granular implementado |
| Pré-Fase β | DPIA formal com assessoria jurídica |
| Fase β | Submissão à ANPD se operação de alto risco confirmada |
| Pré-produção | Revisão final + DPAs assinados com plataformas integradas |

---

## Referências

- [Lei 13.709/2018 — LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Resolução CD/ANPD nº 2/2022 — DPIA](https://www.gov.br/anpd/pt-br)
- [LGPD-analysis.md](LGPD-analysis.md) — análise preliminar de conformidade
