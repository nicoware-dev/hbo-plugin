# Onboarding handoff

After verify passes (API health 200):

1. Load demo data if needed: `./scripts/install-hbo.sh --with-demo` or `hbo_load_demo_data`
2. Load skill **local-demo** — run a workflow, approve an action
3. Load skill **demo-tour** — walk dashboard pages with user
4. Later: **health-check** for ongoing workspace audits

Suggested agent prompt after install:

```text
Load hbo-plugin:plugin-manager, verify install, restart dashboard if needed,
then hand off to local-demo and demo-tour.
```
