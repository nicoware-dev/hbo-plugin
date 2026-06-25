---
sidebar_position: 2
title: Install
---

# Installation

Two paths: **prompt-driven** (recommended) or **manual CLI**.

**Repository:** [github.com/nicoware-dev/hbo-plugin](https://github.com/nicoware-dev/hbo-plugin)

## Option A — Paste into Hermes (recommended)

The fastest way to install and verify HBO Plugin. Copy the prompt below and paste it into **Hermes Agent**.

Hermes will read the docs, install the plugin and profiles, open the dashboard, run a workflow, and walk through the approval loop.

### Prompt

```text
Install HBO Plugin from https://github.com/nicoware-dev/hbo-plugin

Please:
1. read the README and docs,
2. install the Hermes plugin,
3. install the Sales Ops, Growth, and Ops Lead profile distributions,
4. open the Hermes dashboard,
5. verify the Business Ops tab,
6. run the daily briefing workflow,
7. show the action queue,
8. approve one action,
9. explain approve vs execute (execute only for external effects in composio mode),
10. open Business tab and confirm business context is loaded,
11. reset demo: ./scripts/demo-reset.sh or Setup → Reset demo.
```

### What each step does

| Step | Outcome |
|------|---------|
| 1 | Hermes understands plugin layout and install paths |
| 2 | Plugin tools and dashboard extension enabled |
| 3 | Three specialized agent profiles ready |
| 4–5 | Business Ops tab with Overview charts, Actions, Business context |
| 6 | Ops Lead briefing with priorities and risks |
| 7 | Pending action proposals in the queue |
| 8 | Approval mutates state; execute is separate for external effects |
| 9 | Path to Composio bridge (optional) |
| 10–11 | Business context + reset demo for full dashboard data |

### Demo reset script

```bash
./scripts/demo-reset.sh
```

Windows: `.\scripts\demo-reset.ps1`

Then open **Business Ops** in the Hermes dashboard — see [Dashboard](./dashboard) for a page-by-page walkthrough.

## Option B — Manual install

### Prerequisites

- [Hermes Agent](https://hermes-agent.nousresearch.com/) installed
- Node 20+ (for building the dashboard bundle if needed)
- [This repository](https://github.com/nicoware-dev/hbo-plugin) cloned locally

### 1. Build dashboard bundle (if not pre-built)

```bash
pnpm install
pnpm build:dashboard
```

The release artifact must include `plugin/hbo-plugin/dashboard/dist/`.

### 2. Install the Hermes plugin

```bash
cp -r plugin/hbo-plugin ~/.hermes/plugins/hbo-plugin
hermes plugins enable hbo-plugin
```

On Windows, use `%LOCALAPPDATA%\hermes\plugins\hbo-plugin`.

:::important
Install to `~/.hermes/plugins/` (not only `.hermes/plugins/` in a project folder) so dashboard API routes load correctly.
:::

### 3. Install profile distributions

```bash
hermes profile install ./profiles/sales-ops-agent --alias sales-ops
hermes profile install ./profiles/growth-agent --alias growth
hermes profile install ./profiles/ops-lead-agent --alias ops-lead
```

Each profile includes `distribution.yaml`, `SOUL.md`, `config.yaml`, and references bundled HBO skills.

### 4. Restart and open dashboard

Restart the Hermes dashboard process, then open the **Business Ops** tab.

Verify:

- **Overview** — stat cards + funnel/segment/score charts (use **Setup → Restore sample data** if the workspace looks empty)
- **Business** — edit business context agents load via `hbo_get_business_context`
- **Agents** lists three profiles
- **Actions** shows pending proposals (outreach actions include message preview)
- **Workflows** can run `daily_ops_briefing` or `outbound_growth` for outreach previews

### 5. Run first workflow

```text
Run hbo_run_workflow with workflow daily_ops_briefing, then list pending actions.
```

Approve one action via chat or the dashboard **Actions** page. Check **Audit** for the event.

## Integrations

HBO Plugin runs on **local workspace state** without external credentials. To connect Gmail, Slack, CRM, and other services, see [Integrations](./integrations) — Composio, NVIDIA NemoClaw, and Stripe Link CLI.

For scheduled import, use `hbo_sync_sales_sources` (matches the **sales-source-sync** cron blueprint).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Business Ops tab missing | `hermes plugins enable hbo-plugin`, restart dashboard |
| API routes 404 | Plugin must be in `~/.hermes/plugins/hbo-plugin` with `dashboard/dist/` built |
| Empty workspace | Run a workflow (`daily_ops_briefing`) or check plugin enablement |
| Profiles not found | Re-run `hermes profile install` from repo `profiles/` paths |

## Next steps

- [How it works](./how-it-works) — understand signals and approvals
- [Dashboard](./dashboard) — explore all UI pages
- [Plugin](./plugin) — full tool reference

## Source

The install prompt lives on this page — copy the block under [Prompt](#prompt) above.
