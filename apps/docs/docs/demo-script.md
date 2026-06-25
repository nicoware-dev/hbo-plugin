---
sidebar_position: 3
title: Demo script
---

# Demo script

Short guide for recording or presenting the Business Ops Demo.

## Canonical flow (3 minutes)

1. Open docs → copy [install prompt](./install)
2. Install plugin + three profiles
3. Open **Business Ops** tab → Overview
4. Reset demo from **Setup**
5. Run workflows: Inbound Sales → Outbound Growth → Daily Ops Briefing
6. **Approve** one action (no external side effects in `local-demo` mode)
7. Show **Audit** log
8. Optional: **Tool Bridges** / Composio

## Reset between takes

```bash
./scripts/demo-reset.sh
```

On Windows: `.\scripts\demo-reset.ps1`

Then restart the Hermes dashboard.

## Full script

Contributor doc with step-by-step narration:

[docs/DEMO_SCRIPT.md](https://github.com/nicoware-dev/hbo-plugin/blob/main/docs/DEMO_SCRIPT.md)
