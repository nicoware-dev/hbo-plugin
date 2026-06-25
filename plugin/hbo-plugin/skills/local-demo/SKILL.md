---
name: local-demo
description: Run the Business Ops Demo without external credentials. Use to load demo data, run workflows, approve actions, and open the dashboard.
---

# Local Demo Mode

Run HBO Plugin with bundled local JSON state — no Composio or external APIs required.

## Quick start

1. Call `hbo_load_demo_data` to verify demo state
2. Call `hbo_get_workspace` for workspace summary
3. Open the Hermes dashboard **Business Ops** tab
4. Run workflows via `hbo_run_workflow`
5. Approve or reject actions via dashboard or `hbo_approve_action` / `hbo_reject_action`

## Demo workflows

- `inbound_sales` — Sales Ops Agent
- `outbound_growth` — Growth Agent
- `daily_ops_briefing` — Ops Lead Agent
