---
sidebar_position: 10
title: Skills
---

# Bundled Skills

Skills live in `plugin/hbo-plugin/skills/` and register via `ctx.register_skill(name, path)` in the plugin entry point.

Hermes namespaces them as `hbo-plugin:<skill-name>`.

## Workflow skills

| Skill | Used by | Guides Hermes to |
|-------|---------|------------------|
| `sales-ops` | Sales Ops profile | Run `inbound_sales`, detect signals, manage follow-ups |
| `growth-ops` | Growth profile | Run `outbound_growth`, score leads, plan outreach |
| `ops-lead` | Ops Lead profile | Run `daily_ops_briefing`, prioritize actions and signals |

### Typical tool chain

```text
hbo_get_workspace → hbo_detect_signals → hbo_run_workflow → hbo_list_actions → hbo_approve_action
```

## Bridge skill

| Skill | Purpose |
|-------|---------|
| `composio` | Connect Gmail, Slack, GitHub, CRM, and 1000+ apps via Composio CLI (+ `rules/` for install and HBO bridge) |

Live execution requires Composio setup. See [Composio CLI](./composio-cli).

## Skill files

Each skill is a `SKILL.md` with:

- When to use the skill
- Which `hbo_*` tools to call
- Workflow-specific instructions

Example paths:

- `skills/sales-ops/SKILL.md`
- `skills/composio/SKILL.md`

## Adding skills

1. Create `plugin/hbo-plugin/skills/<name>/SKILL.md`
2. Register in `__init__.py` with `ctx.register_skill`
3. Reference from profile `distribution.yaml` if needed

## Related

- [Plugin](./plugin) — tools skills invoke
- [Profiles](./profiles) — which skills each agent uses
