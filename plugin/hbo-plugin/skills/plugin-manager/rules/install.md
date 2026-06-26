# Install paths

## Full system (recommended)

From cloned repo:

```bash
./scripts/install-hbo.sh --with-demo
hermes dashboard --stop && hermes dashboard --no-open
./scripts/verify-hbo.sh
```

Windows: `.\scripts\install-hbo.ps1 -WithDemo`

## Dev sync only

After code changes:

```bash
./scripts/sync-plugin.sh   # includes bundled symlink
hermes dashboard --stop && hermes dashboard --no-open
```

## Plugin via Hermes CLI (no local checkout)

```bash
hermes plugins install nicoware-dev/hbo-plugin/plugin/hbo-plugin --enable --force
# Still run symlink step — install-hbo.sh or sync-plugin.sh from a clone for profiles
```

Profiles require local paths or separate git repos — use install script from monorepo clone.
