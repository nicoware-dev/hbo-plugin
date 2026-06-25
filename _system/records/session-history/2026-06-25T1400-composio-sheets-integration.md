---
title: "Composio Integration & Google Sheets Import"
date: 2026-06-25
session: 2026-06-25T1400
---

# Composio Integration & Google Sheets Import

## Summary

Installed HBO Plugin, fixed profile configs, audited project, tested Composio CLI, implemented Google Sheets lead import with multi-platform support.

## Done

- **Plugin installation**: Copied to `%LOCALAPPDATA%\hermes\plugins/hbo-plugin/`, enabled, installed 3 profiles
- **Profile config fix**: Added `model`, `provider`, `plugins.enabled` to each profile's `config.yaml`
- **Bug fixes**: `load_demo_data()` now resets from `business-ops-demo-original/`; dashboard uses `refetch()` instead of `window.location.reload()`
- **Full audit**: 11/11 tests passing, all 7 Python files synced, 9+9 JSON data files intact
- **Composio CLI verified**: v0.2.31 in WSL, 12 active connections (Gmail, Sheets, Drive, Calendar, HubSpot, LinkedIn)
- **Google Sheet created**: [HBO Plugin — Sample Leads](https://docs.google.com/spreadsheets/d/1fXOFKrbU7w9b8TbXfhZsNYnyxg0jOKlaMQ-g3z5OA1g) with 15 sample leads
- **Google Sheets import**: New `sources/sheets.py` + `sources/composio_client.py` — imports 15 leads from Sheets to HBO state
- **Multi-platform wrapper**: `composio_client.py` detects Windows-WSL, macOS, Linux; runs Composio CLI appropriately
- **New tool**: `hbo_import_leads_from_sheets` (13th tool registered)
- **New state functions**: `append_lead()`, `update_lead()` in `state.py`
- **Documentation**: Created `docs/SESSION_LOG_2026-06-25.md`, updated `docs/PROJECT_STATUS.md`, created `docs/IMPROVEMENT_PLAN.md`
- **Sync scripts**: `scripts/sync-plugin.sh` + `.cmd` for future development

## Open / Next

- Implement dashboard data entry forms (create leads, actions, signals)
- Fix approve/reject feedback in dashboard UI
- Add Signals page to dashboard
- Gmail follow-up emails after approval
- Re-link expired Composio connections (WhatsApp, Google Meet)
- Migrate to Composio Python SDK (medium term)
- Add tests for `workflows.py`, `state.py`, `tools.py`

## Decisions

- Copy (not symlink) for plugin install — Hermes loads at startup, Windows symlinks unreliable
- WSL temp script approach for Composio CLI on Windows — avoids shell-quoting issues
- `business-ops-demo-original/` as canonical backup for reset
- Google Sheets as first real-data integration (already connected, structured data)

## Files Changed

- `plugin/hbo-plugin/sources/composio_client.py` — NEW: multi-platform Composio wrapper
- `plugin/hbo-plugin/sources/sheets.py` — NEW: Google Sheets lead importer
- `plugin/hbo-plugin/sources/__init__.py` — NEW: package init
- `plugin/hbo-plugin/state.py` — added `append_lead()`, `update_lead()`
- `plugin/hbo-plugin/tools.py` — added `hbo_import_leads_from_sheets` tool
- `plugin/hbo-plugin/plugin.yaml` — declared new tool
- `profiles/*/config.yaml` — added model, provider, plugins.enabled
- `docs/IMPROVEMENT_PLAN.md` — NEW: 7-priority improvement roadmap
- `docs/SESSION_LOG_2026-06-25.md` — NEW: this session log
- `docs/PROJECT_STATUS.md` — updated
- `scripts/sync-plugin.sh` / `.cmd` — NEW: sync helpers
