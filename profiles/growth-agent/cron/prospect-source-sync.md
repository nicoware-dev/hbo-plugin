# Prospect Source Sync

| Field | Value |
|-------|-------|
| **Name** | prospect-source-sync |
| **Agent** | Growth Agent |
| **Schedule** | Daily or weekly (e.g. `0 6 * * 1`) |
| **Skills** | `hbo-plugin:growth-ops`, `hbo-plugin:composio` |
| **Bridge** | composio or hybrid |
| **Silent** | No |

## Purpose

Sync prospect lists from Google Sheets or Google Places-style sources via Composio.

## Task

1. Fetch prospect rows from configured sheet or search tool.
2. Normalize → append leads with `growth-agent` owner.
3. Flag lead scoring candidates.
4. Write `source_sync` audit event.

## Expected output

```text
new prospects count
updated prospect status
lead scoring candidates
source sync audit event
```

## Enable

```bash
hermes cron add --name prospect-source-sync --schedule "0 6 * * 1" \
  --agent growth --prompt "Run Prospect Source Sync per profiles/growth-agent/cron/prospect-source-sync.md"
```

## Test

Run `outbound_growth` workflow, then verify new leads in dashboard.
