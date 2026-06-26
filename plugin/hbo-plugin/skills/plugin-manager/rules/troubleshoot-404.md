# Troubleshoot API 404

## Symptoms

- Business Ops tab appears in Hermes dashboard sidebar
- Overview shows "Dashboard API not mounted" or fetch errors
- `curl http://127.0.0.1:9119/api/plugins/hbo-plugin/health` → 404

## Cause

Hermes 0.17+ refuses `plugin_api.py` for plugins with `source=user`. Dashboard UI loads from manifest; Python backend does not mount.

## Fix

```bash
./scripts/install-hbo.sh
# or ./scripts/sync-plugin.sh if plugin already copied
hermes dashboard --stop && hermes dashboard --no-open
curl http://127.0.0.1:9119/api/plugins/hbo-plugin/health
```

Manual symlink (Unix):

```bash
ln -sfn ~/.hermes/plugins/hbo-plugin ~/.hermes/hermes-agent/plugins/hbo-plugin
```

Windows: run `.\scripts\sync-plugin.cmd` (creates junction/symlink automatically).
