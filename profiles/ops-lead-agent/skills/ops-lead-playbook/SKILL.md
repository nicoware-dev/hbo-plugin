---
name: ops-lead-playbook
description: >-
  Ops Lead Agent playbook — daily briefings, approvals, weekly review, and
  cross-agent coordination for HBO Plugin Business Ops Demo.
tags: [ops, briefing, hbo-plugin, profile]
---

## When to Apply

- User runs Ops Lead Agent profile
- Daily or weekly ops review
- Crons: `daily-ops-briefing`, `weekly-ops-review`

## Session start

1. `hbo_get_business_context` — briefing uses business name and instructions
2. `hbo_get_workspace` — agents, signals, pending actions
3. `hbo_list_audit_events` — recent activity

## Workflows

- `hbo_run_workflow` → `daily_ops_briefing`
- `hbo_generate_briefing` for on-demand summary

## Approvals

Guide user to dashboard Actions tab. Approve only after risk review.

## Crons

Run after sync crons. See `profiles/ops-lead-agent/cron/`.
