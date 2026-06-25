# Stripe Link CLI (Optional)

Approved-spending integration for HBO Plugin. **Not required for MVP.**

## Role

Hermes proposes purchase-related actions; user approves in HBO dashboard; Stripe Link CLI creates spend requests with separate payment approval.

## Two-layer approval

1. **HBO:** Should this business action run?
2. **Stripe Link:** Should payment credentials be issued?

## Mock mode (default demo)

Create an action with:

```json
{
  "actionType": "mock_approved_spend_request",
  "title": "Approve CRM enrichment purchase",
  "spendAmount": "49.00",
  "spendCurrency": "usd"
}
```

On approve, audit log records the CLI command that *would* run — no real charges.

## Live mode (when available)

- Install Stripe Link CLI per [Stripe docs](https://stripe.com/docs)
- Use test mode for demos
- Region availability may vary — document fallback to mock

## Skill

`hbo-plugin:stripe-link-cli` — install, auth, spend request flow, audit recording.

## Safety

- Never store card or Link credentials in HBO JSON state
- Always write audit events for spend attempts
- MVP must work with skill disabled
