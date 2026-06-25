# Example: Import leads from Google Sheets via HBO

## User

"Import prospects from Google Sheets into HBO."

## Steps

1. Verify platform — Windows → WSL setup script if needed
2. `composio link googlesheets --no-wait` if not connected
3. Propose import via `hbo_import_leads_from_sheets` or equivalent HBO tool
4. User approves in dashboard
5. `hbo_execute_action` after approval

## Output

```text
COMPOSIO REPORT
- Platform: windows
- Auth: ok
- Toolkit: googlesheets
- HBO bridge: composio
- Next: approve action act_008 before execute
```

Agent does not run `composio execute` directly if HBO tool path exists.
