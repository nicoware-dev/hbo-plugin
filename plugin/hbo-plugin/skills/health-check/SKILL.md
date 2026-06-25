---
name: health-check
description: Audit HBO workspace health — workflows, stale signals, unassigned leads, bridge status, pending actions.
---

# System Health Check

Generate a concise health report from live workspace state.

## Checks

1. `hbo_get_workspace` — pending actions, open signals counts
2. `hbo_list_workflows` — last run status per workflow
3. `hbo_list_signals` — open signals older than 48h (flag stale)
4. `hbo_list_leads` — leads without `ownerAgentId` or email when hot
5. `hbo_get_bridge_status` — Composio CLI availability and mode
6. `hbo_list_audit_events` — recent failures (`action_failed`)

## Output format

```
HEALTH REPORT
Bridge: {mode} — Composio {ok|down}
Workflows: {id}: {status} (last: {at})
Stale signals: {n}
Pending actions: {n}
Risks: {bullets}
Recommended: {bullets}
```

## When to escalate

- Bridge `composio` selected but CLI unavailable → suggest `local-demo` or fix WSL install
- Pending actions > 5 → recommend Ops Lead briefing
- Stale signals > 0 → recommend resolve or reassign
