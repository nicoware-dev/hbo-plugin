---
name: composio-cli
description: Connect HBO Plugin to external tools via the Composio CLI. Use when the user wants real integrations (Sheets, CRM, email) beyond local demo data.
---

# Composio CLI Bridge

Optional bridge from HBO Plugin to external business tools via [Composio CLI](https://composio.dev).

## Prerequisites

```bash
curl -fsSL https://composio.dev/install | bash
composio login
composio whoami
```

## Workflow

1. `composio search "<action>"` — find the right tool
2. `composio link <app>` — connect account if needed
3. `composio execute <TOOL> --data '{...}'` — run the action

## Fallback

If Composio is not configured, use the `local-demo` skill and bundled demo data instead.

## Normalization

When bridging results back into HBO Plugin, map external records to lead/action shapes defined in the technical spec.
