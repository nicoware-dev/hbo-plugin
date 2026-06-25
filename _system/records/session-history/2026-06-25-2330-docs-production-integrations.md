---
type: session
title: Docs production tone, sidebar groups, integrations rename
date: 2026-06-25
time: "23:30"
session_id: 2026-06-25-2330
topics: [docs, docusaurus, integrations, install, production-copy]
workspace_paths: [apps/docs, docs]
status: closed
related: [2026-06-25-1523-docs-ui-demo-cleanup.md, 2026-06-25-2200-business-context-charts-sponsor-cron.md]
---

# Docs production tone, sidebar groups, integrations rename

## Summary

Unificamos Install + install prompt con URL de GitHub, reorganizamos el sidebar en grupos Plugin e Integrations (sin “sponsor”), y reescribimos la documentación pública con tono de producto terminado — sin MVP, demo ni hackathon.

## Done

### Install page
- Eliminada página `install-prompt.md`; prompt inline en `install.md` con `https://github.com/nicoware-dev/hbo-plugin`
- Actualizados enlaces en intro, how-it-works, objectives, DocsIndexCards, CopyInstallPrompt, `docs/INSTALLATION_PROMPT.md`

### Sidebar y estructura
- Grupo **Plugin**: plugin, dashboard, profiles, skills
- Grupo **Integrations**: overview, composio-cli, nvidia-nemoclaw, stripe-link
- Renombradas páginas `sponsor-*` → `integrations.md`, `nvidia-nemoclaw.md`, `stripe-link.md`
- Footer Docusaurus alineado con Plugin / Integrations

### Tono producción
- Eliminadas referencias a MVP, hackathon, “not required for MVP”, “optional for first run”
- Integraciones con columna “When to use”; “sample workspace data” en lugar de “demo data”
- Objectives reescrito sin roadmap interno de MVP
- Landing components (HomepageFeatures, ProblemSolution, ArchitectureSection) alineados

### Contributor docs
- `docs/SPONSOR_INTEGRATIONS.md` → `docs/INTEGRATIONS.md` (pendiente allowlist en `.gitignore`)

## Open / next

- Renombrar botón UI “Reset demo data” → “Restore sample data” para coincidir con docs
- Redirects `/docs/install-prompt` y `/docs/sponsor-*` si hay enlaces externos guardados
- Añadir `!docs/INTEGRATIONS.md` en `.gitignore` y retirar `SPONSOR_INTEGRATIONS` del allowlist

## Files changed (session narrative)

- `apps/docs/docs/*`, `apps/docs/sidebars.ts`, `apps/docs/docusaurus.config.ts`
- `apps/docs/src/components/*`
- `docs/INTEGRATIONS.md`, delete `docs/SPONSOR_INTEGRATIONS.md`
