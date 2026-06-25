---
type: session
title: Follow-up audit P0–P4 hackathon readiness
date: 2026-06-25
time: "27:00"
session_id: 2026-06-25-2700
topics: [hackathon, demo-reset, docs, composio, ci]
workspace_paths: [plugin/hbo-plugin, apps/docs, scripts, tests]
status: closed
related: [2026-06-25-2400-audit-p0-p3-implementation.md]
---

# Follow-up audit P0–P4 hackathon readiness

## Summary

Implemented the follow-up improvement plan from `_local/hbo-plugin-followup-improvement-plan.md` to harden demo reliability, public docs, CI, and Composio safety before hackathon delivery. User will capture dashboard screenshots separately.

## Done

- Fixed README and install docs links → Vercel public docs (no broken `docs/INSTALLATION_PROMPT.md`)
- Added `scripts/demo_reset.py` with importlib loader; updated `demo-reset.sh` / `.ps1`
- CI: `setup-python@v5` + `pip install -r requirements-dev.txt`
- Replaced GitHub Pages references with Vercel in README, ROADMAP, PROJECT_STATUS
- Updated `how-it-works.md` for approve/reject/execute/audit model; Setup.tsx copy fix
- Added architecture diagrams to how-it-works and profiles pages
- Removed hardcoded Google Sheet ID; `demoSources` in `workspace.json`
- Leads page: spreadsheet ID form before Sheets import
- `search_spreadsheets` migrated to `run_argv`; sync skips when no sheet ID
- Tests: `test_demo_reset`, `test_tools`, sheets/sync argv coverage — **44 passing**
- Verified: `demo_reset.py`, `pnpm test:plugin`, `build:dashboard`, `build:docs`

## Decisions

- Public docs canonical surface = `apps/docs/` + Vercel; internal `docs/` stays local/contributor-only
- Screenshots deferred to user (Phase 6.4)
- Runtime state migration (`~/.hermes/hbo-plugin/state/`) remains post-hackathon (P5)

## Files changed

- `.github/workflows/ci.yml`
- `README.md`, `apps/docs/docs/*` (install, how-it-works, architecture, profiles, composio-cli)
- `docs/ROADMAP.md`, `docs/PROJECT_STATUS.md`
- `scripts/demo_reset.py`, `scripts/demo-reset.sh`, `scripts/demo-reset.ps1`, `scripts/sheets-fix-phones.json`
- `plugin/hbo-plugin/state.py`, `sources/sync.py`, `sources/sheets.py`, `sources/composio_client.py`
- `plugin/hbo-plugin/dashboard/src/routes/Leads.tsx`, `Setup.tsx`, `dist/index.js`
- `plugin/hbo-plugin/data/business-ops-demo*/workspace.json`
- `tests/hbo_plugin/test_demo_reset.py`, `test_tools.py`, `test_sheets.py`, `test_sync.py`

## Open / next

- User: dashboard screenshots → `apps/docs/static/img/`
- Record 3-minute demo video per `_local/demo-video-plan.md`
- Confirm Vercel deploy after push
- Post-hackathon: P5 runtime state dir, health-check skill

## Notes

- Plan source: `_local/hbo-plugin-followup-improvement-plan.md`
- Do not commit `videos/` untracked tree
