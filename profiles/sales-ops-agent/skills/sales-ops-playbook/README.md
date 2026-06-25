# sales-ops-playbook

Session and cron guide for the **Sales Ops Agent** Hermes profile.

## Requirements

- HBO Plugin enabled
- Business Ops Demo workspace

## Install

```bash
hermes profile install profiles/sales-ops-agent
```

## Quick use

1. Start Sales Ops profile session
2. Agent loads this playbook + `hbo-plugin:sales-ops`
3. Run `inbound_sales`; user approves in dashboard before execute

## Files

| Path | Purpose |
|------|---------|
| `SKILL.md` | Agent instructions |
| `examples/` | Inbound scenarios |
| `evals/` | Verification |
| `skillopt-benchmark.jsonl` | Optimizer tasks |

## Related

- `profiles/sales-ops-agent/cron/` — cron definitions
- `plugin/hbo-plugin/skills/sales-ops/` — domain skill
