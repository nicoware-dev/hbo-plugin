---
name: sales-ops
description: Inbound sales operations — review conversations, detect hot leads, flag bot QA issues, and recommend follow-ups. Use when handling customer messages, marketplace inquiries, or sales follow-up gaps.
---

# Sales Ops

Domain skill for inbound commercial operations in the Business Ops Demo. Profile agents load via `hbo-plugin:sales-ops`; use **sales-ops-playbook** for Sales Ops Agent crons and session defaults.

## Contract

- Detect signals and review leads before proposing follow-ups
- Run `inbound_sales` workflow for full inbound pass
- Never auto-approve or execute external sends
- No Composio CLI setup here — use **composio** when bridge is required

## When to use

- Review inbound conversations and customer questions
- Detect hot leads and missed follow-ups
- Flag weak or incomplete bot answers
- Create follow-up recommendations and action proposals

## When to skip

- Outbound prospect batches → **growth-ops**
- Daily briefing or approval rollup → **ops-lead**
- Demo bootstrap only → **local-demo**
- Sales Ops profile crons → **sales-ops-playbook**

## Phases

1. **Context.** `hbo_get_business_context` — tone and product refs.
2. **Pipeline.** `hbo_list_leads` — hot and needs_followup.
3. **Signals.** `hbo_detect_signals` — gaps and bot QA issues.
4. **Run.** `hbo_run_workflow` with `workflow: inbound_sales`.
5. **Propose.** `hbo_list_actions` status=pending.
6. **Gate.** `hbo_execute_action` only after user approval.

## Tools

| Tool | When |
|------|------|
| `hbo_get_business_context` | Tone and product alignment |
| `hbo_list_leads` | Pipeline review |
| `hbo_detect_signals` | Missed follow-ups, bot QA |
| `hbo_run_workflow` | `inbound_sales` |
| `hbo_list_actions` | Pending proposals |
| `hbo_approve_action` / `hbo_execute_action` | User-gated external send |

## Workflows

Run `hbo_run_workflow` with `workflow: inbound_sales` to scan conversations and generate signals.

## Output Format

```
SALES OPS REPORT
- Leads reviewed: {n}
- Signals: {n}
- Pending follow-ups: {n}
- Next: approval before external send
```

## Anti-Patterns

| Don't | Why |
|-------|-----|
| Auto-send on user urgency | Approval gate is mandatory |
| Skip signal detection | Missed follow-ups stay hidden |
| Run outbound_growth | **growth-ops** owns outbound |
| Composio setup inline | **composio** skill |

## vs sibling skills

| Skill | Use for |
|-------|---------|
| **sales-ops** (this) | Inbound domain workflows |
| **sales-ops-playbook** | Sales Ops profile + crons |
| **growth-ops** | Outbound growth |
| **ops-lead** | Briefings and coordination |
