---
name: export-report
description: Export leads and activity reports — CSV leads, per-agent action summary, workflow run history.
---

# Export & Reports

Produce shareable exports from HBO state (no external DB).

## Lead CSV export

1. `hbo_list_leads` — fetch all leads
2. Emit CSV with columns: name, email, company, phone, source, segment, score, priority, status, ownerAgentId, recommendedAction
3. Dashboard alternative: Leads page → **Export CSV** button

## Activity report

1. `hbo_list_audit_events` — filter last 7 days
2. Group by `eventType` and `agentId`
3. Summarize: workflow runs, approvals, executions, failures

## Workflow summary

1. `hbo_list_workflows` — include `lastRunAt`, `status`, output counts
2. Note workflows never run

## Output format

```
EXPORT REPORT
Leads: {n} rows (CSV attached or inline)
Audit events (7d): {counts by type}
Workflows: {id} — {status}
```

## Limits (MVP)

- File-backed JSON only; no scheduled email delivery
- No HubSpot push (deferred)
