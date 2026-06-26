# AGENTS.md — HBO Plugin

Guidance for AI agents working in this repository.

## What this project is

HBO Plugin extends [Hermes Agent](https://hermes-agent.nousresearch.com/) with business operations capabilities: plugin tools, a dashboard tab, profile distributions, bundled skills, and demo data.

**Do not** build a standalone SaaS app. Everything ships as Hermes-native packages.

## Repository map

| Path | Purpose |
|------|---------|
| `plugin/hbo-plugin/` | Core Hermes plugin (Python tools, state, skills, dashboard) |
| `plugin/hbo-plugin/dashboard/` | Dashboard extension (Vite → IIFE bundle) |
| `profiles/*/` | Hermes profile distributions |
| `apps/docs/` | Public Docusaurus site |
| `docs/` | Contributor-facing architecture docs |
| `examples/` | Sample exports for the Business Ops Demo |

## MVP scope

- **Demo:** Business Ops Demo with local JSON state (no external credentials required)
- **Bridge:** `composio` skill only (optional; not required for first run)
- **Profiles:** Sales Ops Agent, Growth Agent, Ops Lead Agent
- **Dashboard:** One `Business Ops` tab with internal pages (Overview, Agents, Workflows, Leads, Actions, Signals, Business, Audit, Tool Bridges, Setup)
- **Tools:** 18 `hbo_*` tools (includes `hbo_execute_action`, `hbo_get_business_context`)
- **Approvals:** Approve/reject mutates state; execute is a separate step for external effects

## Hermes conventions

### Plugin

- Manifest: `plugin/hbo-plugin/plugin.yaml`
- Entry: `register(ctx)` in `__init__.py`
- Tools prefixed with `hbo_` (18 tools — e.g. `hbo_get_workspace`, `hbo_execute_action`)
- Skills registered via `ctx.register_skill(name, path)` — namespaced as `hbo-plugin:skill`

### Dashboard extension

- Manifest: `plugin/hbo-plugin/dashboard/manifest.json`
- UI bundle: `dashboard/dist/index.js` (IIFE, React from `window.__HERMES_PLUGIN_SDK__`)
- Backend: `dashboard/plugin_api.py` (FastAPI router at `/api/plugins/hbo-plugin/`)

### Profiles

- Each profile directory has `distribution.yaml` at its root
- Install: `hermes profile install <path-or-git-url>`

## Build commands

```bash
pnpm install
pnpm build:dashboard   # plugin/hbo-plugin/dashboard → dist/
pnpm build:docs        # apps/docs → static site
```

## Coding guidelines

- Keep files under ~200 lines; split when larger
- Prefer file-backed JSON state for MVP (`plugin/hbo-plugin/data/business-ops-demo/`)
- Do not add WithOne, n8n, or other bridge implementations in MVP
- Match existing naming: `business-ops-demo`, `hbo-plugin`, kebab-case skills

## Key docs

- `docs/PROJECT_STATUS.md` — what is built, phases, gaps
- `docs/HERMES_ALIGNMENT.md` — alignment with Hermes Agent conventions
- `docs/TECHNICAL_SPEC.md` — implementation source of truth
- `docs/PRODUCT_OVERVIEW_PRD.md` — product context
- `docs/COMPOSIO_CLI_INSTALL.md` — Composio CLI install (Windows: `scripts/setup-composio-windows.ps1`)

## Hermes install note

Install the plugin to `~/.hermes/plugins/hbo-plugin` and run `scripts/install-hbo.sh` so dashboard API routes load (bundled symlink). Run `hermes plugins enable hbo-plugin`. See `docs/HERMES_ALIGNMENT.md`.
