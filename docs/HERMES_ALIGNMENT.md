# Hermes Alignment Review

Review of HBO Plugin scaffold against **Hermes Agent** source and docs.  
Reference copy: `_temp/hermes-agent-main/` (plugins, `website/docs/`, `hermes_cli/`).

**Org/repo:** [nicoware-dev/hbo-plugin](https://github.com/nicoware-dev/hbo-plugin)

---

## Summary

| Area | Alignment | Action taken |
|------|-----------|--------------|
| Plugin layout | Aligned | `plugin.yaml` + `__init__.py` + `register(ctx)` |
| Tool registration | Aligned | `ctx.register_tool(name, toolset, schema, handler)` |
| Skill registration | **Was wrong** | Fixed: pass path to `SKILL.md`, not skill directory |
| `plugin.yaml` manifest | Improved | Added `provides_tools` list |
| Dashboard `manifest.json` | Aligned | Matches kanban / hermes-achievements pattern |
| `plugin_api.py` | **Was wrong** | Fixed: no relative imports; load sibling modules via importlib |
| Dashboard JS bundle | Improved | SDK guard before `register()` |
| Profile `config.yaml` | **Was wrong** | Fixed: use `model` + `platform_toolsets` (Hermes format) |
| Profile `distribution.yaml` | Aligned | Standard manifest fields |
| Project-local install | Documented | API routes blocked for `.hermes/plugins/` |

---

## Plugin structure (Hermes convention)

Hermes expects:

```text
~/.hermes/plugins/hbo-plugin/
  plugin.yaml
  __init__.py          # register(ctx)
  tools.py / schemas.py
  skills/<name>/SKILL.md
  dashboard/
    manifest.json
    dist/index.js
    plugin_api.py      # exposes `router`
```

**Source:** `website/docs/guides/build-a-hermes-plugin.md`, bundled plugins under `plugins/`.

Our layout matches. Install target: copy `plugin/hbo-plugin/` to `~/.hermes/plugins/hbo-plugin/`.

### Opt-in loading

Plugins are **disabled until enabled**:

```bash
hermes plugins enable hbo-plugin
```

Or in `~/.hermes/config.yaml`:

```yaml
plugins:
  enabled:
    - hbo-plugin
```

**Source:** `website/docs/user-guide/features/plugins.md`

---

## Tools

### Registration

Hermes pattern (calculator example):

```python
ctx.register_tool(
    name="calculate",
    toolset="calculator",
    schema=schemas.CALCULATE,
    handler=tools.calculate,
)
```

We use `toolset="hbo"` for all `hbo_*` tools. Profiles include `hbo` in `platform_toolsets.cli`.

### Handler contract

- Signature: `handler(params: dict, **kwargs) -> str`
- Return JSON string; do not raise on user errors

Our handlers comply via `_json_response()` wrappers.

### Manifest

`plugin.yaml` should declare tools:

```yaml
provides_tools:
  - hbo_get_workspace
  # ...
```

Added in scaffold fix.

---

## Skills

### Correct registration

Hermes `register_skill(name, path)` expects **`path` = SKILL.md file**:

```python
ctx.register_skill("my-skill", skill_md_path)  # NOT the directory
```

Qualified name at runtime: `hbo-plugin:sales-ops` → use `skill_view("hbo-plugin:sales-ops")`.

**Source:** `hermes_cli/plugins.py`, `tests/test_plugin_skills.py`, build-a-hermes-plugin guide.

### Fix applied

```python
# Before (wrong)
ctx.register_skill(skill_name, str(skill_path))

# After (correct)
ctx.register_skill(skill_name, SKILLS_DIR / skill_name / "SKILL.md")
```

Plugin skills are **read-only** and **not** in the system prompt index — agent must load explicitly.

---

## Dashboard extension

### manifest.json

Aligned with `plugins/kanban/dashboard/manifest.json`:

| Field | HBO value |
|-------|-----------|
| `name` | `hbo-plugin` |
| `label` | `Business Ops` |
| `tab.path` | `/business-ops` |
| `tab.position` | `after:skills` |
| `entry` | `dist/index.js` |
| `api` | `plugin_api.py` |

### JS bundle (IIFE)

- No bundled React — use `window.__HERMES_PLUGIN_SDK__`
- Register: `window.__HERMES_PLUGINS__.register("hbo-plugin", Component)`
- API calls: `SDK.fetchJSON("/api/plugins/hbo-plugin/...")` (auth handled by SDK)

**Source:** `website/docs/user-guide/features/extending-the-dashboard.md`, `plugins/hermes-achievements/dashboard/dist/index.js`

### plugin_api.py

Hermes loads the file via `importlib.util.spec_from_file_location` — **not** as `plugin.hbo_plugin.dashboard.plugin_api`. Relative imports like `from ..state` **fail**.

**Fix:** load `state.py` and `business_rules.py` from plugin root with importlib (same pattern as kanban tests).

Must expose module-level:

```python
router = APIRouter()
```

Routes mount at `/api/plugins/hbo-plugin/`.

### Security: project plugins

If installed under `.hermes/plugins/` (project-local), Hermes **does not import** `plugin_api.py` — UI works, backend API does not.

**Source:** `hermes_cli/web_server.py` → `_mount_plugin_api_routes()`

**Recommendation:** install to `~/.hermes/plugins/hbo-plugin` for development, or set `HERMES_ENABLE_PROJECT_PLUGINS=true` only for trusted repos and accept API limitation.

---

## Profile distributions

### Required files

| File | Purpose |
|------|---------|
| `distribution.yaml` | Manifest (`name`, `version`, …) |
| `SOUL.md` | Agent personality |
| `config.yaml` | Hermes config (model, toolsets) |
| `skills/`, `cron/` | Optional bundled assets |

### config.yaml fix

**Before (invalid):**

```yaml
tools:
  enabled_toolsets: [hbo]
plugins:
  enabled: [hbo-plugin]
skills: [hbo-plugin:sales-ops]
```

**After (valid):**

```yaml
model:
  temperature: 0.3

platform_toolsets:
  cli: [hermes-cli, hbo]
```

Plugin enablement stays in **global** `~/.hermes/config.yaml`. Skills referenced in SOUL via `skill_view("hbo-plugin:…")`.

**Source:** `cli-config.yaml.example`, `website/docs/user-guide/profile-distributions.md`

### Install command

```bash
hermes profile install ./profiles/sales-ops-agent --alias sales-ops
```

Supports local paths and git URLs.

---

## Comparison with bundled examples

| Example | What we borrowed |
|---------|------------------|
| `plugins/kanban/` | Dashboard manifest, `plugin_api.py` + `router`, API prefix |
| `plugins/hermes-achievements/` | IIFE bundle structure, SDK guard, `fetchJSON` for API |
| `plugins/disk-cleanup/` | `plugin.yaml` with hooks (we don't use hooks yet) |
| Calculator (docs) | `schemas.py` + `tools.py` + `register()` split |

---

## Remaining alignment work

1. **Tests** — add `tests/` that load `plugin_api.py` like `tests/plugins/test_kanban_dashboard_plugin.py`
2. **Workflow depth** — match spec outputs for inbound_sales / outbound_growth / daily_ops_briefing
3. **Dashboard refresh** — replace full page reload with state refetch
4. **Optional hooks** — `post_tool_call` for audit on tool use
5. **pip distribution** — `[project.entry-points."hermes_agent.plugins"]` if we want `pip install hbo-plugin` later

---

## Useful Hermes doc paths (in reference tree)

```text
_temp/hermes-agent-main/
  website/docs/guides/build-a-hermes-plugin.md
  website/docs/user-guide/features/plugins.md
  website/docs/user-guide/features/extending-the-dashboard.md
  website/docs/user-guide/profile-distributions.md
  plugins/kanban/dashboard/
  plugins/hermes-achievements/dashboard/
  hermes_cli/web_server.py          # plugin API mounting
  hermes_cli/plugins.py             # register_tool, register_skill
```
