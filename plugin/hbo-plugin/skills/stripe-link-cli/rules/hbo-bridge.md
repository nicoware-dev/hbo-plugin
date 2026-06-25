---
title: HBO Plugin — Stripe Link Bridge
impact: HIGH
description: Two-layer approval, mock demo, and live path (documentation only)
tags: [hbo-plugin, stripe, link-cli, approvals, optional]
---

# HBO Plugin — Stripe Link Bridge

Stripe Link CLI is **optional** for HBO Plugin. The Business Ops Demo runs fully on local JSON state without Link.

## When to use Link vs mock

| Situation | Use |
|-----------|-----|
| First run, no Link CLI, demo only | HBO mock action — no Link install needed |
| User wants real purchase credentials | [Create Payment Credential](create-payment-credential.md) after HBO approval |
| Link not installed or US account unavailable | Stay on mock; explain install + region limits |
| User says "buy", "pay", "checkout" with HBO context | HBO approval first, then Link CLI |

## Two-layer approval

```text
1. HBO dashboard: approve the business action (hbo_approve_action)
2. Stripe Link: user approves spend credentials in the Link app
```

Never skip HBO approval for gated business actions. Link CLI handles payment credentials only — not HBO workflow state.

## Mock demo (default MVP)

Demo action `mock_approved_spend_request` (e.g. **Approve CRM enrichment purchase**, `act_004`):

- User approves in HBO Actions tab
- Audit log records that a Link spend request *would* be created
- No real payment credentials issued

Agents should describe this as sandbox/mock when Link CLI is not installed.

## Live path (documentation only)

When Link CLI is installed and the user has a US Link account:

1. Complete HBO approval for the purchase action
2. Follow [Create Payment Credential](create-payment-credential.md) — auth → merchant eval → spend request → payment
3. Use `--test` on `spend-request create` for development and integration testing
4. Record outcome via `link-cli report` (optional; agent-only)

Do not store card numbers, SPTs, or Link auth tokens in HBO JSON state.

## Safety

- Mask card numbers and addresses in chat unless the user requests full details
- Use `--output-file` on `spend-request retrieve` to avoid leaking credentials into transcripts
- Write HBO audit events for spend attempts when using plugin tools
- Respect `/agents.txt` and `/llm.txt` on merchant sites

## Related docs

- Repo `docs/STRIPE_LINK_CLI.md` — contributor overview
- [Errors & limits](errors-limits.md) — limits, recovery, reporting
- Upstream: [stripe/link-cli](https://github.com/stripe/link-cli) `skills/create-payment-credential/SKILL.md`
