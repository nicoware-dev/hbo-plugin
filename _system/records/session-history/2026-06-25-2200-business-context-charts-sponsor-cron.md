---
type: session
title: Business context, charts, cron blueprints, sponsor integrations
date: 2026-06-25
time: "22:00"
session_id: 2026-06-25-2200
topics: [business-context, overview-charts, cron, sponsor, profiles, docusaurus]
workspace_paths: [plugin/hbo-plugin, profiles, apps/docs, deploy/nemoclaw, docs]
status: closed
related: [2026-06-25-2030-dashboard-crud-composio-bridge.md]
---

# Business context, charts, cron blueprints, sponsor integrations

## Summary

Renombramos Company → Business Context, enriquecimos demo data (12 leads) y corregimos gráficos Overview (colores inline para Hermes SDK). Implementamos cron blueprints, automations API, sponsor docs/skills, profile playbooks, Docusaurus Sponsor section, y NemoClaw Dockerfile (sin probar).

## Done

### Business Context (ex-Company)
- Tab **Business**, `business-context.json`, API `/business-context`
- Tool `hbo_get_business_context` con `promptBlock`
- SOUL de los 3 profiles: cargar contexto al inicio de sesión

### Overview / demo data
- 12 leads, 4 signals, `act_004` mock Stripe
- `BarChart.tsx` con estilos inline (fix barras invisibles)
- `GET /stats` + mensaje de error si API no monta

### Cron automations note
- 5 blueprints en `profiles/*/cron/`
- `automations.py` + Setup UI + `GET /automations`

### Sponsor integrations note
- Skills: `nvidia-nemoclaw-setup`, `stripe-link-cli`
- Contributor docs + Docusaurus sponsor pages
- `deploy/nemoclaw/Dockerfile` (stub, no testeado)
- Mock `mock_approved_spend_request` en execution

### Profile skills (6.1)
- `sales-ops-playbook`, `growth-playbook`, `ops-lead-playbook`

### Tests
- 30 passing (`pnpm test:plugin`)

## Decisions

- Business Context (no Company) como nombre de producto
- Charts sin recharts — CSS/inline hex en IIFE
- Crons recommended-only; no auto-enable
- NemoClaw Dockerfile documentado pero no probado en runtime

## Files changed

- `plugin/hbo-plugin/` — state, tools, Business.tsx, Overview, BarChart, automations, demo JSON, sponsor skills
- `profiles/*/` — cron/, skills/, SOUL.md
- `apps/docs/docs/sponsor-*.md`, `sidebars.ts`
- `docs/` — SPONSOR_INTEGRATIONS, NVIDIA_NEMOCLAW, STRIPE_LINK_CLI, IMPROVEMENT_PLAN
- `deploy/nemoclaw/`
- `tests/hbo_plugin/` — test_business_context, test_sheets, updates

## Open / next

- Phase 6: DEMO_SCRIPT, screenshots, video, GitHub Pages
- CI (GitHub Actions)
- Sync crons reales (agent-driven, no solo blueprints)
- Auto-inject business context en system prompt Hermes
- Overview timeline chart (audit over time)
- P4 workflow enhancements (conversation inline, outreach preview)
- Re-link Composio WhatsApp/Meet (manual)
- Test NemoClaw Dockerfile con imagen real

## Notes

- Tras sync: `pnpm build:dashboard` + reset demo en Setup para ver charts
- Hermes debe reiniciarse para rutas `/stats` y `/business-context`
