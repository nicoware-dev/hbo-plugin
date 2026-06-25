---
sidebar_position: 9
title: Profiles
---

# Profile Distributions

Three Hermes agent profiles ship in `profiles/`. Each is installable via `hermes profile install`.

![Three specialist agents share one workspace](/img/hbo-agents.jpg)

## Profiles

| Profile | Directory | Focus |
|---------|-----------|-------|
| **Sales Ops Agent** | `profiles/sales-ops-agent/` | Inbound sales, bot QA, conversation review, lead follow-ups |
| **Growth Agent** | `profiles/growth-agent/` | Outbound leads, scoring, segments, outreach batches |
| **Ops Lead Agent** | `profiles/ops-lead-agent/` | Daily briefing, prioritization, approval coordination |

## Install

```bash
hermes profile install ./profiles/sales-ops-agent --alias sales-ops
hermes profile install ./profiles/growth-agent --alias growth
hermes profile install ./profiles/ops-lead-agent --alias ops-lead
```

## Package contents

Each profile directory includes:

| File | Purpose |
|------|---------|
| `distribution.yaml` | Hermes profile manifest |
| `SOUL.md` | Agent identity and behavior |
| `config.yaml` | Model and tool configuration |
| `README.md` | Profile-specific notes |

## Role in the operating loop

| Profile | Workflow | Typical outputs |
|---------|----------|-----------------|
| Sales Ops | `inbound_sales` | Bot QA signals, conversation review actions, follow-up tasks |
| Growth | `outbound_growth` | Lead scores, outreach batch, draft outreach proposals |
| Ops Lead | `daily_ops_briefing` | Priorities, risks, pending approval summary |

All three share the same HBO Plugin workspace state and appear on the dashboard **Agents** page.

## Skills used

Profiles reference HBO bundled skills:

- Sales Ops → `sales-ops`
- Growth → `growth-ops`
- Ops Lead → `ops-lead`

Add `composio-cli` when you need live external app execution.

## Related

- [How it works](./how-it-works) — how profiles fit the signal loop
- [Skills](./skills) — bundled skill reference
