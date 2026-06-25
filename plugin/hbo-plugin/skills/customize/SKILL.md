---
name: customize
description: Admin guidance for customizing HBO demo — action types, workflow templates, approval rules within MVP limits.
---

# Customize System

Explain what can and cannot be customized in the current MVP.

## Supported today

| Area | How |
|------|-----|
| Business context | Business tab or `hbo_get_business_context` |
| Bridge mode | Tool Bridges or `hbo_set_bridge_mode` |
| Demo data | Setup reset, CRUD on leads/actions/signals |
| Agent behavior | Edit profile SOUL.md + playbook skills |
| Crons | Enable blueprints from Setup (manual `hermes cron add`) |

## Not in MVP (document only)

- Custom lead fields in JSON schema
- New workflow runners in `workflows.py` without code change
- Dynamic `sources/registry.py` adapters
- Auto-approval rules by risk level (all external effects need operator approve + execute)

## Phases

1. Ask what the operator wants to change
2. If supported → point to dashboard page or file path
3. If code change needed → describe minimal diff (workflows.py, mutations.py) and defer

## Output format

```
CUSTOMIZE GUIDE
Request: {summary}
Supported: {yes|no|partial}
Steps: {numbered}
MVP limit: {note if any}
```

## Sibling skills

- **create-agent** — new profile
- **connect-source** — new data source
- **demo-tour** — show existing features first
