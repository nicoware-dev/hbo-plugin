# growth-playbook

Session and cron guide for the **Growth Agent** Hermes profile.

## Requirements

- HBO Plugin enabled (`hermes plugins enable hbo-plugin`)
- Business Ops Demo workspace loaded (`hbo_load_demo_data` or existing state)
- Optional: Composio bridge for Google Sheets import

## Install

Ships with `profiles/growth-agent/` — install via:

```bash
hermes profile install profiles/growth-agent
```

## Quick use

1. Start Growth Agent profile session
2. Agent loads this playbook + `hbo-plugin:growth-ops`
3. Run `outbound_growth` workflow; approve actions in dashboard

## Files

| Path | Purpose |
|------|---------|
| `SKILL.md` | Agent instructions |
| `examples/` | Input → output scenarios |
| `evals/` | Behavioral verification |
| `skillopt-benchmark.jsonl` | Optimizer holdout tasks |

## Related

- `profiles/growth-agent/cron/` — cron job definitions
- `plugin/hbo-plugin/skills/growth-ops/` — domain skill
