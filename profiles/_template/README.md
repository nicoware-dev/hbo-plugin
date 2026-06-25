# Custom Agent Template

Copy `profiles/_template/` to a new directory, then:

1. Edit `distribution.yaml` name and description
2. Edit `SOUL.md` for role, workflows, and handoffs
3. Add optional `skills/` and `cron/` blueprints
4. Install: `hermes profile install ./profiles/your-agent --alias your-alias`

See plugin skill `hbo-plugin:create-agent` for guided setup.
