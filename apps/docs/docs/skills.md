---
sidebar_position: 10
title: Skills
---

# Bundled Skills

Skills live in `plugin/hbo-plugin/skills/` and register via `ctx.register_skill(name, path)` in the plugin entry point.

Hermes namespaces them as `hbo-plugin:<skill-name>`.

**15 bundled skills** in the plugin. Each profile distribution also ships one **profile-local playbook** (3 total — see [Profiles](./profiles)).

## Workflow skills

| Skill | Used by | Guides Hermes to |
|-------|---------|------------------|
| `sales-ops` | Sales Ops profile | Run `inbound_sales`, detect signals, manage follow-ups |
| `growth-ops` | Growth profile | Run `outbound_growth`, score leads, plan outreach |
| `ops-lead` | Ops Lead profile | Run `daily_ops_briefing`, prioritize actions and signals |
| `local-demo` | All profiles | Local JSON demo data workflows without external APIs |

### Typical tool chain

```text
hbo_get_workspace → hbo_detect_signals → hbo_run_workflow → hbo_list_actions
→ hbo_approve_action → hbo_execute_action (external effects only when intended)
```

## Infrastructure

| Skill | Purpose |
|-------|---------|
| `plugin-manager` | Install, sync, verify, and repair HBO Plugin setup |

## Bridge skill

| Skill | Purpose |
|-------|---------|
| `composio` | Connect Gmail, Slack, GitHub, CRM, and 1000+ apps via Composio CLI |

Live execution requires Composio setup. See [Composio CLI](./composio-cli).

## Sponsor skills (optional)

| Skill | Purpose |
|-------|---------|
| `nvidia-nemoclaw-setup` | Deploy HBO on NemoClaw / NemoHermes runtime |
| `stripe-link-cli` | Mock approved spend demo via Stripe Link CLI |

MVP works without these — no credentials required.

## Extensibility skills

| Skill | Purpose |
|-------|---------|
| `demo-tour` | Guided onboarding of dashboard pages and approval loop |
| `health-check` | Workspace health audit (signals, bridge, workflows) |
| `export-report` | CSV leads export and activity summaries |
| `connect-source` | Onboard Composio data sources into HBO |
| `search-leads` | Preview external lead search before import |
| `create-agent` | Scaffold custom profile from `profiles/_template/` |
| `customize` | Admin guide for MVP customization limits |

## Profile-local playbooks

Each profile distribution includes a playbook under `profiles/*/skills/`:

| Playbook | Profile |
|----------|---------|
| `sales-ops-playbook` | Sales Ops Agent |
| `growth-playbook` | Growth Agent |
| `ops-lead-playbook` | Ops Lead Agent |

## Adding skills

1. Create `plugin/hbo-plugin/skills/<name>/SKILL.md`
2. Register in `__init__.py` with `ctx.register_skill`
3. Update `plugin/hbo-plugin/package-stats.yaml` and run `./scripts/check-doc-counts.sh`
4. Reference from profile `distribution.yaml` if needed

## Related

- [Plugin](./plugin) — tools skills invoke
- [Profiles](./profiles) — which skills each agent uses
