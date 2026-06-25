# Plugin Architecture

HBO Plugin core package: `plugin/hbo-plugin/`

## Layers

| Layer | Files | Responsibility |
|-------|-------|----------------|
| Manifest | `plugin.yaml` | Plugin metadata |
| Registration | `__init__.py` | `register(ctx)` — tools + skills |
| Tools | `tools.py`, `schemas.py` | `hbo_*` tool handlers |
| State | `state.py` | File-backed JSON in `data/business-ops-demo/` |
| Rules | `business_rules.py` | Workflows, approvals, briefings |
| Skills | `skills/*/` | Bundled agent skills |
| Dashboard | `dashboard/` | UI extension + `plugin_api.py` |

## State flow

```text
Tool call / API route → business_rules → state.py → JSON files
```

See `TECHNICAL_SPEC.md` for tool contracts and data shapes.
