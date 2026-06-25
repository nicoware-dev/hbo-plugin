# HBO Plugin on NVIDIA NemoHermes / NemoClaw

Run HBO Plugin inside a **NemoClaw-managed Hermes sandbox** with **Nemotron** inference.

## What this is

| Component | Role |
|-----------|------|
| NemoHermes | Hermes runtime in sandbox |
| NemoClaw | Sandbox boundary + network policy |
| Nemotron | Recommended inference via `inference.local` |
| HBO Plugin | Business Ops tab, tools, demo state |

## Ports

```text
Hermes Dashboard:  http://localhost:18789
Hermes OpenAI API: http://localhost:8642
```

Credentials stay on the host; sandbox uses `inference.local`.

## Install HBO Plugin in sandbox

**Do not** `skill install` the full plugin — use custom image:

```bash
# From repo root
nemohermes onboard --name hbo-demo --from ./deploy/nemoclaw/Dockerfile
```

See `deploy/nemoclaw/README.md` for build steps.

## Verify

1. Open dashboard → **Business Ops** tab
2. `hermes plugins list` → `hbo-plugin` enabled
3. Run `hbo_get_workspace` or open Overview

## Network policy

Composio CLI and Stripe Link CLI may need outbound access. See `deploy/nemoclaw/policy-notes.md`.

## MVP vs optional

| Must | Optional |
|------|----------|
| Standard Hermes install | NemoClaw Dockerfile |
| Local demo + Composio | Custom network automation |

Skill: `hbo-plugin:nvidia-nemoclaw-setup`
