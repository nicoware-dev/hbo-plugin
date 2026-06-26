# Verify install

## Automated

```bash
./scripts/verify-hbo.sh
```

Checks: user plugin dir, bundled symlink, plugin enabled, optional API health.

## Manual

```bash
hermes plugins list          # hbo-plugin enabled
curl -sf http://127.0.0.1:9119/api/plugins/hbo-plugin/health
curl -sf http://127.0.0.1:9119/api/plugins/hbo-plugin/workspace
```

Open Hermes dashboard → **Business Ops** → Overview should show stat cards and charts.

If health 200 but empty workspace → `hbo_load_demo_data` or Setup → Load demo data.
