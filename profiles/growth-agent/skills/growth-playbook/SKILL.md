---
name: growth-playbook
description: >-
  Growth Agent playbook — prospect sync, outbound batches, lead scoring, tools,
  and crons for HBO Plugin Business Ops Demo.
tags: [growth, outbound, hbo-plugin, profile]
---

# Growth Playbook

Profile-specific session guide for the Growth Agent distribution.

## Contract

- Session starts with business context and lead segmentation before outreach
- Outbound runs via `outbound_growth` workflow; proposals stay pending until user approves
- Loads `hbo-plugin:growth-ops` for domain workflows; optional Composio for Sheets import
- Crons documented but never auto-enabled without user review

## When to Apply

- User runs Growth Agent profile
- Outbound growth workflow or prospect list sync
- Crons: `prospect-source-sync`, `weekly-prospect-batch`

## When to skip

- Inbound sales or follow-up gaps → **sales-ops-playbook**
- Daily briefing or cross-agent approvals → **ops-lead-playbook**
- Local demo only with no growth intent → **local-demo**

## Phases

1. **Align.** `hbo_get_business_context` — USPs and audience for outreach copy.
2. **Segment.** `hbo_list_leads` — wholesale, services, enterprise prospects.
3. **Check history.** `hbo_list_workflows` — last outbound run.
4. **Run batch.** `hbo_run_workflow` → `outbound_growth`; score before batching.
5. **Propose.** `hbo_list_actions` status=pending — summarize for user approval.
6. **Execute.** `hbo_execute_action` only after explicit user approval.

Load `hbo-plugin:growth-ops` for plugin workflows.

## Tools

| Tool | When |
|------|------|
| `hbo_get_business_context` | Match outreach copy to USPs |
| `hbo_list_leads` | Segment prospects |
| `hbo_run_workflow` | `outbound_growth` for batch + proposals |
| `hbo_import_leads_from_sheets` | Sync prospects (Composio) |
| `hbo_list_actions` | Review outreach proposals |
| `hbo_approve_action` / `hbo_execute_action` | User-driven approval loop |
| `hbo_list_audit_events` | Confirm batch audit trail |

## Workflows

- `hbo_run_workflow` → `outbound_growth`
- Score leads before batching; prioritize high-fit segments

## Example — outbound growth

```text
1. hbo_get_business_context
2. hbo_run_workflow outbound_growth
3. hbo_list_actions status=pending
4. "Prepared batch of 5 leads — preview outreach on act_003, awaiting approval."
```

## Composio (optional)

Import prospects from Google Sheets via `hbo_import_leads_from_sheets`. Load `hbo-plugin:composio` when bridge is composio/hybrid.

## Crons

- `prospect-source-sync` — import prospects
- `weekly-prospect-batch` — build weekly batch

See `profiles/growth-agent/cron/`. Enable manually after review.

## Output Format

```
GROWTH PLAYBOOK REPORT
- Segment: {wholesale|services|enterprise|mixed}
- Workflow: outbound_growth | prospect-source-sync
- Pending actions: {count}
- Next: user approval on {action_ids} | enable cron {name}
```

## Anti-Patterns

| Don't | Why |
|-------|-----|
| Auto-approve outreach sends | External effects require user gate |
| Skip lead scoring before batch | Wastes outreach on low-fit prospects |
| Enable crons without user review | Unattended external sync risk |
| Use for inbound sales | **sales-ops-playbook** owns inbound |
| Composio setup from here | Use **composio** skill for CLI install |

## vs sibling skills

| Skill | Use for |
|-------|---------|
| **growth-playbook** (this) | Growth Agent profile session + crons |
| **growth-ops** | Domain outbound workflows (any agent) |
| **sales-ops-playbook** | Inbound sales profile |
| **composio** | External app bridge setup |
