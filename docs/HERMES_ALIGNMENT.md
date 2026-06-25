# Hermes Alignment — HBO Plugin

How HBO Plugin follows [Hermes Agent](https://hermes-agent.nousresearch.com/) conventions.

---

## 1. Why HBO Plugin is Hermes-native

HBO Plugin is not a standalone SaaS app. It ships as:

- A Hermes **plugin** (`plugin/hbo-plugin/`) with `hbo_*` tools and bundled skills
- A **dashboard extension** (Business Ops tab)
- Three **profile distributions** under `profiles/`
- Local **demo state** (no external credentials required for first run)

Everything installs through Hermes CLI and runs inside the Hermes runtime.

---

## 2. Plugin manifest and `register(ctx)`

| File | Role |
|------|------|
| `plugin/hbo-plugin/plugin.yaml` | Declares name, version, tools, dashboard path |
| `plugin/hbo-plugin/__init__.py` | `register(ctx)` registers 18 tools + 7 skills |

Tools use the `hbo_` prefix. Skills register from `plugin/hbo-plugin/skills/<name>/SKILL.md` and appear in Hermes as `hbo-plugin:<name>`.

---

## 3. Dashboard extension architecture

```text
plugin/hbo-plugin/dashboard/
  manifest.json     → tab label, route, bundle paths
  src/              → React (Vite → IIFE)
  dist/index.js     → loaded by Hermes at runtime
  dist/style.css
  plugin_api.py     → FastAPI router
```

The UI bundle uses `window.__HERMES_PLUGIN_SDK__` for React and shadcn-style components. Do not bundle React inside the IIFE.

Build: `pnpm build:dashboard` from repo root.

---

## 4. Backend `plugin_api.py` route loading

Routes mount at `/api/plugins/hbo-plugin/` when the Hermes **dashboard process starts**.

Hermes loads `plugin_api.py` via importlib as a **standalone module** (not as `hbo_plugin.dashboard.plugin_api`). Imports inside that file must bootstrap sibling modules from the plugin root — see `_load_plugin_modules()` in the file.

**Important:** After installing or updating the plugin, **restart the Hermes dashboard** so routes reload.

---

## 5. Profile distributions

Each profile under `profiles/<name>/` has:

- `distribution.yaml` — Hermes profile manifest
- `SOUL.md` — agent identity
- `config.yaml` — runtime config
- Optional `skills/` and `cron/` for profile-local guidance

Install:

```bash
hermes profile install ./profiles/sales-ops-agent --alias sales-ops
```

---

## 6. Skills

Bundled plugin skills (7):

```text
sales-ops, growth-ops, ops-lead, local-demo, composio,
nvidia-nemoclaw-setup, stripe-link-cli
```

Agents load them with `skill_view` / `hbo-plugin:<skill-name>`.

Profile-local playbooks live in `profiles/*/skills/*/SKILL.md` and complement plugin skills.

---

## 7. Crons

Cron blueprints are **documentation + prompts** in `profiles/*/cron/*.md`. They are **not auto-enabled**.

The plugin exposes a recommended catalog via `GET /api/plugins/hbo-plugin/automations` and the Setup dashboard page. Operators enable crons manually in Hermes after review.

---

## 8. Install path requirements

| Path | Dashboard API | Plugin tools |
|------|---------------|--------------|
| `~/.hermes/plugins/hbo-plugin` | Yes | Yes |
| `%LOCALAPPDATA%\hermes\plugins\hbo-plugin` (Windows) | Yes | Yes |
| Project `.hermes/plugins/` | UI only — API blocked | Limited |

```bash
hermes plugins enable hbo-plugin
```

Sync during development: `scripts/sync-plugin.sh` (bash) or `scripts/sync-plugin.cmd` (Windows).

---

## 9. Known Hermes dashboard constraints

- **No `TabsContent`** in the plugin SDK — using Radix tabs without content crashes React. HBO uses **button-based nav** in `dashboard/src/index.tsx`.
- **Hard refresh** after dashboard rebuild (`Ctrl+Shift+R`) if the tab shows stale UI.
- **dist/ must exist** — run `pnpm build:dashboard` before release; `prepare` script builds on `pnpm install`.

---

## 10. NemoClaw notes

NVIDIA NemoClaw is an **optional deployment path**, not a business workflow.

- Plugin vs skill install: see `docs/NVIDIA_NEMOCLAW.md`
- Setup skill: `hbo-plugin:nvidia-nemoclaw-setup`
- Deploy stub: `deploy/nemoclaw/`

---

## Related docs

- [Technical spec](./TECHNICAL_SPEC.md)
- [Demo script](./DEMO_SCRIPT.md)
- [Project status](./PROJECT_STATUS.md)
