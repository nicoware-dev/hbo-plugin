---
title: HBO Plugin — Composio Bridge
impact: HIGH
description: How Hermes agents use Composio with HBO Plugin tools, approvals, and local-demo fallback
tags: [hbo-plugin, composio, bridge, approvals, local-demo]
---

# HBO Plugin — Composio Bridge

Composio is the **optional** external execution layer for HBO Plugin. The Business Ops Demo runs fully on local JSON state without Composio.

## When to use Composio vs local-demo

| Situation | Use |
|-----------|-----|
| First run, no credentials, demo only | `hbo-plugin:local-demo` |
| User wants Gmail, Slack, Sheets, CRM, etc. | `hbo-plugin:composio` + Composio CLI |
| Action needs approval | HBO plugin tools (`hbo_*`) — Composio executes *after* approval |
| Composio not installed / login failed | Fall back to `local-demo`; explain install steps |

## HBO workflow with Composio

1. **Read workspace** — `hbo_get_workspace`, `hbo_list_leads`, `hbo_list_actions`
2. **Propose changes** — plugin tools create pending actions (approval gate)
3. **User approves** — dashboard or chat (`hbo_approve_action` / `hbo_reject_action`)
4. **Execute externally** — after approval, use Composio CLI for the real side effect:

```bash
composio search "<what the approved action needs>"
composio link <toolkit>          # if not connected; use --no-wait for agents
composio execute <TOOL> -d '{...}'
```

5. **Record outcome** — update HBO state / audit via plugin tools as appropriate

Never bypass HBO approvals by calling Composio directly for gated business actions.

## Normalization

When Composio returns external records, map them to HBO shapes before writing plugin state:

- **Leads** — id, name, email, company, stage, source, owner
- **Actions** — type, status, payload, linked lead/workflow, audit metadata

Prefer read-only Composio calls (fetch emails, list rows) during analysis; writes go through approved actions.

## Platform note (Windows)

Install Composio inside **WSL Ubuntu**, then run `.\scripts\setup-composio-windows.ps1` so `composio` works from PowerShell. See [Platform Install](./platform-install.md).

## Out of MVP scope

- One CLI / WithOne bridge
- n8n bridge
- Hard dependency on Composio for first-run demo

## Related docs

- `docs/COMPOSIO_CLI_INSTALL.md` — full install guide
- `docs/COMPOSIO_CLI_BRIDGE.md` — bridge scope
- [Composio CLI Guide](./composio-cli.md) — search, link, execute
