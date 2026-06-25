---
sidebar_position: 3
title: Install prompt
---

# Install prompt

The fastest way to install and verify HBO Plugin. Copy the prompt below and paste it into **Hermes Agent**.

Hermes will read the docs, install the plugin and profiles, open the dashboard, run a workflow, and walk through the approval loop.

## Prompt

```text
Install HBO Plugin from the hbo-plugin repository.

Please:
1. read the README and docs,
2. install the Hermes plugin,
3. install the Sales Ops, Growth, and Ops Lead profile distributions,
4. open the Hermes dashboard,
5. verify the Business Ops tab,
6. run the daily briefing workflow,
7. show the action queue,
8. approve one action,
9. explain how to enable the composio-cli skill.
```

## What each step does

| Step | Outcome |
|------|---------|
| 1 | Hermes understands plugin layout and install paths |
| 2 | Plugin tools and dashboard extension enabled |
| 3 | Three specialized agent profiles ready |
| 4–5 | Business Ops tab visible with Overview, Actions, etc. |
| 6 | Ops Lead briefing with priorities and risks |
| 7 | Pending action proposals in the queue |
| 8 | Approval mutates state and writes audit event |
| 9 | Path to Gmail, Slack, CRM via Composio CLI |

## After install

- [How it works](./how-it-works) — understand signals and approvals
- [Dashboard](./dashboard) — explore all UI pages
- [Composio CLI](./composio-cli) — connect real apps

## Source

This prompt is also in the repository at `docs/INSTALLATION_PROMPT.md`.
