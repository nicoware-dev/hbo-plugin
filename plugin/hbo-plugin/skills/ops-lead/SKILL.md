---
name: ops-lead
description: Operational leadership — daily briefings, prioritization, approvals, and cross-agent coordination. Use for morning standups, action queues, and ops summaries.
---

# Ops Lead

Domain skill for cross-agent business operations coordination. Profile agents load via `hbo-plugin:ops-lead`; use **ops-lead-playbook** for Ops Lead Agent crons and session defaults.

## Contract

- Briefings combine business context, workspace snapshot, and audit trail
- Surfaces pending actions across agents without auto-approving
- Execute external effects only after recorded approval
- Does not replace domain sales or growth workflows

## When to use

- Generate daily business briefings
- Prioritize pending actions and open signals
- Coordinate cross-agent workflows
- Summarize risks and recommended next steps

## When to skip

- Outbound prospect work → **growth-ops**
- Inbound follow-up proposals → **sales-ops**
- First demo load → **local-demo**
- Ops Lead profile crons → **ops-lead-playbook**
- NemoClaw deploy → **nvidia-nemoclaw-setup**

## Phases

1. **Context.** `hbo_get_business_context`.
2. **Snapshot.** `hbo_get_workspace` — agents, signals, actions, bridge.
3. **Audit.** `hbo_list_audit_events` — recent activity.
4. **Brief.** `hbo_generate_briefing` or `hbo_run_workflow` → `daily_ops_briefing`.
5. **Queue.** `hbo_list_actions` — cross-agent pending.
6. **Bridge.** `hbo_get_bridge_status` when Composio health matters.
7. **Gate.** Approve/execute only per user delegation.

## Tools

| Tool | When |
|------|------|
| `hbo_get_business_context` | Briefing intro |
| `hbo_get_workspace` | Cross-agent snapshot |
| `hbo_generate_briefing` | On-demand summary |
| `hbo_run_workflow` | `daily_ops_briefing` |
| `hbo_list_actions` | Approval queue |
| `hbo_list_audit_events` | Compliance rollup |
| `hbo_approve_action` / `hbo_reject_action` | User delegation |
| `hbo_execute_action` | After approval |
| `hbo_get_bridge_status` | Composio health |

## Workflows

- `hbo_run_workflow` → `daily_ops_briefing`
- `hbo_generate_briefing` for quick on-demand summary

## Output Format

```
OPS LEAD REPORT
- Pending actions: {n}
- Open signals: {n}
- Bridge: {mode}
- Priority items: {bullets}
- Next: dashboard Actions review
```

## Anti-Patterns

| Don't | Why |
|-------|-----|
| Auto-approve queue | User gates external effects |
| Run inbound_sales as briefing substitute | Wrong workflow |
| Execute mock spend as real | Explain demo mock in Stripe actions |
| Deploy NemoClaw from here | **nvidia-nemoclaw-setup** |

## vs sibling skills

| Skill | Use for |
|-------|---------|
| **ops-lead** (this) | Briefing and coordination |
| **ops-lead-playbook** | Ops Lead profile + crons |
| **sales-ops** / **growth-ops** | Domain workflows |
| **stripe-link-cli** | Payment credentials |
