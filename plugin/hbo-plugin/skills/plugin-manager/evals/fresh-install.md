# Eval: fresh install

**Input:** Clean Hermes environment, no hbo-plugin.

**Expected agent behavior:**

1. Clone repo or run from existing checkout
2. Execute `./scripts/install-hbo.sh --with-demo`
3. Restart dashboard
4. Run `./scripts/verify-hbo.sh` — all checks pass
5. Report HBO PLUGIN MANAGER REPORT with Install: ok, API health: 200

**Fail if:** Only copies to user plugins without bundled symlink.
