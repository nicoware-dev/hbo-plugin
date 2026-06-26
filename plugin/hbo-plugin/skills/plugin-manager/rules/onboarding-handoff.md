# Onboarding handoff

**Requires an interactive Hermes chat session** — not part of headless install.

After install verify passes (API health 200):

1. Load demo data if needed: `./scripts/install-hbo.sh --with-demo` or `hbo_load_demo_data`
2. Load skill **local-demo** — run a workflow, approve an action
3. Load skill **demo-tour** — walk dashboard pages with user
4. Later: **health-check** for ongoing workspace audits

Suggested **demo/QA prompt** (interactive session only):

```text
HBO Plugin is installed. Load local-demo and demo-tour, run daily_ops_briefing,
show the action queue, and approve one action.
```
