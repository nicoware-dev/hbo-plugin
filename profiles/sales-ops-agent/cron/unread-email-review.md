# Unread Email Review

| Field | Value |
|-------|-------|
| **Name** | unread-email-review |
| **Agent** | Sales Ops Agent |
| **Schedule** | Daily morning (e.g. `0 8 * * 1-5`) |
| **Skills** | `hbo-plugin:sales-ops`, `hbo-plugin:composio` |
| **Bridge** | composio or hybrid |
| **Silent** | Yes — return `[SILENT]` if nothing useful |

## Purpose

Review recent unread or sales-relevant emails through Composio Gmail tools.

## Task

1. Use composio-cli skill to list unread / sales-tagged emails.
2. Summarize threads that need follow-up.
3. Create signals or action proposals for relevant items.
4. If nothing actionable, return `[SILENT]`.

## Expected output

```text
email summary
potential follow-up signals
action proposals if relevant
```

## Enable

```bash
hermes cron add --name unread-email-review --schedule "0 8 * * 1-5" \
  --agent sales-ops --prompt "Run Unread Email Review per profiles/sales-ops-agent/cron/unread-email-review.md"
```

## Test

Ask Sales Ops Agent: "Check my unread sales emails and propose follow-ups."
