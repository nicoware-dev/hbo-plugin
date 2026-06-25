---
name: create-agent
description: Build a custom Hermes agent profile from the HBO template — role, tone, workflows, install.
---

# Create New Agent

Guide the operator to scaffold a specialized HBO-aligned agent profile.

## Template

Base files: `profiles/_template/` (distribution.yaml, config.yaml, SOUL.md)

## Phases

1. **Role** — inbound sales, growth, ops, or custom lane
2. **Tone** — align with `hbo_get_business_context` or ask operator
3. **Tools** — default HBO tools; add Composio if external lane
4. **Workflows** — pick from `inbound_sales`, `outbound_growth`, `daily_ops_briefing`
5. **Handoffs** — when to route to Sales Ops / Growth / Ops Lead
6. **Generate** — copy template to `profiles/{agent-id}/`, edit SOUL
7. **Install** — `hermes profile install ./profiles/{agent-id} --alias {alias}`

## SOUL sections (required)

- Mission, Preferred workflows, Hard rules, Handoffs, Truthfulness

## Output format

```
AGENT PROFILE
ID: {agent-id}
Alias: {alias}
Workflows: {list}
Install: hermes profile install ./profiles/{agent-id} --alias {alias}
```

## Anti-patterns

- Duplicate Sales Ops / Growth / Ops Lead without clear differentiation
- Auto-approve or auto-execute in SOUL
