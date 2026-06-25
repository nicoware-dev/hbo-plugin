---
type: session
title: Improvement plan implementation and Leads dashboard fix
date: 2026-06-25
time: "28:30"
session_id: 2026-06-25-2830
topics: [improvement-plan, dashboard, leads-bug, skills, tests]
workspace_paths: [plugin/hbo-plugin, profiles, docs, apps/docs, tests]
status: closed
related: []
---

# Improvement plan implementation and Leads dashboard fix

## Summary

Executed the pending improvement plan in five waves: score validation, conversations API and review UI, cron copy commands, 14 bundled skills, expanded tests (61), and docs/demo polish. User then reported a black Leads page — root cause was `String(...).filter(Boolean)` crashing React; fixed filters, form styling, and Overview “Review queue” button.

## Done

### Improvement plan (waves 0–5)
- `schemas.parse_score()` (0–100) in mutations and Sheets import; `test_mutations.py`
- `GET /conversations` API, enriched demo `conversations.json`, `ConversationReviewPanel` on Workflows
- Setup **Copy enable command** per cron in `automations.py` + `Setup.tsx`; DEMO_SCRIPT step 6b
- `test_workflows.py`, `test_state.py`; 61 plugin tests passing
- `profiles/_template/`; Preferred workflows in three SOUL files; Composio operator checklist in docs
- Seven extensibility skills registered (`demo-tour`, `health-check`, `export-report`, `connect-source`, `search-leads`, `create-agent`, `customize`)
- IMPROVEMENT_PLAN.md synced; HyperFrames lint fixes for pitch video; NemoClaw smoke test documented as blocked (no Docker)

### Leads black screen fix
- Replaced broken `String(l.segment).filter(Boolean)` with `uniqueValues()` helper
- Segment/agent filter dropdowns always visible when data exists
- Theme-safe inputs (`bg-background`, `border-input`); table header/hover styles
- Overview “Review queue” → outline `sm` button instead of cramped link variant

## Decisions

- HubSpot / proactive Gmail remain deferred per user scope choice
- NemoClaw Docker verify blocked on environment; documented in `deploy/nemoclaw/README.md`

## Files changed

- `plugin/hbo-plugin/` — schemas, mutations, sheets, state, automations, `__init__.py`, skills (7 new), dashboard routes/components/dist, demo conversations
- `profiles/` — `_template/`, SOUL preferred workflows
- `tests/hbo_plugin/` — test_mutations, test_state, test_workflows, test_plugin_api
- `docs/` — IMPROVEMENT_PLAN.md, DEMO_SCRIPT.md
- `apps/docs/` — dashboard.md, skills.md, screenshots
- `README.md`, `deploy/nemoclaw/README.md`

## Open / next

- Sync rebuilt plugin to `~/.hermes/plugins/hbo-plugin` and restart Hermes dashboard after deploy
- Render remaining HyperFrames pitch scenes (`videos/hbo-pitch/`)
- NemoClaw Docker build when Docker Desktop + real NemoHermes base image available
- Optional: fresh dashboard screenshots after Leads fix for docs

## Notes

- Leads crash reproduced as full black tab — classic uncaught render error, not CSS theme issue
- `pnpm build:dashboard` and `pnpm test:plugin` green at session end
