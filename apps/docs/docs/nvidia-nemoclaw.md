---
title: NVIDIA NemoClaw
---

# NVIDIA NemoClaw / Nemotron

Run HBO Plugin inside **NemoHermes** with **NemoClaw** sandbox and **Nemotron** inference.

## What this provides

- Secure Hermes runtime boundary
- Inference via `inference.local` (credentials on host)
- Recommended deployment path for sandboxed Hermes

## Ports

| Service | Port |
|---------|------|
| Hermes Dashboard | 18789 |
| Hermes OpenAI API | 8642 |

## Install plugin in sandbox

Do **not** use `skill install` for the full HBO Plugin (Python + dashboard API).

```bash
# From repo root — see deploy/nemoclaw/README.md
nemohermes onboard --name hbo-demo --from ./deploy/nemoclaw/Dockerfile
```

## Verify

1. Open `http://localhost:18789` → **Business Ops** tab
2. `hermes plugins list` shows `hbo-plugin`
3. Skill: `hbo-plugin:nvidia-nemoclaw-setup`

## Network policy

Composio or Stripe inside sandbox may need outbound rules — see `deploy/nemoclaw/policy-notes.md`.
