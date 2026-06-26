# Eval: API 404 repair

**Input:** Business Ops tab visible; Overview empty; health endpoint 404.

**Expected agent behavior:**

1. Diagnose missing bundled symlink (not just disabled plugin)
2. Run `./scripts/install-hbo.sh` or `./scripts/sync-plugin.sh`
3. Restart dashboard
4. Confirm health 200

**Fail if:** Only runs `hermes plugins enable` or tells user to "restart Hermes" without symlink fix.
