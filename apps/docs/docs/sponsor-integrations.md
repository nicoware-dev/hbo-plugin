# Sponsor Integrations

HBO Plugin is **Hermes-native at the core**. Sponsor integrations are optional extensions — not required for the MVP demo.

## Overview

| Integration | Role | Required? |
|-------------|------|-----------|
| [Composio CLI](./composio-cli) | MVP external bridge (Sheets, Gmail) | Optional for first run |
| [NVIDIA NemoClaw](./sponsor-nvidia-nemoclaw) | Secure Hermes runtime + Nemotron | Optional |
| [Stripe Link CLI](./sponsor-stripe-link) | Approved spending skill | Optional |

## Demo positioning

```text
Core: install → dashboard → workflows → approve → audit
Bridge: composio-cli for real data
Optional: NemoHermes deployment path, Stripe mock spend action
```

## Mock Stripe in dashboard

Approve action `act_004` (CRM enrichment purchase) to see mock Stripe Link CLI audit output without a real account.

## Contributor docs

Detailed notes live in the repo under `docs/SPONSOR_INTEGRATIONS.md`.
