# Sales Source Sync

| Field | Value |
|-------|-------|
| **Name** | sales-source-sync |
| **Agent** | Sales Ops Agent |
| **Schedule** | Daily (e.g. `0 7 * * *`) |
| **Skills** | `hbo-plugin:sales-ops`, `hbo-plugin:local-demo`, `hbo-plugin:composio` (optional) |
| **Bridge** | composio or hybrid |
| **Silent** | No — always writes audit event |

## Purpose

Sync inbound sales data from configured sources into HBO Plugin state.

## Data sources

- Google Sheets (primary MVP)
- Gmail (conversation metadata)
- HubSpot (future)
- Local demo data (fallback)

## Task

1. Check bridge mode; if `local-demo`, skip external fetch.
2. If Composio available, import leads from configured spreadsheet via `hbo_import_leads_from_sheets`.
3. Normalize rows → `state.append_lead()`.
4. Write `source_sync` audit event.
5. Optionally create sales signals for new high-priority leads.

## Expected output

```text
new or updated leads count
source sync audit event
optional sales signals
```

## Enable

```bash
hermes cron add --name sales-source-sync --schedule "0 7 * * *" \
  --agent sales-ops --prompt "Run Sales Source Sync per profiles/sales-ops-agent/cron/sales-source-sync.md"
```

Review the prompt before enabling. Crons are **recommended**, not auto-enabled.

## Test

```bash
hbo_import_leads_from_sheets spreadsheetId=<id>
hbo_get_workspace
```
