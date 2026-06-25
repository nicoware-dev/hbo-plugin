---
name: sales-ops-playbook
description: >-
  Sales Ops Agent playbook — inbound leads, follow-ups, email review, tools,
  and sales-source sync crons for HBO Plugin Business Ops Demo.
tags: [sales, inbound, hbo-plugin, profile]
---

# Sales Ops Playbook

Profile-specific session guide for the Sales Ops Agent distribution.

## Contract

- Inbound workflows use business context and lead review before proposing actions
- Proposals stay pending; never auto-approve external sends
- Loads `hbo-plugin:sales-ops` for domain workflows; optional Composio for Sheets/Gmail
- Crons documented but never auto-enabled without user review

## When to Apply

- User runs Sales Ops Agent profile
- Inbound sales workflow or missed follow-up detection
- Crons: `sales-source-sync`, `unread-email-review`

## When to skip

- Outbound prospect batches → **growth-playbook**
- Cross-agent briefing or approval rollup → **ops-lead-playbook**
- Payment or spend requests → **stripe-link-cli**

## Phases

1. **Context.** `hbo_get_business_context` — tone and product references.
2. **Workspace.** `hbo_get_workspace` — pending actions, open signals.
3. **Pipeline.** `hbo_list_leads` — hot and needs_followup leads.
4. **Detect.** `hbo_detect_signals` — missed follow-ups, bot QA issues.
5. **Run.** `hbo_run_workflow` → `inbound_sales`.
6. **Propose.** `hbo_list_actions` status=pending — summarize for user.
7. **Execute.** `hbo_execute_action` only when user explicitly requests external send.

Load `hbo-plugin:sales-ops` via `skill_view`.

## Tools

| Tool | When |
|------|------|
| `hbo_get_workspace` | Session start — pending actions, open signals |
| `hbo_get_business_context` | Align tone and product references |
| `hbo_list_leads` | Review inbound pipeline |
| `hbo_detect_signals` | Find missed follow-ups, bot QA issues |
| `hbo_run_workflow` | `inbound_sales` for full inbound pass |
| `hbo_list_actions` | Review pending proposals |
| `hbo_approve_action` | Only when user explicitly approves |
| `hbo_execute_action` | Only after approval, for external send |
| `hbo_list_audit_events` | Traceability after changes |
| `hbo_import_leads_from_sheets` | Sheets import (Composio) |

## Workflows

- `hbo_run_workflow` → `inbound_sales`
- Propose actions; never auto-approve external sends

## Example — inbound sales pass

```text
1. hbo_get_business_context
2. hbo_run_workflow inbound_sales
3. hbo_list_actions status=pending
4. Summarize: "Found 2 signals, 1 follow-up proposal for María García — awaiting approval."
```

User approves in dashboard → run `hbo_execute_action` only if they ask to send externally.

## Composio (optional)

Use `hbo-plugin:composio` for Sheets import and Gmail review when bridge is composio/hybrid.

## Crons

- `sales-source-sync` — sync inbound lead sources
- `unread-email-review` — review unread threads for signals

See `profiles/sales-ops-agent/cron/`. Enable manually after review.

## Output Format

```
SALES OPS PLAYBOOK REPORT
- Workflow: inbound_sales | sales-source-sync
- Leads reviewed: {count}
- Signals: {count}
- Pending actions: {count}
- Next: user approval on {action_id} before external send
```

## Anti-Patterns

| Don't | Why |
|-------|-----|
| Auto-send emails or messages | External effects require approval |
| Skip signal detection before workflow | Missed follow-ups stay hidden |
| Run outbound_growth | **growth-playbook** owns outbound |
| Composio install from here | Use **composio** skill |
| Execute without dashboard approval | Two-step gate violated |

## vs sibling skills

| Skill | Use for |
|-------|---------|
| **sales-ops-playbook** (this) | Sales Ops profile session + crons |
| **sales-ops** | Domain inbound workflows (any agent) |
| **growth-playbook** | Growth Agent profile |
| **composio** | External bridge setup |
