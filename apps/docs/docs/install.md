---
sidebar_position: 2
title: Install
---

# Installation

Two paths: **prompt-driven** (recommended) or **manual CLI**.

## Option A — Paste into Hermes (recommended)

Copy the full prompt from [Demo prompt](./demo-prompt) and paste it into a Hermes Agent session. Hermes will:

1. Read the repository README and docs
2. Install the plugin to `~/.hermes/plugins/hbo-plugin`
3. Install Sales Ops, Growth, and Ops Lead profiles
4. Load Business Ops Demo data
5. Open the dashboard and verify the Business Ops tab
6. Run the daily briefing workflow
7. Show the action queue and approve one action

This is the fastest way to see the full signal → approval loop.

## Option B — Manual install

### Prerequisites

- [Hermes Agent](https://hermes-agent.nousresearch.com/) installed
- Node 20+ (for building the dashboard bundle if needed)
- This repository cloned locally

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

### 4. Load demo data

In a Hermes session with the plugin enabled:

```text
Call hbo_load_demo_data to reset the Business Ops Demo workspace.
```

Or ask Hermes to load demo data as part of the install prompt.

### 5. Restart and open dashboard

Restart the Hermes dashboard process, then open the **Business Ops** tab.

Verify:

- **Overview** shows workspace summary
- **Agents** lists three profiles
- **Actions** shows pending proposals
- **Workflows** can run `daily_ops_briefing`

### 6. Run first workflow

```text
Run hbo_run_workflow with workflow daily_ops_briefing, then list pending actions.
```

Approve one action via chat or the dashboard **Actions** page. Check **Audit** for the event.

## Optional — enable Composio bridge

See [Composio CLI](./composio-cli). The demo works fully without external credentials.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Business Ops tab missing | `hermes plugins enable hbo-plugin`, restart dashboard |
| API routes 404 | Plugin must be in `~/.hermes/plugins/hbo-plugin` with `dashboard/dist/` built |
| Empty state | Run `hbo_load_demo_data` |
| Profiles not found | Re-run `hermes profile install` from repo `profiles/` paths |

## Next steps

- [How it works](./how-it-works) — understand signals and approvals
- [Dashboard](./dashboard) — explore all UI pages
- [Plugin](./plugin) — full tool reference
