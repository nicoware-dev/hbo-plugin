---
title: Link CLI — Limits, Errors, Reporting
impact: MEDIUM
description: Spend limits, common errors, outcome reporting, further docs
tags: [stripe, link-cli, errors, limits, reporting]
upstream_version: 0.7.2
---

# Limits

| Limit | Value |
|-------|-------|
| Max amount per spend request | $5,000 (500,000 cents) |
| Approval window | 10 minutes — user must approve within 10 min of `spend-request request-approval` |
| Card / SPT validity (`valid_until`) | 12 hours from spend request creation |
| Daily spend per account | $5,000 |
| Monthly spend per account (30 days) | $20,000 |
| Concurrent active requests (created + approved) | 30 |
| Concurrent approved requests | 10 |
| Hourly creation rate | 50 per hour |
| Rolling creation rate | 200 per 60 days |

If a spend request is created but approval is not requested within the window, or the user does not approve within 10 minutes, the request expires. Create a new one. Do not poll indefinitely — if the approval window is nearly exhausted and the user hasn't responded, surface this to the user.

# Errors

All errors are output as JSON with `code` and `message` fields, with exit code 1.

## Common errors and recovery

| Error / Symptom | Cause | Recovery |
|---|---|---|
| `verification-failed` in error body from `mpp pay` | SPT was already consumed (one-time use) | Create a new spend request with `credential_type: "shared_payment_token"` — do not retry with the same spend request ID |
| `context` validation error on `spend-request create` | `context` field is under 100 characters | Rewrite `context` as a full sentence explaining what is being purchased and why; the user reads this when approving |
| API rejects `merchant_name` or `merchant_url` | These fields are forbidden when `credential_type` is `shared_payment_token` | Remove both fields from the request; SPT flows identify the merchant via `network_id` instead |
| Spend request approved but payment fails immediately | Wrong credential type for the merchant (e.g. `card` on a 402-only endpoint) | Go back to Step 2, re-evaluate the merchant, create a new spend request with the correct `credential_type` |
| Auth token expired mid-session (exit code 1 during approval polling) | Token refresh failure during background polling | Re-authenticate with `auth login`, then retrieve the existing spend request or resume polling. Only create a new spend request if the original one expired, was denied, was canceled, or its shared payment token was already consumed |

# Reporting outcomes

After a purchase attempt, you're encouraged to report the outcome — whether it succeeded, was blocked, or was abandoned. This is optional but helps Stripe improve checkout for agents.

```bash
link-cli report \
  --domain <merchant-domain> \
  --outcome <success|blocked|abandoned> \
  --spend-request-id <lsrq_...> \
  [--tag <tag>] \
  [--step <step>] \
  [--freeform-context "<details>"]
```

## When to report

- **success** — payment completed and order confirmed
- **blocked** — the agent could not complete payment due to an obstacle (captcha, WAF, rate limit, etc.)
- **abandoned** — the agent chose to stop (user canceled, site error, timeout, etc.)

## Tags

Add one or more `--tag` flags to classify what happened. Prefer the most specific tag; use `other` only when none of the others apply, and describe what happened in `--freeform-context`.

| Tag | Meaning |
|---|---|
| `stripe_checkout` | Merchant uses Stripe checkout |
| `captcha` | Blocked by CAPTCHA |
| `anti_bot_script` | Blocked by bot detection script |
| `cdn_block` | Blocked by CDN (Cloudflare, etc.) |
| `waf_block` | Blocked by WAF |
| `dns_block` | DNS-level block |
| `rate_limited` | Rate limited |
| `login_required` | Login wall prevented checkout |
| `3ds_challenge` | 3DS challenge could not be completed |
| `page_inaccessible` | Page returned error or could not load |
| `timeout` | Operation timed out |
| `site_error` | Merchant site returned an error |
| `payment_declined` | Payment was declined by processor |
| `other` | Other (describe in freeform-context) |

## Examples

```bash
# Successful purchase
link-cli report --domain shop.example.com --outcome success --spend-request-id lsrq_abc123

# Blocked by captcha
link-cli report --domain shop.example.com --outcome blocked --spend-request-id lsrq_abc123 --tag captcha --step "checkout page"

# Abandoned due to site error
link-cli report --domain shop.example.com --outcome abandoned --spend-request-id lsrq_abc123 --tag site_error --freeform-context "500 error on payment submission"
```

Report output is agent-only (not shown to the user). Reporting is encouraged but not required, including when the purchase failed.

# Further docs

- MPP/x402 protocol: https://mpp.dev/protocol.md, https://mpp.dev/protocol/http-402.md, https://mpp.dev/protocol/challenges.md
- Link: https://link.com/agents
- Link App (for account management): https://app.link.com
- Link support (if the user needs help with Link): https://support.link.com/topics/about-link
