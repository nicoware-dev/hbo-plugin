---
sidebar_position: 7
title: Plugin
---

# Hermes Plugin

Package: `plugin/hbo-plugin/`

The plugin registers **18 HBO tools** (`hbo_*`), **7 bundled skills**, business rules, and file-backed workspace state. Entry point: `register(ctx)` in `__init__.py`.

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
| `hbo_execute_action` | Execute an approved action externally (e.g. Composio Gmail) |
| `hbo_generate_briefing` | Generate daily ops briefing |
| `hbo_list_audit_events` | Audit log entries |
| `hbo_load_demo_data` | Reset demo data from bundled seed |
| `hbo_import_leads_from_sheets` | Import leads via Composio Google Sheets |
| `hbo_send_approval_email` | Send email for approved action or explicit recipient |
| `hbo_get_bridge_status` | Tool bridge status (local + Composio) |
| `hbo_set_bridge_mode` | Set bridge mode: local-demo, composio, hybrid |
| `hbo_get_business_context` | Business context for agent prompts |
| `hbo_sync_sales_sources` | Sales source sync (cron-aligned import) |

## Approval flow

```text
pending → approve → approved → execute → executed | failed
         reject  → rejected
```

Approve records intent. Execute triggers external effects only when bridge mode allows.

## Workflows

| Name | Output |
|------|--------|
| `inbound_sales` | Bot QA flags, signals, follow-up action proposals |
| `outbound_growth` | Lead scores, segments, outreach batch, outreach proposals |
| `daily_ops_briefing` | Priorities, risks, pending approvals, recommended actions |

## State

`state.py` reads and writes JSON workspace files under `data/business-ops-demo/`.

## Skills registered

| Skill | Purpose |
|-------|---------|
| `sales-ops` | Inbound workflow guidance |
| `growth-ops` | Outbound workflow guidance |
| `ops-lead` | Briefing and coordination |
| `local-demo` | Local demo data workflows |
| `composio` | External app bridge |
| `nvidia-nemoclaw-setup` | Optional NemoClaw deployment |
| `stripe-link-cli` | Optional mock spend demo |

Skills are namespaced as `hbo-plugin:<skill>` in Hermes.

## Related

- [How it works](./how-it-works) — signal and approval loop
- [Demo script](./demo-script) — presentation flow
- [Development](./development) — contributor setup
