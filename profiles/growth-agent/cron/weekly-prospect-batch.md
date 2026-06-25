# Weekly Prospect Batch

| Field | Value |
|-------|-------|
| **Name** | weekly-prospect-batch |
| **Agent** | Growth Agent |
| **Schedule** | Weekly Wednesday (e.g. `0 10 * * 3`) |
| **Skills** | `hbo-plugin:growth-ops`, `hbo-plugin:local-demo` |
| **Bridge** | any (local-demo works without Composio) |
| **Silent** | No — writes audit event |

## Purpose

Build a scored weekly outbound prospect batch from leads already in HBO state (after prospect-source-sync or manual import).

## Task

1. `hbo_list_leads` — filter segments: wholesale, services, enterprise prospects.
2. Score and rank leads not yet in an outreach batch this week.
3. `hbo_run_workflow` → `outbound_growth` with top candidates.
4. Create action proposals for outreach messages (human approval required).
5. Write `workflow_run` and batch summary audit events.

## Expected output

```text
outreach batch with leadCount
draft outreach previews on action proposals
audit events for batch creation
```

## Enable

```bash
hermes cron add --name weekly-prospect-batch --schedule "0 10 * * 3" \
  --agent growth --prompt "Run Weekly Prospect Batch per profiles/growth-agent/cron/weekly-prospect-batch.md"
```

## Test

```text
hbo_run_workflow outbound_growth
hbo_list_actions status=pending
```

Verify outreach preview on Actions page. Approve without Execute in local-demo mode.

## Safety notes

- Do not auto-send outreach — proposals require approve then explicit execute (Composio mode).
- Skip leads with missing contact info.
- Respect business context tone from `hbo_get_business_context`.
