# Composio CLI — Installation by Platform

Optional bridge for HBO Plugin. The local Business Ops Demo does **not** require Composio.

Official reference: [Composio CLI docs](https://docs.composio.dev/docs/cli)

## Supported platforms

| Platform | Install method | Notes |
|----------|----------------|-------|
| **Linux** (x64, ARM64) | `curl \| bash` script | Fully supported |
| **macOS** (Intel, Apple Silicon) | `curl \| bash` script | Fully supported |
| **Windows** | **WSL only** | No native PowerShell/Git Bash installer |
| **Windows (npm)** | Not available | `@composio/cli` is not published on npm (404) |

Composio publishes binaries for `linux-x64`, `linux-aarch64`, `darwin-x64`, and `darwin-aarch64` only. There is no `composio-windows-*.zip` release.

---

## Linux and macOS

### Prerequisites

- `curl`
- `unzip`

### Install

```bash
curl -fsSL https://composio.dev/install | bash
```

Reload your shell (or `source ~/.bashrc` / `source ~/.zshrc`), then authenticate:

```bash
composio login
composio whoami
composio --version
```

### Upgrade

```bash
composio upgrade
```

---

## Windows

Windows native terminals (PowerShell, CMD, Git Bash) are **not** supported by the install script. The script exits with:

> Windows is not supported. Please use WSL or install via npm: `npm install -g @composio/cli`

The npm fallback is **outdated** — the package does not exist on the public npm registry. Use **WSL** instead.

### 1. Enable WSL with Ubuntu

If WSL is not installed:

```powershell
wsl --install -d Ubuntu
```

Restart if prompted, then open **Ubuntu** from the Start menu or run:

```powershell
wsl -d Ubuntu
```

### 2. Install prerequisites inside Ubuntu

```bash
sudo apt update
sudo apt install -y curl unzip
```

### 3. Install Composio CLI inside WSL

```bash
curl -fsSL https://composio.dev/install | bash
source ~/.bashrc
composio login
composio whoami
```

### 4. Use Composio from Windows PowerShell (one-time setup)

After `composio login` works **inside Ubuntu**, plain `wsl composio` from PowerShell usually still fails: Ubuntu `.bashrc` skips non-interactive shells, so PATH never includes `~/.composio`.

**Automated setup (tested, from repo root in PowerShell):**

```powershell
.\scripts\setup-composio-windows.ps1
```

This script:

1. Adds Composio to WSL `~/.profile` (for `bash -lc` / wrappers)
2. Adds `scripts/` to your Windows user PATH
3. Verifies `composio --version` and `composio whoami`

Open a **new** PowerShell window, then:

```powershell
composio whoami
composio search "summarize unread gmail"
```

**What runs under the hood:** `scripts/composio.ps1` calls `wsl.exe -d Ubuntu -- bash -lc "composio …"`.

**Manual pieces (if you prefer):**

```powershell
# WSL profile (once)
wsl.exe -d Ubuntu -- bash //mnt/c/.../hbo-plugin/scripts/wsl-composio-profile.sh

# Windows PATH (once)
.\scripts\install-composio-windows-path.ps1

# Run without PATH
.\scripts\composio.ps1 whoami
```

**Optional — symlink in Ubuntu (needs sudo):** `sudo ln -sf ~/.composio/composio /usr/local/bin/composio` then `wsl.exe -d Ubuntu -- composio whoami` may work without the wrapper.

Hermes Agent and other Windows tools should call `composio` after setup (wrapper on PATH), not bare `wsl composio`.

### Windows troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `npm error 404` for `@composio/cli` | Package not on npm | Use WSL install above |
| Install script fails in Git Bash | MINGW/MSYS blocked | Use WSL Ubuntu |
| `unzip is required` in WSL | Missing package | `sudo apt install -y unzip` |
| `composio` works in Ubuntu but not PowerShell | `.bashrc` skipped for non-interactive WSL | Run `.\scripts\setup-composio-windows.ps1` |
| `composio` not found in new PowerShell | PATH not refreshed | Close and reopen terminal |
| `wsl composio` still fails | Expected without symlink | Use `composio` on PATH (wrapper) or `bash -lc` |

---

## Usage (all platforms)

Once installed and logged in:

```bash
# Find a tool by natural language
composio search "update spreadsheet row"

# Connect an app account
composio link googlesheets

# Inspect input schema
composio execute GMAIL_FETCH_EMAILS --get-schema

# Execute a tool
composio execute GMAIL_FETCH_EMAILS \
  -d '{ "query": "is:unread newer_than:1d", "max_results": 10 }'
```

Useful commands:

| Command | Purpose |
|---------|---------|
| `composio search` | Find tools by description |
| `composio link` | Connect a toolkit account |
| `composio execute` | Run a tool by slug |
| `composio proxy` | Call a provider API with Composio-managed auth |
| `composio whoami` | Check login state |
| `composio --version` | CLI version |

For multi-step workflows, see `composio run` in the [official CLI docs](https://docs.composio.dev/docs/cli).

---

## HBO Plugin integration

- Skill: `plugin/hbo-plugin/skills/composio/SKILL.md` (`hbo-plugin:composio`)
- Bridge scope: `docs/COMPOSIO_CLI_BRIDGE.md`
- If Composio is not configured, use the `local-demo` skill and bundled JSON state instead.

---

## References

- [Composio CLI documentation](https://docs.composio.dev/docs/cli)
- [GitHub: Windows install question (#3134)](https://github.com/ComposioHQ/composio/issues/3134)
- [GitHub: Windows support request (#3057)](https://github.com/ComposioHQ/composio/issues/3057)
