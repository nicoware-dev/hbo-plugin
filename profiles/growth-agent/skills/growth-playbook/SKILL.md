---
name: growth-playbook
description: >-
  Growth Agent playbook — prospect sync, outbound batches, and lead scoring for
  HBO Plugin Business Ops Demo.
tags: [growth, outbound, hbo-plugin, profile]
---

## When to Apply

- User runs Growth Agent profile
- Outbound growth workflow or prospect list sync
- Cron: `prospect-source-sync`

## Session start

1. `hbo_get_business_context` — align outreach with USPs and audience
2. `hbo_list_leads` — segment wholesale, services, enterprise prospects
3. `hbo_list_workflows` — check last outbound run

## Workflows

- `hbo_run_workflow` → `outbound_growth`
- Score leads before batching; prioritize high-fit segments

## Composio (optional)

Import prospects from Google Sheets via `hbo_import_leads_from_sheets`.

## Crons

See `profiles/growth-agent/cron/prospect-source-sync.md`.
