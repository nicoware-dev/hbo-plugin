# HBO Plugin — Project Status

**Repository:** [nicoware-dev/hbo-plugin](https://github.com/nicoware-dev/hbo-plugin)  
**Last updated:** 2026-06-25  
**Phase:** Phases 1–5 complete; oleadas 0–4 + cron/sponsor/P8/P10 done; Phase 6 next  

This document records what was built, how it maps to the PRD/technical spec, and what remains.

---

## What exists today

### Monorepo tooling

| Item | Location | Status |
|------|----------|--------|
| pnpm workspaces | `package.json`, `pnpm-workspace.yaml` | Done |
| Root scripts | `pnpm build`, `dev:docs`, `dev:dashboard` | Done |
| License | MIT (`LICENSE`) | Done |
| Agent guidance | `AGENTS.md` | Done |

### Hermes plugin (`plugin/hbo-plugin/`)

| Item | Status | Notes |
|------|--------|-------|
| `plugin.yaml` | Done | 16 `hbo_*` tools listed |
| `__init__.py` | Done | Registers tools + 5 skills |
| `tools.py` / `schemas.py` | Done | Tool handlers return JSON strings |
| `state.py` / `mutations.py` | Done | File-backed JSON + CRUD mutations |
| `business_rules.py` / `execution.py` | Done | Workflows, approve/reject, post-approve Gmail |
| `sources/` | Done | `composio_client`, `sheets`, `gmail`, `bridge` |
| Demo data (8 JSON files) | Done | Leads, actions, audit, signals, etc. |
| Bundled skills (5) | Done | `sales-ops`, `growth-ops`, `ops-lead`, `local-demo`, `composio` |

### Dashboard extension (`plugin/hbo-plugin/dashboard/`)

| Item | Status | Notes |
|------|--------|-------|
| `manifest.json` | Done | Tab `Business Ops` at `/business-ops` |
| `plugin_api.py` | Done | CRUD + bridge routes; Hermes importlib-safe |
| Vite IIFE bundle | Done | `dist/index.js` + `dist/style.css` |
| 10 internal pages | **Functional** | Overview (charts), …, **Business**, … |

### Profile distributions (`profiles/`)

| Profile | Status |
|---------|--------|
| `sales-ops-agent/` | Done — `distribution.yaml`, `SOUL.md`, `config.yaml`, README |
| `growth-agent/` | Done |
| `ops-lead-agent/` | Done |

### Documentation

| Surface | Location | Status |
|---------|----------|--------|
| Public site (Docusaurus) | `apps/docs/` | Done — 11 MVP pages |
| Contributor docs | `docs/` | PRD, spec, improvement plan, status |
| Alignment review | `docs/HERMES_ALIGNMENT.md` | Done |
| This status doc | `docs/PROJECT_STATUS.md` | Done |

### Examples

| Item | Location |
|------|----------|
| Sample CSV/JSON exports | `examples/business-ops-demo/` |

---

## Build commands

```bash
pnpm install
pnpm build              # dashboard + docs
pnpm dev:docs           # http://localhost:3000
pnpm dev:dashboard      # watch rebuild of dashboard IIFE
pnpm test:plugin        # 28 pytest tests
```

---

## Install checklist (Hermes)

1. Copy plugin to `~/.hermes/plugins/hbo-plugin` (not `.hermes/plugins/` for API routes — see alignment doc)
2. `hermes plugins enable hbo-plugin`
3. `hermes profile install ./profiles/sales-ops-agent --alias sales-ops` (repeat for growth, ops-lead)
4. Restart Hermes; open dashboard → **Business Ops** tab
5. Call `hbo_load_demo_data` or use Setup → Reset demo

---

## MVP phases (from technical spec)

| Phase | Deliverables | Status |
|-------|--------------|--------|
| 1 — Repo + docs skeleton | Structure, README, Docusaurus, demo prompt | **Done** |
| 2 — Plugin skeleton | plugin.yaml, tools, demo data | **Done** |
| 3 — Dashboard extension | Tab, pages, API routes | **Done** — full CRUD UI |
| 4 — Profiles + skills | 3 distributions, 5 skills | **Done** |
| 5 — Workflows + approval + audit | Full workflow outputs, tests, API fix | **Done** |
| 6 — Demo polish | Script, screenshots, video flow | **Not started** |

---

## Known gaps (before demo-ready)

1. ~~Workflows produce rich demo outputs~~ — done in Phase 5
2. ~~Dashboard reload after approve~~ — feedback + audit summary shown
3. ~~Automated tests~~ — **21 tests** passing (`pnpm test:plugin`)
4. Profile `skills/` and `cron/` directories are empty placeholders
5. ~~Composio bridge~~ — Sheets import + Gmail post-approve + Tool Bridges status live
6. GitHub Pages URL assumes `baseUrl: /hbo-plugin/` — configure when publishing
7. **Manual:** sync plugin via `scripts/sync-plugin.sh` and restart Hermes dashboard
8. ~~Composio WSL on Windows~~ — fixed CRLF bug in `composio_client.py`
9. WhatsApp and Google Meet Composio connections expired — need re-link
10. ~~Dashboard API verified~~ — user confirmed working in Hermes
11. Overview page lacks charts / funnel visualization (IMPROVEMENT_PLAN Priority 8)
12. Phone numbers empty on Sheets import when cells show `#ERROR!`

## Troubleshooting dashboard

### Blank screen on Business Ops tab

**Cause:** Using Radix `Tabs` without `TabsContent` crashes React (SDK only exposes `Tabs`, `TabsList`, `TabsTrigger`).

**Fix:** Use button-based nav (fixed in `dashboard/src/index.tsx`). Rebuild and hard-refresh:

```bash
pnpm build:dashboard
# copy plugin/hbo-plugin to ~/.hermes/plugins/hbo-plugin
# then hard-refresh browser (Ctrl+Shift+R) or restart dashboard
```

### Cards show "—" / API 404

**Cause:** `plugin_api.py` routes mount only at dashboard **startup**.

**Fix:** Restart the Hermes dashboard after installing or updating the plugin:

```bash
# stop and start hermes dashboard / gateway
```

Install path on Windows: `%LOCALAPPDATA%\hermes\plugins\hbo-plugin\`

### Tool Bridges shows Composio error (Windows)

**Cause:** Bash scripts written with CRLF from Windows subprocess.

**Fix:** Applied in `sources/composio_client.py` — uses `wsl.exe -d Ubuntu -- bash -lc` for simple commands.

---

## Reference material

- Product PRD: `docs/PRODUCT_OVERVIEW_PRD.md`
- Technical spec: `docs/TECHNICAL_SPEC.md`
- Hermes alignment: `docs/HERMES_ALIGNMENT.md`
- Improvement plan: `docs/IMPROVEMENT_PLAN.md`
- Session history: `_system/records/session-history/`
- Local Hermes source (for review): `_temp/hermes-agent-main/`

---

## Files changed in scaffold session

See git status for the full tree. Core additions:

```text
plugin/hbo-plugin/          # Hermes plugin package
profiles/                   # 3 agent distributions
apps/docs/                  # Docusaurus site
docs/                       # Contributor + status docs
examples/business-ops-demo/
package.json, pnpm-workspace.yaml, README.md, AGENTS.md, LICENSE
```
