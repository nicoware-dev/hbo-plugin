# HBO Plugin — Sponsor Integrations

Optional extensions for hackathon sponsors. **Not required for MVP.**

## Core vs optional

| Layer | Role |
|-------|------|
| HBO Plugin core | Business ops, dashboard, demo, Composio bridge |
| NVIDIA NemoClaw / Nemotron | Secure Hermes runtime + inference path |
| Stripe Link CLI | Optional approved-spending skill |
| Composio | MVP external bridge |

## NVIDIA NemoClaw / Nemotron

- Deployment guide: [NVIDIA_NEMOCLAW.md](NVIDIA_NEMOCLAW.md)
- Skill: `hbo-plugin:nvidia-nemoclaw-setup`
- Deploy folder: `deploy/nemoclaw/`

Framing: *where* HBO Plugin runs securely, not *how* business workflows work.

## Stripe Link CLI

- Guide: [STRIPE_LINK_CLI.md](STRIPE_LINK_CLI.md)
- Skill: `hbo-plugin:stripe-link-cli`
- Mock action: `mock_approved_spend_request` (demo without real account)

## Demo positioning

```text
HBO Plugin is Hermes-native at the core.
Optional NVIDIA path: NemoHermes + NemoClaw + Nemotron.
Optional spending path: Stripe Link CLI with two-layer approval.
MVP bridge: composio-cli skill.
```

Main demo flow unchanged: install → dashboard → workflows → approve → audit.

## Public docs

Docusaurus section **Sponsor Integrations** (planned in `apps/docs`).
