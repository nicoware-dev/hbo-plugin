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
| **Overview** | Stat cards + bar charts (funnel, segments, scores, audit timeline) | At-a-glance business health |
| **Agents** | Sales Ops, Growth, Ops Lead profile cards | Agent focus areas |
| **Workflows** | Built-in workflows + output panels | Run workflows; outbound shows **outreach previews** |
| **Leads** | Leads table + import from Sheets | CRUD, edit, Google Sheets import |
| **Actions** | Pending action queue | Approve / Reject; outreach preview before approve |
| **Signals** | Open signals | Create, resolve |
| **Business** | Business context form | Name, products, tone — agents load via `hbo_get_business_context` |
| **Audit** | Chronological decision log | Traceability |
| **Tool Bridges** | Bridge mode + Composio status | Toggle local-demo / composio / hybrid |
| **Setup** | Install checklist, **reset demo**, recommended crons | Restore bundled demo data |

## Overview charts

After install, run **Setup → Reset demo data** to load 12 sample leads and audit history. Charts use the same Card styling as the rest of the Hermes dashboard.

Metrics include:

- Lead funnel by status
- Leads by segment
- Score distribution
- Priority breakdown
- Audit activity (last 7 days)
- Pending actions per agent

## Approvals in the UI

The **Actions** page is the operator control surface:

1. Lists actions with `status: pending`
2. Outreach actions show an expandable **message preview**
3. Approve or reject updates workspace state via plugin API
4. Audit page shows the resulting event

Same mutations via `hbo_approve_action` / `hbo_reject_action` in Hermes chat.

## API routes

Backend: `dashboard/plugin_api.py`

| Route | Returns |
|-------|---------|
| `GET /workspace` | Workspace summary |
| `GET /stats` | Chart aggregations |
| `GET /business-context` | Business context JSON |
| `POST /business-context` | Save business context |
| `GET /automations` | Recommended cron catalog |
| `GET /agents` | Agent list |
| `GET /leads` | Leads |
| `POST /leads` | Create lead |
| `POST /leads/import/sheets` | Import from Google Sheets |
| `GET /signals` | Open signals |
| `GET /actions` | Action proposals |
| `POST /actions/{id}/approve` | Approve action |
| `POST /actions/{id}/reject` | Reject action |
| `POST /demo/reset` | Reset demo data |
| `GET /bridge/status` | Composio bridge status |

CLI tool `hbo_sync_sales_sources` mirrors the sales-source-sync cron (import + audit).

## Requirements

1. Plugin installed to `~/.hermes/plugins/hbo-plugin`
2. `dashboard/dist/` built and present
3. Hermes dashboard **restarted** after plugin install or update

:::tip
If API routes return 404, confirm the plugin path and restart the dashboard process. If charts are empty, use **Setup → Reset demo data**.
:::

## Related

- [Install](./install) — setup and troubleshooting
- [Sponsor Integrations](./sponsor-integrations) — optional NVIDIA / Stripe
- [How it works](./how-it-works) — approval loop detail
