# composio

Composio CLI bridge for HBO Plugin — external apps (Gmail, Sheets, Slack, etc.).

## Requirements

- Composio CLI installed per platform (see `rules/platform-install.md`)
- HBO Plugin with bridge mode `composio` or `hybrid` when using HBO execute path

## Install

Bundled with HBO Plugin as `hbo-plugin:composio`.

Windows: `.\scripts\setup-composio-windows.ps1` from repo root.

## Quick use

`composio search` → `composio link` → HBO approve → `hbo_execute_action`.

## Files

- `SKILL.md` — entrypoint
- `rules/` — detailed references (keep SKILL.md lean)
- `examples/`, `evals/`, `skillopt-benchmark.jsonl`

## Related

- `docs/COMPOSIO_CLI_INSTALL.md`
- `rules/hbo-bridge.md`
