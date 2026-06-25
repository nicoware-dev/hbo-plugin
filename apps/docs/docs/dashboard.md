---
sidebar_position: 8
title: Dashboard
---

# Business Ops Dashboard

A Hermes dashboard extension: React UI (IIFE bundle) + FastAPI routes at `/api/plugins/hbo-plugin/`.

Manifest: `plugin/hbo-plugin/dashboard/manifest.json`  
Bundle: `dashboard/dist/index.js` (build with `pnpm build:dashboard`)

## Pages

| Page | What you see | Key actions |
|------|--------------|-------------|
| **Overview** | Workspace summary cards — leads, signals, pending actions | Quick status at a glance |
| **Agents** | Sales Ops, Growth, Ops Lead profile cards | Agent focus areas and activity |
| **Workflows** | Built-in workflows | Run inbound sales, outbound growth, daily briefing |
| **Leads** | Leads table | Scores, segments, status, recommended actions |
| **Actions** | Pending action queue | **Approve** / **Reject** — mutates state + audit |
| **Audit** | Chronological decision log | Traceability for approvals |
| **Tool Bridges** | Local workspace + Composio CLI | Path to external app integration |
| **Setup** | Installation checklist | Verify plugin and profiles |

## Approvals in the UI

The **Actions** page is the operator control surface for the approval loop:

1. Lists actions with `status: pending`
2. Approve or reject updates workspace state via plugin API
3. Audit page shows the resulting event

Same mutations are available via `hbo_approve_action` / `hbo_reject_action` in Hermes chat.

## API routes

Backend: `dashboard/plugin_api.py`

| Route | Returns |
|-------|---------|
| `GET /workspace` | Workspace summary |
| `GET /agents` | Agent list |
| `GET /leads` | Leads |
| `GET /signals` | Open signals |
| `GET /actions` | Action proposals |
| `POST /actions/{id}/approve` | Approve action |
| `POST /actions/{id}/reject` | Reject action |
| `GET /audit` | Audit log |

## Requirements

1. Plugin installed to `~/.hermes/plugins/hbo-plugin`
2. `dashboard/dist/` built and present
3. Hermes dashboard **restarted** after plugin install or update

:::tip
If API routes return 404, confirm the plugin path and restart the dashboard process.
:::

## Tech stack

- **UI:** React, Vite IIFE bundle, Hermes plugin SDK (`window.__HERMES_PLUGIN_SDK__`)
- **API:** FastAPI router mounted by Hermes plugin loader
- **State:** Shared with plugin tools via `state.py`

## Related

- [Install](./install) — setup and troubleshooting
- [How it works](./how-it-works) — approval loop detail
