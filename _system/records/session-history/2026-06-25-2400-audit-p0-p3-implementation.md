---
type: session
title: Audit P0–P3 implementation
date: 2026-06-25
time: "24:00"
session_id: 2026-06-25-2400
topics: [audit, approve-execute, composio, ci, profiles, dashboard]
workspace_paths: [plugin/hbo-plugin, profiles, docs, apps/docs, scripts, .github]
status: closed
related: [2026-06-25-2330-docs-production-integrations.md]
---

# Audit P0–P3 implementation

## Summary

Implemented the audit improvement plan (P0–P3): separated approve from execute, hardened Composio CLI quoting, added CI and demo-reset scripts, enriched profile SOULs, added the sixth cron blueprint, and polished Actions/Overview dashboard UX. Docs normalized to 18 tools / 7 skills; 38 tests pass locally.

## Done

### P0 — Repo hygiene
- Normalized tool/skill counts across AGENTS.md, PROJECT_STATUS, ROADMAP, public docs
- Created `docs/HERMES_ALIGNMENT.md` and `docs/DEMO_SCRIPT.md` (contributor); mirror `apps/docs/docs/demo-script.md`
- Added `.github/workflows/ci.yml` (build dashboard, docs, pytest)
- Sanitized private Composio account reference in IMPROVEMENT_PLAN

### P1 — Demo reliability
- `approve_action` no longer auto-executes; new `execute_action`, `hbo_execute_action`, `POST /actions/{id}/execute`
- `composio_client.run_argv()` for safe JSON payloads; gmail/sheets migrated
- `scripts/demo-reset.sh` and `scripts/demo-reset.ps1`

### P2 — Profiles
- Expanded SOUL.md for sales-ops, growth, ops-lead agents
- Added `weekly-prospect-batch` cron + automations catalog entry (6 total)

### P3 — Dashboard
- Actions: status filter, bridge warning, executable badge, Execute button, audit link
- Overview: last briefing card, pending-actions highlight

## Decisions

- Approve and Execute are separate steps (user confirmed during planning)
- P4 state migration, GitHub Pages, screenshots, video remain out of scope
- `docs/HERMES_ALIGNMENT.md` and `docs/DEMO_SCRIPT.md` un-ignored in `.gitignore` so contributor links resolve in git

## Files changed

- Plugin: `business_rules.py`, `tools.py`, `plugin.yaml`, `plugin_api.py`, `composio_client.py`, `gmail.py`, `sheets.py`, `state.py`, `automations.py`
- Dashboard: `Actions.tsx`, `Overview.tsx`, `dist/index.js`
- Profiles: three `SOUL.md`, `growth-agent/cron/weekly-prospect-batch.md`
- Docs: HERMES_ALIGNMENT, DEMO_SCRIPT, PROJECT_STATUS, ROADMAP, IMPROVEMENT_PLAN, apps/docs pages
- Tests: `test_execution.py`, `test_composio_quoting.py`, `test_plugin_api.py`
- Ops: `.github/workflows/ci.yml`, `scripts/demo-reset.*`, `.gitignore`

## Open / next

- Phase 6: GitHub Pages deploy, dashboard screenshots, demo video
- P4: migrate runtime state to `~/.hermes/hbo-plugin/state/`
- Push branch (4+ commits ahead of origin)

## Notes

- Core plugin/dashboard commits may already exist on `main` as `5a2daca` and `5d4e0b8` before this session save
