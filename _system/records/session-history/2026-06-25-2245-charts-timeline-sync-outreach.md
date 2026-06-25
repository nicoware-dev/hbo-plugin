---
type: session
title: Charts theme, audit timeline, sync tool, outreach preview
date: 2026-06-25
time: "22:45"
session_id: 2026-06-25-2245
topics: [dashboard, charts, timeline, sync, outreach, docs]
workspace_paths: [plugin/hbo-plugin, apps/docs, tests/hbo_plugin, profiles]
status: closed
related: [2026-06-25-2200-business-context-charts-sponsor-cron.md]
---

# Charts theme, audit timeline, sync tool, outreach preview

## Summary

Corregimos el estilo de los gráficos Overview para heredar Cards del SDK Hermes, añadimos timeline de audit, tool `hbo_sync_sales_sources`, outreach preview en outbound_growth, y actualizamos apps/docs. 32 tests passing.

## Done

### Chart styling fix
- `BarChart.tsx` usa `Card`/`CardTitle`/`CardContent` del SDK (no divs con fondo negro)
- CSS en `dashboard/src/styles/index.css` — tracks con `currentColor` / tema primary
- Overview alineado con layout `className` como otras páginas

### Audit timeline (P8)
- `auditTimeline` en `GET /stats` — últimos 7 días
- Demo `audit.json` enriquecido con 6 eventos

### Sync cron ejecutable
- `sources/sync.py` + `hbo_sync_sales_sources` (tool #18)
- Skip en local-demo sin Composio; import + audit en composio/hybrid
- Cron blueprint actualizado

### P4 outreach preview
- `draft_outreach_message()` usa business context
- `outbound_growth` → `outreachPreview` en actions, `draftMessages` en batch
- UI en Workflows y Actions (expandible)

### apps/docs
- intro.mdx, install.md, dashboard.md — Business tab, charts, reset demo, sponsor, sync

## Git

Already committed in 3 commits (user/session):
- `0add6e8` feat: sync, outreach, audit demo, stats timeline backend
- `33c56e3` feat(dashboard): Hermes-themed charts, outreach UI
- `db4cd9f` docs: apps/docs + cron config

## Open / next

- Phase 6: DEMO_SCRIPT.md, screenshots, video, GitHub Pages
- GitHub Actions CI
- Auto-inject business context in Hermes system prompt
- P4.1 conversation review inline

## Notes

- Tras sync: reset demo en Setup para 12 leads + audit timeline visible
- Branch ahead of origin — push pending
