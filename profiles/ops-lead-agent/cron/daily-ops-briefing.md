# Daily Ops Briefing

| Field | Value |
|-------|-------|
| **Name** | daily-ops-briefing |
| **Agent** | Ops Lead Agent |
| **Schedule** | Weekdays after sync crons (e.g. `0 9 * * 1-5`) |
| **Skills** | `hbo-plugin:ops-lead`, `hbo-plugin:local-demo`, `hbo-plugin:composio` (optional) |
| **Bridge** | any |
| **Silent** | Yes — `[SILENT]` if nothing changed |

## Purpose

Summarize business state after source syncs: priorities, approvals, risks, recommended actions.

## Task

1. Review open signals, pending actions, source sync status, agent activity.
2. Run or reuse `daily_ops_briefing` workflow outputs.
3. Generate short briefing via `hbo_generate_briefing` if needed.
4. If nothing important changed since last briefing, return `[SILENT]`.

## Expected output

```text
top priorities
pending approvals
new risks
recommended actions
source sync status
```

## Enable

```bash
hermes cron add --name daily-ops-briefing --schedule "0 9 * * 1-5" \
  --agent ops-lead --prompt "Run Daily Ops Briefing per profiles/ops-lead-agent/cron/daily-ops-briefing.md"
```

## Test

```bash
hbo_run_workflow daily_ops_briefing
hbo_generate_briefing
```
