---
name: ops-lead-playbook
description: >-
  Ops Lead Agent playbook — daily briefings, approvals, weekly review, tools,
  and cross-agent coordination for HBO Plugin Business Ops Demo.
tags: [ops, briefing, hbo-plugin, profile]
---

# Ops Lead Playbook

Profile-specific session guide for the Ops Lead Agent distribution.

## Contract

- Briefings use business context and workspace snapshot before summarizing
- Approvals stay user-gated; execute only after explicit approval
- Coordinates Sales Ops and Growth via workspace view — does not replace their playbooks
- Crons documented but never auto-enabled without user review

## When to Apply

- User runs Ops Lead Agent profile
- Daily or weekly ops review
- Crons: `daily-ops-briefing`, `weekly-ops-review`

## When to skip

- Outbound prospect batches → **growth-playbook**
- Inbound sales follow-ups → **sales-ops-playbook**
- NemoClaw deployment only → **nvidia-nemoclaw-setup**

## Phases

1. **Context.** `hbo_get_business_context` — business name, priorities for briefing.
2. **Snapshot.** `hbo_get_workspace` — agents, signals, pending actions, bridge mode.
3. **Audit.** `hbo_list_audit_events` — recent activity for rollup.
4. **Brief.** `hbo_run_workflow` → `daily_ops_briefing` or `hbo_generate_briefing`.
5. **Queue.** `hbo_list_actions` — cross-agent approval queue.
6. **Decide.** `hbo_approve_action` / `hbo_reject_action` only when user delegates.
7. **Execute.** `hbo_execute_action` only after approval for external effects.

Load `hbo-plugin:ops-lead` for plugin workflows.

## Tools

| Tool | When |
|------|------|
| `hbo_get_workspace` | Snapshot: pending actions, signals, bridge mode |
| `hbo_get_business_context` | Briefing intro and priorities |
| `hbo_generate_briefing` | On-demand daily briefing |
| `hbo_run_workflow` | `daily_ops_briefing` full workflow |
| `hbo_list_actions` | Approval queue across agents |
| `hbo_list_audit_events` | Rollup and compliance review |
| `hbo_approve_action` / `hbo_reject_action` | When user delegates decision |
| `hbo_execute_action` | Only after approval, external effects |
| `hbo_get_bridge_status` | Report Composio health |

## Workflows

- `hbo_run_workflow` → `daily_ops_briefing`
- `hbo_generate_briefing` for on-demand summary

## Example — daily briefing

```text
1. hbo_get_business_context
2. hbo_run_workflow daily_ops_briefing
3. hbo_list_actions status=pending
4. "Briefing: 2 high-priority follow-ups, 1 growth outreach batch — 3 pending approvals."
```

## Approvals

Guide user to dashboard Actions tab. Approve only after risk review. Stripe mock spend demos — explain no real payment occurs.

## Crons

- `daily-ops-briefing` — weekday morning summary
- `weekly-ops-review` — Friday audit rollup

See `profiles/ops-lead-agent/cron/`. Not auto-enabled.

## Output Format

```
OPS LEAD PLAYBOOK REPORT
- Briefing: {on-demand | daily_ops_briefing | weekly review}
- Pending actions: {count} across {agents}
- Signals: {count} open
- Bridge: {local-demo | composio | hybrid}
- Next: review {action_ids} in dashboard
```

## Anti-Patterns

| Don't | Why |
|-------|-----|
| Auto-approve pending actions | User must gate external effects |
| Execute before approval recorded | Two-step gate violated |
| Run outbound_growth as ops lead | **growth-playbook** owns outbound |
| Enable crons silently | User must opt in |
| Store payment credentials | Use **stripe-link-cli** with HBO gate |

## vs sibling skills

| Skill | Use for |
|-------|---------|
| **ops-lead-playbook** (this) | Ops Lead profile session + crons |
| **ops-lead** | Domain briefing workflows (any agent) |
| **growth-playbook** | Growth Agent profile |
| **sales-ops-playbook** | Sales Ops profile |
