# Restart procedures

## Dashboard (required after install/sync/symlink)

```bash
hermes dashboard --stop
hermes dashboard --no-open
```

Routes and `plugin_api.py` load at dashboard startup — not on plugin enable alone.

## Gateway (only if hbo_* tools missing)

If dashboard API works but chat agent lacks `hbo_get_workspace` etc.:

```bash
hermes gateway restart
# or restart the Hermes session / gateway process per local setup
```

Do not restart gateway for API 404 — fix bundled symlink first.
