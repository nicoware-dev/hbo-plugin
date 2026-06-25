---
title: Composio CLI — Install by Platform
impact: HIGH
description: Install and run Composio CLI on Windows (WSL), Linux, and macOS
tags: [cli, composio, install, windows, wsl, linux, macos]
---

# Composio CLI — Install by Platform

Official docs: [docs.composio.dev/docs/cli](https://docs.composio.dev/docs/cli)

Repository guide: `docs/COMPOSIO_CLI_INSTALL.md` (hbo-plugin)

## Detect the user's OS first

| OS | Supported? | Install path |
|----|------------|--------------|
| Linux (x64, ARM64) | Yes | Install script |
| macOS (Intel, Apple Silicon) | Yes | Install script |
| Windows (PowerShell, CMD, Git Bash) | **No native** | WSL Ubuntu + `setup-composio-windows.ps1` |
| `npm install -g @composio/cli` | **No** | Package not on npm (404) |

If the user is on **Windows without WSL**, guide them to WSL — do not suggest `curl | bash` in PowerShell or Git Bash.

---

## Linux and macOS

**Prerequisites:** `curl`, `unzip`

```bash
curl -fsSL https://composio.dev/install | bash
source ~/.bashrc   # or source ~/.zshrc on macOS
composio login
composio whoami
```

---

## Windows (WSL + PowerShell wrapper)

### Step 1 — Install CLI inside Ubuntu

```bash
sudo apt update && sudo apt install -y curl unzip
curl -fsSL https://composio.dev/install | bash
source ~/.bashrc
composio login
composio whoami
```

### Step 2 — Enable `composio` from PowerShell (one-time)

From the hbo-plugin repo in **PowerShell**:

```powershell
.\scripts\setup-composio-windows.ps1
```

Then open a **new** PowerShell window:

```powershell
composio whoami
```

**Do not** tell users to use plain `wsl composio` — it fails unless they symlink with sudo. The repo wrapper uses `wsl bash -lc "composio …"` and is on PATH after setup.

### Scripts (repo `scripts/`)

| Script | Purpose |
|--------|---------|
| `setup-composio-windows.ps1` | Full one-time Windows setup + verify |
| `wsl-composio-profile.sh` | Adds Composio to WSL `~/.profile` |
| `install-composio-windows-path.ps1` | Adds `scripts/` to Windows user PATH |
| `composio.ps1` / `composio.cmd` | Forward `composio` to WSL |

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `wsl composio` fails from PowerShell | Expected — run `.\scripts\setup-composio-windows.ps1`, then use `composio` |
| Works in Ubuntu, not PowerShell | Same as above |
| `composio` not found after setup | New PowerShell window |
| `npm error 404` | Use WSL; npm package does not exist |

---

## Verify

```powershell
composio --version
composio whoami
```

Agent login flows: [Composio CLI Guide](./composio-cli.md)
