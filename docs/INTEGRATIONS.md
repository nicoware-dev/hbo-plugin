# HBO Plugin — Integrations

Extensions beyond the Hermes-native core.

## Core vs integrations

| Layer | Role |
|-------|------|
| HBO Plugin core | Business ops, dashboard, workflows |
| Composio | External bridge (Gmail, Slack, Sheets, CRM) |
| NVIDIA NemoClaw / Nemotron | Secure Hermes runtime + inference path |
| Stripe Link CLI | Approved-spending workflow |

## Composio

- Public docs: `apps/docs/docs/composio-cli.md`
- Skill: `hbo-plugin:composio`

## NVIDIA NemoClaw / Nemotron

- Deployment guide: [NVIDIA_NEMOCLAW.md](NVIDIA_NEMOCLAW.md)
- Skill: `hbo-plugin:nvidia-nemoclaw-setup`
- Deploy folder: `deploy/nemoclaw/`

Framing: *where* HBO Plugin runs securely, not *how* business workflows work.

## Stripe Link CLI

- Guide: [STRIPE_LINK_CLI.md](STRIPE_LINK_CLI.md)
- Skill: `hbo-plugin:stripe-link-cli`
- Sandbox action: `mock_approved_spend_request` (audit without live charges)

## How they fit

```text
HBO Plugin is Hermes-native at the core.
Bridge: Composio for external apps.
Runtime: NemoHermes + NemoClaw + Nemotron deployment path.
Spending: Stripe Link CLI with two-layer approval.
```

Main operating flow: install → dashboard → workflows → approve → audit.

## Public docs

Docusaurus section **Integrations** in `apps/docs`.
