---
sidebar_position: 7
title: Plugin
---

# Hermes Plugin

Package: `plugin/hbo-plugin/`

The plugin registers **12 HBO tools** (`hbo_*`), bundled skills, business rules, and file-backed workspace state. Entry point: `register(ctx)` in `__init__.py`.

## Tool reference

| Tool | Description |
|------|-------------|
| `hbo_get_workspace` | Workspace summary — pending actions, open signals, agent count |
| `hbo_list_agents` | Configured agent profiles and recent activity |
| `hbo_list_workflows` | Available built-in workflows |
| `hbo_run_workflow` | Run `inbound_sales`, `outbound_growth`, or `daily_ops_briefing` |
| `hbo_list_leads` | Leads and prospects in the workspace |
| `hbo_detect_signals` | List open business signals |
| `hbo_list_actions` | Action proposals (optional `status` filter) |
| `hbo_approve_action` | Approve a pending action — writes audit event |
| `hbo_reject_action` | Reject a pending action — writes audit event |
| `hbo_generate_briefing` | Generate daily ops briefing |
| `hbo_list_audit` | Audit log entries |

## Workflows

| Name | Output |
|------|--------|
| `inbound_sales` | Bot QA flags, signals, follow-up action proposals |
| `outbound_growth` | Lead scores, segments, outreach batch, outreach proposals |
| `daily_ops_briefing` | Priorities, risks, pending approvals, recommended actions |

## Business rules

`business_rules.py` coordinates:

- Signal detection from current state
- Workflow execution (delegates to `workflows.py`)
- Approve/reject with audit side effects
- Briefing generation

## State

`state.py` reads and writes JSON workspace files:

- Atomic read/write per entity file
- `append_signal`, `append_action`, `append_audit` for mutations
- Shared by plugin tools and dashboard API routes

## Skills registered

| Skill | Path |
|-------|------|
| `sales-ops` | Inbound workflow guidance |
| `growth-ops` | Outbound workflow guidance |
| `ops-lead` | Briefing and coordination |
| `composio-cli` | External app bridge |

Skills are namespaced as `hbo-plugin:skill` in Hermes.

## Manifest

`plugin.yaml` declares plugin metadata, tool registration, and dashboard extension path.

## Related

- [How it works](./how-it-works) — signal and approval loop
- [Architecture](./architecture) — system diagram
- [Development](./development) — contributor setup
