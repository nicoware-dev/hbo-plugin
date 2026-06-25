---
type: session
title: Dashboard CRUD, Composio bridge, Gmail execution
date: 2026-06-25
time: "20:30"
session_id: 2026-06-25-2030
topics: [dashboard, crud, composio, gmail, bridge, hermes]
workspace_paths: [plugin/hbo-plugin, tests/hbo_plugin, docs]
status: closed
related: [2026-06-25T1400-composio-sheets-integration.md]
---

# Dashboard CRUD, Composio bridge, Gmail execution

## Summary

Revisamos el plan de mejoras post-MVP, ejecutamos oleadas 0–4, y el usuario verificó el dashboard en Hermes. Se implementó CRUD completo (API + UI), página Signals, bridge Composio con mode toggle, ejecución Gmail post-approve, y se corrigió un bug CRLF en el cliente WSL que impedía que Tool Bridges mostrara Composio como conectado.

## Done

### Plan review & execution (oleadas 0–4)
- Oleada 0: verificación Hermes confirmada por el usuario (dashboard + plugin operativos).
- Oleada 1: feedback approve/reject con `auditEvent`, panel JSON en Workflows, reset demo en Setup.
- Oleada 2: `mutations.py`, rutas CRUD en `plugin_api.py`, `resolve_signal` / `remove_action` en state.
- Oleada 3: `Signals.tsx`, forms Leads/Actions, `postJSON`/`putJSON`/`deleteJSON`, import Sheets desde Leads.
- Oleada 4: `sources/gmail.py`, `execution.py`, `sources/bridge.py`, tools bridge + Gmail, Tool Bridges dinámico.

### Composio bridge fix
- Root cause: scripts bash temporales escritos con CRLF desde Windows → `composio whoami\r` inválido.
- Fix: `wsl.exe -d Ubuntu -- bash -lc` para comandos simples; stdin binario UTF-8 para scripts con JSON.

### Tests
- 21 tests passing (`pnpm test:plugin`): +10 desde inicio de sesión (CRUD API + execution/bridge).

## Decisions

- Post-approve Gmail solo en modo `composio` o `hybrid` (no en `local-demo`).
- `mutations.py` separado de `business_rules.py` para mantener archivos <200 líneas.
- DataSource ABC (plan 5.7) deferido — JSON local + `sources/` directo es suficiente para demo.
- Demo `act_001` enriquecido con `actionType: send_email` y payload Gmail para narrativa de demo.

## Files changed

- `plugin/hbo-plugin/mutations.py`, `execution.py` — nuevos
- `plugin/hbo-plugin/sources/gmail.py`, `sources/bridge.py` — nuevos
- `plugin/hbo-plugin/sources/composio_client.py` — fix WSL/CRLF
- `plugin/hbo-plugin/state.py`, `business_rules.py`, `schemas.py`, `tools.py`, `workflows.py`, `plugin.yaml`
- `plugin/hbo-plugin/dashboard/plugin_api.py`, `dist/index.js`, rutas TS (Actions, Leads, Signals, Workflows, Setup, ToolBridges), `hooks.ts`, `index.tsx`
- `plugin/hbo-plugin/data/business-ops-demo-original/actions.json`, `leads.json`
- `tests/hbo_plugin/conftest.py`, `test_plugin_api.py`, `test_execution.py` — nuevo
- `docs/IMPROVEMENT_PLAN.md`, `docs/PROJECT_STATUS.md`, `docs/ROADMAP.md`, `AGENTS.md`

## Open / next

- Oleada 5: profile cron/skills, `test_workflows.py`, GitHub Actions CI.
- Oleada 6: demo script, screenshots, video, publicar GitHub Pages.
- Overview redesign (charts) — plan Priority 8.
- Re-link Composio: WhatsApp, Google Meet.
- Fix teléfonos en import Sheets (`#ERROR!` en celdas con `+`).
- Priority 4: conversaciones inline, outreach preview.

## Notes

- Sync: `pnpm build:dashboard` + `scripts/sync-plugin.sh` + restart Hermes tras cada cambio.
- Tool Bridges debe mostrar `connected` + email tras el fix CRLF.
