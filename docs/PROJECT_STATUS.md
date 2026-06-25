# HBO Plugin — Project Status

**Repository:** [nicoware-dev/hbo-plugin](https://github.com/nicoware-dev/hbo-plugin)  
**Last updated:** 2026-06-25  
**Phase:** Phases 1–5 complete; audit P0–P3 done; Phase 6 (screenshots/video/Vercel) next  

This document records what was built, how it maps to the PRD/technical spec, and what remains.

---

## What exists today

### Monorepo tooling

| Item | Location | Status |
|------|----------|--------|
| pnpm workspaces | `package.json`, `pnpm-workspace.yaml` | Done |
| Root scripts | `pnpm build`, `dev:docs`, `dev:dashboard`, `test:plugin` | Done |
| CI | `.github/workflows/ci.yml` | Done |
| License | MIT (`LICENSE`) | Done |
| Agent guidance | `AGENTS.md` | Done |

### Hermes plugin (`plugin/hbo-plugin/`)

| Item | Status | Notes |
|------|--------|-------|
| `plugin.yaml` | Done | 18 `hbo_*` tools listed |
| `__init__.py` | Done | Registers tools + 7 skills |
| `tools.py` / `schemas.py` | Done | Tool handlers return JSON strings |
| `state.py` / `mutations.py` | Done | File-backed JSON + CRUD mutations |
| `business_rules.py` / `execution.py` | Done | Workflows, approve/reject/execute |
| `sources/` | Done | `composio_client`, `sheets`, `gmail`, `bridge` |
| Demo data (8 JSON files) | Done | Leads, actions, audit, signals, etc. |
| Bundled skills (7) | Done | incl. `nvidia-nemoclaw-setup`, `stripe-link-cli` |

### Dashboard extension (`plugin/hbo-plugin/dashboard/`)

| Item | Status | Notes |
|------|--------|-------|
| `manifest.json` | Done | Tab `Business Ops` at `/business-ops` |
| `plugin_api.py` | Done | CRUD + bridge + execute routes |
| Vite IIFE bundle | Done | `dist/index.js` + `dist/style.css` |
| 10 internal pages | **Functional** | Overview (charts), Actions (filter/execute), … |

### Profile distributions (`profiles/`)

| Profile | Status |
|---------|--------|
| `sales-ops-agent/` | Done — SOUL, playbook skill, 2 crons |
| `growth-agent/` | Done — SOUL, playbook, 3 crons |
| `ops-lead-agent/` | Done — SOUL, playbook, 2 crons |

### Documentation

| Surface | Location | Status |
|---------|----------|--------|
| Public site (Docusaurus) | `apps/docs/` | Done |
| Contributor docs | `docs/` | PRD, spec, improvement plan, status |
| Hermes alignment | `docs/HERMES_ALIGNMENT.md` | Done |
| Demo script | `docs/DEMO_SCRIPT.md` | Done |
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
pnpm test:plugin        # pytest
```

---

## Install checklist (Hermes)

1. Copy plugin to `~/.hermes/plugins/hbo-plugin` (see alignment doc)
2. `hermes plugins enable hbo-plugin`
3. `hermes profile install ./profiles/sales-ops-agent --alias sales-ops` (repeat for growth, ops-lead)
4. Restart Hermes; open dashboard → **Business Ops** tab
5. Run `./scripts/demo-reset.sh` or Setup → Reset demo

---

## MVP phases (from technical spec)

| Phase | Deliverables | Status |
|-------|--------------|--------|
| 1 — Repo + docs skeleton | Structure, README, Docusaurus, demo prompt | **Done** |
| 2 — Plugin skeleton | plugin.yaml, tools, demo data | **Done** |
| 3 — Dashboard extension | Tab, pages, API routes | **Done** |
| 4 — Profiles + skills | 3 distributions, 7 skills | **Done** |
| 5 — Workflows + approval + audit | Full workflow outputs, tests | **Done** |
| 6 — Demo polish | Screenshots, video, Vercel docs | **Partial** — script + reset done |

---

## Known gaps (before public release)

1. Vercel docs deployment — verify `hbo-plugin-docs.vercel.app` after each docs change
2. Dashboard screenshots for docs site
3. Demo video not recorded
4. Runtime state still writes inside plugin package (future: `~/.hermes/hbo-plugin/state/`)
5. WhatsApp / Google Meet Composio connections may need re-link (optional)

## Troubleshooting dashboard

### Blank screen on Business Ops tab

**Cause:** Using Radix `Tabs` without `TabsContent` crashes React.

**Fix:** Button-based nav in `dashboard/src/index.tsx`. Rebuild and hard-refresh.

### Cards show "—" / API 404

**Cause:** `plugin_api.py` routes mount only at dashboard **startup**.

**Fix:** Restart Hermes dashboard after plugin install/update.

### Tool Bridges shows Composio error (Windows)

**Fix:** `composio_client.py` uses WSL with quoted argv for JSON payloads.

---

## Reference material

- Product PRD: `docs/PRODUCT_OVERVIEW_PRD.md`
- Technical spec: `docs/TECHNICAL_SPEC.md`
- Hermes alignment: `docs/HERMES_ALIGNMENT.md`
- Demo script: `docs/DEMO_SCRIPT.md`
- Improvement plan: `docs/IMPROVEMENT_PLAN.md`
