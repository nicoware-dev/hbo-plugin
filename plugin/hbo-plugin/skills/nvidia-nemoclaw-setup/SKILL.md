---
name: nvidia-nemoclaw-setup
description: >-
  Deploy HBO Plugin inside NemoHermes using NemoClaw sandbox and Nemotron
  inference. Use when user asks about NemoClaw, NemoHermes, Nemotron, or
  secure Hermes sandbox deployment for HBO Plugin.
tags: [nvidia, nemoclaw, nemohermes, nemotron, deployment, sandbox, hbo-plugin]
---

## When to Apply

- User wants to run HBO Plugin inside **NemoHermes** / **NemoClaw**
- Hackathon or production path using NVIDIA Nemotron inference
- Questions about sandbox network policy for Composio or Stripe Link CLI

> **Not a business workflow skill.** This guides deployment only. Sales ops, approvals, and workflows remain HBO Plugin core.

## What NemoClaw provides

```text
Hermes Dashboard: port 18789
Hermes OpenAI-compatible API: port 8642
Inference routed via inference.local (credentials stay on host)
```

## Plugin vs skill install

| Type | Install path |
|------|--------------|
| `SKILL.md` only | `skill install` |
| HBO Plugin (Python + dashboard API) | Custom sandbox image — see `deploy/nemoclaw/` |

Do **not** use `skill install` for the full HBO Plugin package.

## Quick start

1. Build custom image from `deploy/nemoclaw/Dockerfile` (copy plugin into Hermes plugin path).
2. `nemohermes onboard --name hbo-demo --from ./deploy/nemoclaw/Dockerfile`
3. Open dashboard → confirm **Business Ops** tab.
4. Select NVIDIA Endpoints / Nemotron as inference provider.

Full guide: repo `docs/NVIDIA_NEMOCLAW.md`

## Network policy

If using Composio CLI or Stripe Link CLI inside sandbox, allow outbound to required endpoints in NemoClaw policy. See `deploy/nemoclaw/policy-notes.md`.

## Verify

```bash
nemohermes status
hermes plugins list
# Open http://localhost:18789 → Business Ops tab
```
