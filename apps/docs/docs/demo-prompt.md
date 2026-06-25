---
sidebar_position: 3
title: Demo Prompt
---

# Demo Prompt

The fastest way to install and verify HBO Plugin. Copy the prompt below and paste it into **Hermes Agent**.

Hermes will read the docs, install the plugin and profiles, load demo data, open the dashboard, run a workflow, and walk through the approval loop.

## Install prompt

```text
Install HBO Plugin from the hbo-plugin repository.

Please:
1. read the README and docs,
2. install the Hermes plugin,
3. install the Sales Ops, Growth, and Ops Lead profile distributions,
4. load the Business Ops Demo data,
5. open the Hermes dashboard,
6. verify the Business Ops tab,
7. run the daily briefing workflow,
8. show the action queue,
9. approve one action,
10. explain how to enable the composio-cli skill.
```

## What each step does

| Step | Outcome |
|------|---------|
| 1 | Hermes understands plugin layout and install paths |
| 2 | Plugin tools and dashboard extension enabled |
| 3 | Three specialized agent profiles ready |
| 4 | Demo leads, conversations, signals, and actions loaded |
| 5–6 | Business Ops tab visible with Overview, Actions, etc. |
| 7 | Ops Lead briefing with priorities and risks |
| 8 | Pending action proposals in the queue |
| 9 | Approval mutates state and writes audit event |
| 10 | Path to Gmail, Slack, CRM via Composio CLI |

## After install

- [How it works](./how-it-works) — understand signals and approvals
- [Dashboard](./dashboard) — explore all UI pages
- [Composio CLI](./composio-cli) — connect real apps

## Source

This prompt is also in the repository at `docs/INSTALLATION_PROMPT.md`.
