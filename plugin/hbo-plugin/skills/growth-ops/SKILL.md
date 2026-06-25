---
name: growth-ops
description: Outbound growth operations — score prospects, segment leads, plan outreach batches, and draft follow-up sequences. Use for lead lists, prospect research, and outreach planning.
---

# Growth Ops

Domain skill for outbound lead generation in the Business Ops Demo. Profile agents load via `hbo-plugin:growth-ops`; use **growth-playbook** for Growth Agent crons and session defaults.

## Contract

- Score and segment leads before proposing outreach batches
- Run `outbound_growth` workflow for batch generation
- Proposals remain pending until user approves via dashboard or `hbo_approve_action`
- No Composio CLI setup here — use **composio** when bridge is required

## When to use

- Score and segment prospect lists
- Prepare outreach batches
- Draft outreach messages and follow-up tasks
- Recommend CRM or sheet updates

## When to skip

- Inbound sales or conversation review → **sales-ops**
- Daily briefing or cross-agent rollup → **ops-lead**
- First-run demo without credentials → **local-demo**
- Growth Agent profile crons → **growth-playbook**

## Phases

1. **Context.** `hbo_get_business_context` — USPs and audience fit.
2. **Inventory.** `hbo_list_leads` — segment by type and score.
3. **Batch.** `hbo_run_workflow` with `workflow: outbound_growth`.
4. **Review.** `hbo_list_actions` status=pending — summarize proposals.
5. **Gate.** Wait for approval before `hbo_execute_action`.

## Tools

| Tool | When |
|------|------|
| `hbo_get_business_context` | Align copy to USPs |
| `hbo_list_leads` | Segment and score prospects |
| `hbo_run_workflow` | `outbound_growth` |
| `hbo_list_actions` | Pending outreach proposals |
| `hbo_approve_action` / `hbo_execute_action` | After user approval |

## Workflows

- `hbo_run_workflow` → `outbound_growth`
- Prioritize high-fit segments before batching

## Output Format

```
GROWTH OPS REPORT
- Segment: {segment}
- Leads scored: {n}
- Pending outreach: {n}
- Next: approval on {action_ids}
```

## Anti-Patterns

| Don't | Why |
|-------|-----|
| Auto-execute outreach | External send requires approval |
| Skip scoring | Low-fit prospects waste batch capacity |
| Mix inbound sales scope | **sales-ops** owns inbound |
| Install Composio here | **composio** skill owns bridge setup |

## vs sibling skills

| Skill | Use for |
|-------|---------|
| **growth-ops** (this) | Outbound domain workflows |
| **growth-playbook** | Growth Agent profile + crons |
| **sales-ops** | Inbound commercial ops |
| **local-demo** | No-credentials demo path |
