# Dashboard Extension

Location: `plugin/hbo-plugin/dashboard/`

## Manifest

`manifest.json` registers the **Business Ops** tab at `/business-ops`.

## UI

- Built with Vite → IIFE bundle (`dist/index.js`)
- Uses `window.__HERMES_PLUGIN_SDK__` (React + shadcn components from Hermes)
- Internal navigation via tabs (Overview, Agents, Workflows, Leads, Actions, Audit, Tool Bridges, Setup)

## Backend

`plugin_api.py` exposes FastAPI routes mounted at `/api/plugins/hbo-plugin/`.

Hermes loads this file via `importlib` as a standalone module — not as a package child. See `docs/HERMES_ALIGNMENT.md`.

| Route | Method | Purpose |
|-------|--------|---------|
| `/workspace` | GET | Workspace summary |
| `/agents` | GET | Agent list |
| `/leads` | GET | Demo leads |
| `/actions` | GET | Action proposals |
| `/actions/{id}/approve` | POST | Approve action |
| `/actions/{id}/reject` | POST | Reject action |
| `/audit` | GET | Audit events |
| `/workflows/{id}/run` | POST | Run workflow |

## Build

```bash
pnpm build:dashboard
```
