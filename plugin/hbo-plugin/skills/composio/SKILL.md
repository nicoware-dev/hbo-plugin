---
name: composio
description: >-
  Access 1000+ external apps via Composio CLI or SDK — search tools, connect
  accounts, execute actions. Use when user wants Gmail, Slack, GitHub, Notion,
  automate external services, composio cli, or build agents with external tools.
tags: [composio, tool-router, agents, mcp, tools, api, automation, cli, hbo-plugin]
---

## When to Apply

- User wants to access or interact with external apps (Gmail, Slack, GitHub, Notion, etc.)
- User wants to automate a task using an external service (send email, create issue, post message)
- Building an AI agent or app that integrates with external tools
- HBO Plugin user wants the **composio bridge** beyond local demo data

> **HBO Plugin MVP:** Composio is the only external bridge in scope. Use CLI workflows below; do not add One/n8n unless scope expands. If Composio is unavailable, use `hbo-plugin:local-demo`.

## Setup — detect platform first

**Do not** run `curl -fsSL https://composio.dev/install | bash` on Windows PowerShell or Git Bash — it fails.

**Do not** use `npm install -g @composio/cli` — that package is not on npm (404).

| Platform | Install |
|----------|---------|
| Linux / macOS | `curl -fsSL https://composio.dev/install \| bash` |
| **Windows** | WSL Ubuntu + `.\scripts\setup-composio-windows.ps1` → then `composio` in PowerShell (not plain `wsl composio`) |

Full install guide: [Platform Install](rules/platform-install.md) · repo `docs/COMPOSIO_CLI_INSTALL.md`

**Windows after WSL login:** run once from repo root:

```powershell
.\scripts\setup-composio-windows.ps1
```

Then in a new PowerShell window: `composio whoami`.

After install, authenticate:

```bash
composio login       # OAuth; use -y to skip org/project picker
composio whoami      # verify login
composio --version
```

Agents without browser: `composio login --no-wait | jq` → user opens URL → `composio login --key "<key>"`.

---

## 1. Use Apps via Composio CLI (HBO default path)

**Use when:** Taking action on external apps directly — no custom code.

Workflow: **search → link (if needed) → execute**

```bash
composio search "update spreadsheet row"
composio link googlesheets              # --no-wait for non-interactive agents
composio execute <TOOL> --get-schema
composio execute <TOOL> -d '{...}'
```

Key commands:

- `composio search "<query>"` — find tools by use case
- `composio link [toolkit]` — connect account (`--no-wait` for agents)
- `composio execute "<TOOL_SLUG>" -d '{...}'` — run a tool
- `composio listen` — real-time trigger events (optional)

> Full reference: [Composio CLI Guide](rules/composio-cli.md)

### HBO Plugin integration

Approved business actions execute via Composio **after** HBO approval gates. Map external results back to lead/action shapes.

> [HBO Bridge](rules/hbo-bridge.md) — approvals, normalization, local-demo fallback

---

## 2. Building Apps and Agents with Composio SDK

**Use when:** Writing code — backend service or multi-user app with Composio SDK (not required for HBO demo CLI bridge).

```bash
composio init   # inside project directory
```

> Full reference: [Building with Composio](rules/building-with-composio.md)

Use SDK patterns (`composio.create(user_id)`, `session.tools()`) only when building apps — for personal/agent CLI workflows, prefer the CLI.

---

## Rule index

| Rule | Topic |
|------|-------|
| [platform-install.md](rules/platform-install.md) | Windows WSL, Linux, macOS install |
| [composio-cli.md](rules/composio-cli.md) | Search, link, execute, agent tips |
| [hbo-bridge.md](rules/hbo-bridge.md) | HBO approvals + normalization |
| [building-with-composio.md](rules/building-with-composio.md) | SDK / `composio init` |
| [AGENTS.md](AGENTS.md) | Full expanded guide for agents |
