---
name: connect-source
description: Onboard a new external data source via Composio — search toolkit, link account, map fields, test import.
---

# Connect New Data Source

Guide the operator to connect an app through Composio and import into HBO leads.

## Prerequisites

- Composio CLI installed (`composio whoami` succeeds)
- Bridge mode `composio` or `hybrid` via `hbo_set_bridge_mode`

## Phases

1. **Discover** — ask which app (Sheets, Gmail, CRM, etc.)
2. **Search** — `composio search "{app}"` for tool slugs
3. **Link** — `composio link {toolkit}` (browser OAuth)
4. **Map** — define column → lead field mapping (see `sources/sheets.py` pattern)
5. **Test** — small import (`hbo_import_leads_from_sheets` for Sheets)
6. **Verify** — `hbo_list_leads` + dashboard Leads page

## Sheets reference mapping

| Column | Lead field |
|--------|------------|
| name | name |
| email | email |
| company | company |
| phone | phone |
| score | score (0–100) |

## Output format

```
SOURCE ONBOARDING
App: {name}
Toolkit: {slug}
Link: {ok|pending}
Test import: {n} leads
Next: enable sales-source-sync cron (Setup)
```

## Sibling skill

Use **composio** for low-level CLI reference; this skill for HBO-specific onboarding flow.
