---
sidebar_position: 2
title: Install
---

# Installation

Two paths: **prompt-driven** (recommended) or **manual CLI**.

**Repository:** [github.com/nicoware-dev/hbo-plugin](https://github.com/nicoware-dev/hbo-plugin)

## Option A — Paste into Hermes (recommended)

Copy the prompt below and paste it into **Hermes Agent**.

### Prompt

```text
Install HBO Plugin from https://github.com/nicoware-dev/hbo-plugin

Please:
1. clone the repo and run ./scripts/install-hbo.sh --with-demo
2. restart dashboard: hermes dashboard --stop && hermes dashboard --no-open
3. run ./scripts/verify-hbo.sh
4. load skill hbo-plugin:plugin-manager for any install fixes
5. open the Hermes dashboard and verify Business Ops tab + Overview charts
6. hand off to local-demo and demo-tour skills
7. run daily_ops_briefing workflow and show the action queue
8. approve one action and explain approve vs execute
9. open Business tab and confirm business context
```

### What each step does

| Step | Outcome |
|------|---------|
| 1 | Plugin + bundled symlink + profiles + demo data |
| 2–3 | Dashboard API routes reload; health check passes |
| 4 | Infra troubleshooting skill available post-install |
| 5–6 | Product onboarding with charts and guided tour |
| 7–9 | Workflow, approval loop, business context |

## Option B — Manual install

### Prerequisites

- [Hermes Agent](https://hermes-agent.nousresearch.com/) v0.17+
- Node 20+ (if building dashboard from source)
- [This repository](https://github.com/nicoware-dev/hbo-plugin) cloned locally

### One-command install

```bash
pnpm install   # if building dashboard
./scripts/install-hbo.sh --with-demo
hermes dashboard --stop && hermes dashboard --no-open
./scripts/verify-hbo.sh
```

Windows:

```powershell
.\scripts\install-hbo.ps1 -WithDemo
hermes dashboard --stop; hermes dashboard --no-open
.\scripts\verify-hbo.ps1
```

:::important
Hermes 0.17+ blocks dashboard Python backends for user plugins. `install-hbo.sh` creates the bundled symlink under `hermes-agent/plugins/hbo-plugin` so `/api/plugins/hbo-plugin/*` routes work.
:::

### Verify

```bash
curl http://127.0.0.1:9119/api/plugins/hbo-plugin/health
```

Open **Business Ops** → **Overview** for stat cards and charts. Use **Setup → Load demo data** if the workspace looks empty.

### Dev sync

After code changes:

```bash
./scripts/sync-plugin.sh
hermes dashboard --stop && hermes dashboard --no-open
```

## Integrations

HBO Plugin runs on **local workspace state** without external credentials. See [Integrations](./integrations) for Composio, NemoClaw, and Stripe Link CLI.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Business Ops tab missing | `hermes plugins enable hbo-plugin`, restart dashboard |
| API routes 404 | `./scripts/install-hbo.sh` (bundled symlink), restart dashboard |
| Empty workspace | `./scripts/install-hbo.sh --with-demo` or Setup → Load demo data |
| Profiles not found | Re-run `./scripts/install-hbo.sh` or profile install from `profiles/` |
| Agent install help | Load skill `hbo-plugin:plugin-manager` |

## Next steps

- [How it works](./how-it-works) — signals and approvals
- [Dashboard](./dashboard) — UI pages
- [Plugin](./plugin) — tool reference

## Source

Copy the block under [Prompt](#prompt) above.
