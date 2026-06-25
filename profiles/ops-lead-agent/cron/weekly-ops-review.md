# Weekly Ops Review

| Field | Value |
|-------|-------|
| **Name** | weekly-ops-review |
| **Agent** | Ops Lead Agent |
| **Schedule** | Weekly (e.g. `0 10 * * 5`) |
| **Skills** | `hbo-plugin:ops-lead`, `hbo-plugin:local-demo` |
| **Bridge** | any |
| **Silent** | No |

## Purpose

Weekly rollup: audit trends, workflow health, bridge status, unresolved signals.

## Task

1. Review audit log for the past 7 days.
2. Summarize approved vs rejected actions, workflow runs, sync events.
3. Flag stale signals and unassigned leads.
4. Propose process improvements (no auto-execution).

## Expected output

```text
weekly summary
trend highlights
open risks
recommended next-week focus
```

## Enable

```bash
hermes cron add --name weekly-ops-review --schedule "0 10 * * 5" \
  --agent ops-lead --prompt "Run Weekly Ops Review per profiles/ops-lead-agent/cron/weekly-ops-review.md"
```

## Test

Open Audit tab in dashboard and ask Ops Lead Agent for a weekly summary.
