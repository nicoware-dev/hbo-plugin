---
title: Stripe Link CLI
---

# Stripe Link CLI

**Approved-spending** integration for HBO Plugin.

## Two-layer approval

1. **HBO dashboard** — approve the business action
2. **Stripe Link** — user approves payment credentials for the purchase

## Sandbox mode

Action type `mock_approved_spend_request` records the CLI command in the audit log without live charges.

Try it: approve **Approve CRM enrichment purchase** (`act_004`) in the Actions tab.

## Live mode

- Install Stripe Link CLI when available in your region
- Use Stripe test mode before production
- Skill: `hbo-plugin:stripe-link-cli`

## Standalone operation

HBO Plugin runs fully without Stripe. Region availability for Stripe Link CLI may vary.
