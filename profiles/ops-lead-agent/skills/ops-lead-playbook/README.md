# ops-lead-playbook

Session and cron guide for the **Ops Lead Agent** Hermes profile.

## Requirements

- HBO Plugin enabled
- Business Ops Demo workspace

## Install

```bash
hermes profile install profiles/ops-lead-agent
```

## Quick use

1. Start Ops Lead profile session
2. Agent loads this playbook + `hbo-plugin:ops-lead`
3. Generate briefing; guide user to Actions tab for approvals

## Files

| Path | Purpose |
|------|---------|
| `SKILL.md` | Agent instructions |
| `examples/` | Briefing scenarios |
| `evals/` | Verification |
| `skillopt-benchmark.jsonl` | Optimizer tasks |

## Related

- `profiles/ops-lead-agent/cron/` — cron definitions
- `plugin/hbo-plugin/skills/ops-lead/` — domain skill
