---
name: search-leads
description: Search for prospective leads via Composio-connected tools — preview results before import into HBO.
---

# Search Leads

Find prospects externally, preview, then import selected rows into HBO state.

## Prerequisites

- Composio CLI + linked toolkit for the search source
- Operator confirms import scope

## Phases

1. **Scope** — what to search (industry, location, keywords)
2. **Discover tools** — `composio search "{source} search"` (e.g. places, linkedin, web)
3. **Execute** — run chosen tool with safe limits (`max_results` ≤ 20 for demo)
4. **Preview** — show name, company, contact hints; no auto-import
5. **Import** — map to lead shape and `hbo` append via dashboard or `hbo_import_leads_from_sheets` if exported to Sheet

## Lead shape

```json
{
  "name": "...",
  "source": "composio_search",
  "segment": "prospect",
  "score": 50,
  "priority": "medium",
  "status": "new",
  "ownerAgentId": "growth-agent"
}
```

## Output format

```
LEAD SEARCH
Query: {scope}
Results: {n} (preview list)
Imported: {n} | Skipped: {n}
```

## Limits

- No `google_maps.py` adapter in MVP — use Composio search generically
- Operator approves each batch before import
