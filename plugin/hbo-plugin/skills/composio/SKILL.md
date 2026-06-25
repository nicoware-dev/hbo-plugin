---
name: composio
description: >-
  Access 1000+ external apps via Composio CLI or SDK — search tools, connect
  accounts, execute actions. Use when user wants Gmail, Slack, GitHub, Notion,
  automate external services, composio cli, or build agents with external tools.
tags: [composio, tool-router, agents, mcp, tools, api, automation, cli, hbo-plugin]
---

## Contract

- Detect platform before install; never run Linux curl installer on Windows PowerShell/Git Bash
- HBO business actions: approve (`hbo_approve_action`) then execute (`hbo_execute_action`) — two-step gate
- CLI path: search → link → execute; prefer `--no-wait` for non-interactive agents
- If Composio unavailable, fall back to `hbo-plugin:local-demo` — do not add One/n8n in MVP scope

## When to Apply

- User wants to access or interact with external apps (Gmail, Slack, GitHub, Notion, etc.)
- User wants to automate a task using an external service (send email, create issue, post message)
- Building an AI agent or app that integrates with external tools
- HBO Plugin user wants the **composio bridge** beyond local demo data

## When to skip

- Demo without credentials → **local-demo**
- Stripe Link payment credentials → **stripe-link-cli**
- NemoClaw image build only → **nvidia-nemoclaw-setup**
- Domain sales/growth workflows after bridge is healthy → **sales-ops** / **growth-ops**

> **HBO Plugin MVP:** Composio is the only external bridge in scope. Use CLI workflows below; do not add One/n8n unless scope expands. If Composio is unavailable, use `hbo-plugin:local-demo`.

## Phases

1. **Detect platform** — Windows vs Linux/macOS install path.
2. **Install & auth** — `composio login`, verify `composio whoami`.
3. **Search** — `composio search "<query>"` for tool slug.
4. **Link** — `composio link [toolkit]` with `--no-wait` for agents.
5. **HBO gate** — propose action → user approves → `hbo_execute_action`.
6. **Execute** — `composio execute <TOOL> -d '{...}'` when not routed via HBO tools.

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

Business actions use a **two-step** gate:

1. `hbo_approve_action` — records approval (audit: `action_approved`)
2. `hbo_execute_action` — runs Composio Gmail/Sheets only after approval (audit: `action_executed`)

In `local-demo` bridge mode, execute is limited to mock actions. Set bridge via Tool Bridges or `hbo_set_bridge_mode`.

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

## Output Format

```
COMPOSIO REPORT
- Platform: {windows|linux|macos}
- Auth: {ok|needs login}
- Toolkit: {name}
- HBO bridge: {local-demo|composio|hybrid}
- Next: link {toolkit} | approve action {id} | execute tool {slug}
```

## Anti-Patterns

| Don't | Why |
|-------|-----|
| `curl install` on Windows PS/Git Bash | Fails — use WSL script |
| `npm install -g @composio/cli` | Package 404 on npm |
| `hbo_execute_action` before approval | Two-step gate |
| One/n8n bridge in MVP | Out of scope |
| Full SDK tutorial inline | See `rules/` references |

## vs sibling skills

| Skill | Use for |
|-------|---------|
| **composio** (this) | External app bridge |
| **local-demo** | No-credentials demo |
| **stripe-link-cli** | Payment credentials |
| **hbo-bridge** rule | HBO normalization detail |

## Rule index

| Rule | Topic |
|------|-------|
| [platform-install.md](rules/platform-install.md) | Windows WSL, Linux, macOS install |
| [composio-cli.md](rules/composio-cli.md) | Search, link, execute, agent tips |
| [hbo-bridge.md](rules/hbo-bridge.md) | HBO approvals + normalization |
| [building-with-composio.md](rules/building-with-composio.md) | SDK / `composio init` |
| [AGENTS.md](AGENTS.md) | Full expanded guide for agents |
