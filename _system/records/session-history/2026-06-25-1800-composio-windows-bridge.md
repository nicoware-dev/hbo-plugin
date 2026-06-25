---
type: session
title: Composio CLI Windows bridge
date: 2026-06-25
time: 18:00
session_id: 2026-06-25-1800
topics: [composio, windows, wsl, skills, documentation]
workspace_paths: [plugin/hbo-plugin/skills/composio, scripts, docs]
status: closed
related: []
---

# Composio CLI Windows bridge

## Summary

Documented Composio CLI installation across platforms (Windows requires WSL; npm `@composio/cli` does not exist). Registered the full `composio` skill in the plugin, added Windows PowerShell wrappers, fixed WSL `~/.profile` PATH for non-interactive shells, and verified `composio whoami` works from PowerShell after setup.

## Done

### Documentation
- Added `docs/COMPOSIO_CLI_INSTALL.md` with Linux, macOS, and Windows (WSL) guides
- Updated `docs/COMPOSIO_CLI_BRIDGE.md`, `docs/SKILLS.md`, public `apps/docs/docs/composio-cli.md`, `skills.md`
- Updated `AGENTS.md` with install doc link

### Plugin skill
- Registered `composio` skill (replaces missing `composio-cli`) in `__init__.py`
- Expanded `plugin/hbo-plugin/skills/composio/` with `platform-install.md`, `hbo-bridge.md`, updated `SKILL.md`, `AGENTS.md`, `composio-cli.md` rule
- Dashboard Setup copy points to `hbo-plugin:composio`

### Windows scripts
- `scripts/setup-composio-windows.ps1` — one-time setup + verify
- `scripts/wsl-composio-profile.sh` — Composio PATH in WSL `~/.profile`
- `scripts/composio.ps1` / `composio.cmd` — forward to `wsl bash -lc "composio …"`
- `scripts/install-composio-windows-path.ps1` — adds `scripts/` to Windows user PATH

### Root cause (Windows)
- Plain `wsl composio` fails: Ubuntu `.bashrc` skips non-interactive shells
- Fix: `~/.profile` PATH + wrapper using `bash -lc`

## Decisions

- **No native Windows Composio** — WSL + PowerShell wrapper is the supported path
- **Skill name `composio`** (not `composio-cli`) — full skill tree lives under `skills/composio/`
- **Do not document `npm install -g @composio/cli`** — package returns 404

## Files changed

- `scripts/setup-composio-windows.ps1`, `composio.ps1`, `composio.cmd`, `wsl-composio-profile.sh`, `install-composio-windows-path.ps1`
- `docs/COMPOSIO_CLI_INSTALL.md`, `docs/COMPOSIO_CLI_BRIDGE.md`, `docs/SKILLS.md`
- `plugin/hbo-plugin/__init__.py`, `plugin/hbo-plugin/skills/composio/**`, `dashboard/src/routes/Setup.tsx`
- `apps/docs/docs/composio-cli.md`, `apps/docs/docs/skills.md`
- `AGENTS.md`

## Open / next

- Other uncommitted repo work (docs site overhaul, dashboard, tests) remains unstaged
- Optional: symlink `~/.composio/composio` → `/usr/local/bin` if user wants bare `wsl composio` without wrapper

## Notes

- User verified `composio` works from a new PowerShell window after setup
- Background `sudo` symlink attempt blocked on password; profile + wrapper used instead
