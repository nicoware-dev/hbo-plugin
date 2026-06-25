# Stripe Link CLI

Optional **approved-spending** integration for HBO Plugin.

## Two-layer approval

1. **HBO dashboard** — approve the business action
2. **Stripe Link** — user approves payment credentials for the purchase

## Mock mode (demo)

Action type `mock_approved_spend_request` records the CLI command in the audit log without real charges.

Try it: approve **Approve CRM enrichment purchase** (`act_004`) in the Actions tab.

## Live mode

- Install Stripe Link CLI when available in your region
- Use test mode for demos
- Skill: `hbo-plugin:stripe-link-cli`

## Not required

MVP works fully without Stripe. Region availability may vary.
