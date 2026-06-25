---
name: stripe-link-cli
description: >-
  Optional approved-spending via Stripe Link CLI. Use when user wants purchase
  approvals, spend requests, or mock approved spend demos in HBO Plugin.
tags: [stripe, link-cli, payments, approvals, spending, hbo-plugin, optional]
---

## When to Apply

- User wants **approved purchase** workflows (software, subscriptions, enrichment)
- Demo of two-layer approval: HBO action → Stripe Link spend request
- **Optional** — MVP works without Stripe Link CLI

> Stripe Link availability may be region-limited. Use `mock_approved_spend_request` action type when CLI is unavailable.

## Two-layer approval

```text
1. HBO dashboard: approve business action
2. Stripe Link: user approves spend credentials for purchase
```

## Install (when available)

```bash
# See docs/STRIPE_LINK_CLI.md for platform-specific install
stripe link --help
```

Use **test mode** for demos.

## HBO Plugin integration

Actions with `actionType: mock_approved_spend_request` run in mock mode on approve:

- Audit log records expected CLI command
- No real payment credentials used

For live mode (future): set `actionType` and configure Stripe Link after HBO approval.

## Safety

- Never store payment credentials in HBO state
- Record all spend attempts in audit log
- Disable skill when Stripe Link is not installed

Full guide: repo `docs/STRIPE_LINK_CLI.md`
