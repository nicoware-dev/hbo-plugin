---
type: session
title: "HBO Plugin scaffold and dashboard blank-screen fix"
date: 2026-06-25
time: "17:30"
session_id: 2026-06-25-1730
topics: [hbo-plugin, monorepo, hermes-plugin, dashboard, alignment]
workspace_paths: [plugin/hbo-plugin, profiles, apps/docs, docs]
status: closed
related: []
---

# HBO Plugin scaffold and dashboard blank-screen fix

## Summary

Scaffolded the full `hbo-plugin` monorepo from PRD/technical spec, aligned implementation with Hermes Agent source (`_temp/hermes-agent-main`), and fixed a blank Business Ops dashboard tab caused by invalid `Tabs` usage without `TabsContent` in the Hermes plugin SDK. Session ended with save + public-only smart-commit plan.

## Done

- Monorepo: pnpm workspaces, plugin, profiles, examples, Docusaurus (`apps/docs`)
- Hermes plugin: 12 tools, JSON demo state, 5 skills, `plugin_api.py` (importlib-safe imports)
- Dashboard: button-based nav (replaced crashing Tabs), IIFE bundle in `dist/`
- Profile distributions: sales-ops, growth, ops-lead with valid `config.yaml`
- Alignment fixes: `register_skill` → SKILL.md path; profile `platform_toolsets`; org `nicoware-dev`
- Located user install: `%LOCALAPPDATA%\hermes\plugins\hbo-plugin\`
- Public roadmap: `docs/ROADMAP.md`

## Decisions

- MIT license; GitHub org `nicoware-dev`
- Commit only public artifacts (no `_system/`, `_local/`, contributor/dev docs, `AGENTS.md`)
- Ship `plugin/hbo-plugin/dashboard/dist/` in repo (`!plugin/.../dist/` in `.gitignore`)
- Dashboard nav: buttons, not Radix Tabs (SDK lacks `TabsContent`)

## Files changed

- `plugin/hbo-plugin/**` — plugin, dashboard, data, skills
- `profiles/**` — three distributions
- `apps/docs/**` — Docusaurus site
- `examples/business-ops-demo/**`
- Root: `package.json`, `pnpm-workspace.yaml`, `README.md`, `LICENSE`, `.gitignore`
- `docs/ROADMAP.md`, `docs/diagrams/**`
- Internal (not committed): `_system/records/session-history/`

## Open / next

- Restart Hermes dashboard so API routes mount (cards show "—" until then)
- Phase 5: workflow outputs, dashboard refetch, plugin_api tests
- Phase 6: demo video, GitHub Pages publish
- User to verify Business Ops tab after hard refresh post-restart

## Notes

- API 404 before dashboard restart: `/api/plugins/hbo-plugin/workspace`
- Plugin also copied under profile `plugins/` folders in AppData
