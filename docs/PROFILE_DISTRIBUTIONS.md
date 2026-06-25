# Profile Distributions

Three profiles in `profiles/`:

| Directory | Agent | Role |
|-----------|-------|------|
| `sales-ops-agent/` | Sales Ops Agent | Inbound sales |
| `growth-agent/` | Growth Agent | Outbound growth |
| `ops-lead-agent/` | Ops Lead Agent | Ops leadership |

## Required files

- `distribution.yaml` — manifest (`name`, `version`, …)
- `SOUL.md` — agent personality and instructions
- `config.yaml` — model, tools, plugins, skills
- `skills/` — optional profile-specific skills
- `cron/` — optional scheduled tasks

## Install

```bash
hermes profile install ./profiles/sales-ops-agent --alias sales-ops
hermes profile install ./profiles/growth-agent --alias growth
hermes profile install ./profiles/ops-lead-agent --alias ops-lead
```

Local paths and git URLs are supported by Hermes profile install.
