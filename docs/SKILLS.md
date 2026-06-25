# Skills

Bundled plugin skills in `plugin/hbo-plugin/skills/`:

| Skill | Namespace | Purpose |
|-------|-----------|---------|
| sales-ops | `hbo-plugin:sales-ops` | Inbound sales workflows |
| growth-ops | `hbo-plugin:growth-ops` | Outbound growth workflows |
| ops-lead | `hbo-plugin:ops-lead` | Daily briefing and coordination |
| local-demo | `hbo-plugin:local-demo` | Demo without external credentials |
| composio | `hbo-plugin:composio` | Optional Composio bridge — install: `docs/COMPOSIO_CLI_INSTALL.md`, rules in `skills/composio/rules/` |

Registered in `__init__.py` via `ctx.register_skill(name, path)`.

Profiles reference skills in `config.yaml` under `skills:`.
