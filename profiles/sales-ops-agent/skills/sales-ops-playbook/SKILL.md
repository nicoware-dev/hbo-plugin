---
name: sales-ops-playbook
description: >-
  Sales Ops Agent playbook — inbound leads, follow-ups, email review, and
  sales-source sync crons for HBO Plugin Business Ops Demo.
tags: [sales, inbound, hbo-plugin, profile]
---

## When to Apply

- User runs Sales Ops Agent profile
- Inbound sales workflow or missed follow-up detection
- Cron: `sales-source-sync`, `unread-email-review`

## Session start

1. `hbo_get_business_context` — load tone and product context
2. `hbo_get_workspace` — pending actions and open signals
3. `hbo_list_leads` — review hot and needs_followup leads

## Workflows

- `hbo_run_workflow` → `inbound_sales`
- Propose actions; never auto-approve external sends

## Composio (optional)

Use `hbo-plugin:composio` for Sheets import and Gmail review when bridge is composio/hybrid.

## Crons

See `profiles/sales-ops-agent/cron/` — enable manually after review.
