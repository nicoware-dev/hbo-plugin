---
sidebar_position: 11
title: Business Ops Demo
---

# Business Ops Demo

A **generic commerce operations workspace** with bundled JSON data. No external credentials required — designed to show the full HBO operating loop in minutes.

## Demo scenario

The demo simulates a small commerce business with:

- Inbound leads from multiple segments (wholesale, retail, marketplace)
- Customer conversations across channels (some flagged for bot QA review)
- Missed follow-ups on high-priority leads
- Pending action proposals awaiting approval
- Agent activity across three specialized profiles
- Daily briefing examples with priorities and risks

No private business names or real customer data — safe for public demos and hackathons.

## Data files

Location: `plugin/hbo-plugin/data/business-ops-demo/`

| File | Purpose |
|------|---------|
| `workspace.json` | Workspace name, status, summary counts |
| `leads.json` | Prospects with score, segment, priority, recommended action |
| `conversations.json` | Inbound threads with bot responses and review flags |
| `signals.json` | Open signals (`missed_followup`, `bot_qa`, etc.) |
| `actions.json` | Action proposals with `pending` / `approved` / `rejected` status |
| `audit.json` | Approve/reject events with timestamps |
| `briefings.json` | Generated daily ops briefings |
| `agents.json` | Sales Ops, Growth, Ops Lead metadata |

Reset anytime with `hbo_load_demo_data` (copies from `business-ops-demo-original/` seed).

## Sample entities

### Leads

Leads have `status` values like `new`, `hot`, `needs_followup` that workflows use to generate follow-up proposals.

### Conversations

Conversations with `status: needs_review` trigger bot QA signals and "Review bot conversation" actions when `inbound_sales` runs.

### Signals

```json
{
  "id": "sig_001",
  "type": "missed_followup",
  "leadId": "lead_001",
  "summary": "No follow-up in 48h for high-priority lead",
  "ownerAgentId": "sales-ops-agent"
}
```

### Actions

```json
{
  "id": "act_001",
  "title": "Review bot conversation",
  "agentId": "sales-ops-agent",
  "risk": "low",
  "status": "pending"
}
```

## Demo flow (recommended)

1. Install plugin and profiles ([Install](./install))
2. Open dashboard → **Business Ops** tab
3. **Agents** — review three profile cards
4. **Workflows** — run `daily_ops_briefing`
5. **Actions** — approve one pending proposal
6. **Audit** — confirm the approval event
7. **Tool Bridges** — see Composio CLI as path to live apps

Full script: repository `docs/DEMO_SCRIPT.md`.

## Export samples

Example exports for importers live in `examples/business-ops-demo/`:

- `sample-leads.csv`
- `sample-conversations.json`
- `sample-actions.json`

## Extending the demo

- Add leads or conversations to JSON files, then reload
- Run workflows to regenerate signals and proposals
- Connect Composio for live data ([Composio CLI](./composio-cli))

## Related

- [How it works](./how-it-works) — signal and approval loop
- [Plugin](./plugin) — tools that read/write demo state
