---
sidebar_position: 9
title: Composio
---

# Composio CLI Bridge

The **`composio`** skill (`hbo-plugin:composio`) connects HBO Plugin to Gmail, Slack, Sheets, CRM, and 1000+ apps through the Composio CLI.

HBO Plugin runs fully on **local workspace state** without Composio. Enable this integration when you need live reads and writes against external services.

Official Composio docs: [docs.composio.dev/docs/cli](https://docs.composio.dev/docs/cli)

## Platform support

| Platform | Supported? | How to install |
|----------|------------|----------------|
| Linux | Yes | Install script (below) |
| macOS | Yes | Install script (below) |
| Windows | WSL only | Install inside Ubuntu on WSL |
| Windows (npm) | No | `@composio/cli` is not on npm |

:::warning Windows users
Do **not** run `curl -fsSL https://composio.dev/install | bash` in PowerShell or Git Bash — it will fail. Do **not** use `npm install -g @composio/cli` — that package returns 404. Use **WSL** (see below).
:::

## Install — Linux and macOS

```bash
curl -fsSL https://composio.dev/install | bash
source ~/.bashrc   # or ~/.zshrc on macOS
composio login
composio whoami
```

Requires `curl` and `unzip`.

## Install — Windows (WSL)

### 1. Open Ubuntu on WSL

```powershell
wsl -d Ubuntu
```

If WSL is not installed: `wsl --install -d Ubuntu` (then restart if needed).

### 2. Inside Ubuntu

```bash
sudo apt update
sudo apt install -y curl unzip
curl -fsSL https://composio.dev/install | bash
source ~/.bashrc
composio login
composio whoami
```

### 3. Use from PowerShell (after WSL login)

Plain `wsl composio` fails by default. Run **once** from the repo:

```powershell
.\scripts\setup-composio-windows.ps1
```

Open a **new** PowerShell window:

```powershell
composio whoami
composio search "update spreadsheet row"
```

The wrapper (`scripts/composio.ps1`) calls `wsl bash -lc "composio …"` and is added to your user PATH.

## Usage

```bash
composio search "update spreadsheet row"
composio link googlesheets
composio execute <TOOL> --get-schema
composio execute <TOOL> -d '{...}'
```

| Command | Purpose |
|---------|---------|
| `composio search` | Find tools by natural language |
| `composio link` | Connect an app account |
| `composio execute` | Run a tool |
| `composio whoami` | Verify authentication |

## Google Sheets import

HBO Plugin does **not** ship a hardcoded spreadsheet ID. Configure one of:

- **Dashboard → Leads** — paste spreadsheet ID in the import form before running import
- **`workspace.json` → `demoSources.googleSheetsSpreadsheetId`** — used by `hbo_sync_sales_sources` and the sales-source-sync cron blueprint
- **Tool call** — pass `spreadsheetId` to `hbo_import_leads_from_sheets`

Default tab name: `demoSources.defaultSheetName` (falls back to `Hoja 1`).

## Local workspace fallback

If Composio is not configured, HBO Plugin continues to operate on **local workspace state** with no external credentials required.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `npm error 404` for `@composio/cli` | Use WSL install — npm package does not exist |
| Script fails in Git Bash | Switch to WSL Ubuntu |
| `unzip is required` in WSL | `sudo apt install -y unzip` |
| `composio` not found after install | `source ~/.bashrc` or open a new terminal |
| `wsl composio` fails from PowerShell | Run `.\scripts\setup-composio-windows.ps1`, then `composio` in a new window |

Extended install guide: `docs/COMPOSIO_CLI_INSTALL.md` in the repository.
