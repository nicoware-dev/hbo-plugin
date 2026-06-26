---
name: plugin-manager
description: Install, sync, troubleshoot, and verify HBO Plugin infrastructure — bundled symlink, dashboard restart, profiles, and onboarding handoff.
---

# HBO Plugin Manager

Infrastructure lifecycle for HBO Plugin: install, sync, repair API 404, restart dashboard, verify health, hand off to demo skills.

> **Not business health.** Workspace audits → **health-check**. Product tour → **demo-tour**.

## Contract

- Delegate install/repair to `./scripts/install-hbo.sh` — do not reimplement steps manually
- Bundled symlink under `hermes-agent/plugins/hbo-plugin` is **required** for dashboard API (Hermes 0.17+)
- Always restart dashboard after sync, symlink, or enable
- Cold install: clone repo + run install script before this skill is registered

## When to Apply

- Fresh HBO install or hackathon onboarding
- Business Ops tab visible but Overview shows no data / API 404
- After `sync-plugin` or plugin code changes
- User asks to fix HBO install, sync plugin, or restart dashboard

## When to Skip

- Business workflow issues with working dashboard → domain skills
- Workspace audit (stale signals, pending actions) → **health-check**
- Guided product tour → **demo-tour**
- Composio bridge setup → **composio**

## Phases

1. **Diagnose** — `hermes plugins list`; `./scripts/verify-hbo.sh`; curl `/api/plugins/hbo-plugin/health`
2. **Install/Repair** — `./scripts/install-hbo.sh [--with-demo]` from repo root (see [rules/install.md](rules/install.md))
3. **Restart dashboard** — `hermes dashboard --stop && hermes dashboard --no-open` (see [rules/restart.md](rules/restart.md))
4. **Verify** — `./scripts/verify-hbo.sh`; confirm HTTP 200 on `/health` (see [rules/verify.md](rules/verify.md))
5. **Onboarding handoff** (interactive session only, post-install) — **local-demo** + **demo-tour** (see [rules/onboarding-handoff.md](rules/onboarding-handoff.md))

## Troubleshooting 404

Tab loads but API returns 404 → bundled symlink missing. See [rules/troubleshoot-404.md](rules/troubleshoot-404.md).

## Output Format

```
HBO PLUGIN MANAGER REPORT
Install: ok | repaired | failed
Symlink bundled: present | created | missing
Plugin enabled: yes | no
Dashboard restarted: yes | pending
API health: 200 | 404 | unreachable
Profiles: sales-ops-agent, growth-agent, ops-lead-agent | partial | none
Next: demo-tour | health-check | fix {issue}
```

## Anti-Patterns

| Don't | Why |
|-------|-----|
| Manual copy-only to user plugins | API still 404 without bundled symlink |
| Skip dashboard restart | Routes do not hot-reload |
| Use **health-check** for install bugs | That skill audits workspace data |
| `hermes plugins enable` alone for 404 | Symlink is the fix |

## vs sibling skills

| Skill | Use for |
|-------|---------|
| **plugin-manager** (this) | Install, sync, infra repair |
| **local-demo** | Demo data + workflows |
| **demo-tour** | UI walkthrough |
| **health-check** | Business workspace audit |
