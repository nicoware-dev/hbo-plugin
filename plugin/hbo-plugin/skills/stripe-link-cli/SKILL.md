---
name: stripe-link-cli
version: 0.7.2
description: >-
  Gets secure, one-time-use payment credentials (cards, tokens) from a Link
  wallet so agents can complete purchases. Use when the user says "get me a
  card", "buy something", "pay for X", "make a purchase", "I need to pay",
  "complete checkout", or asks to transact on any merchant site. Use when the
  user asks to connect or log in to their Link account. HBO Plugin: optional
  approved-spending bridge with two-layer approval (HBO action, then Link
  spend request); mock demo works without Link CLI installed.
tags: [stripe, link-cli, payments, approvals, spending, card, spt, hbo-plugin, optional]
metadata:
  upstream: stripe/link-cli skills/create-payment-credential
  upstream_version: 0.7.2
  package: "@stripe/link-cli"
---

## Contract

- HBO two-layer approval: dashboard action first, then Link spend request
- Mock demo (`mock_approved_spend_request`) works without CLI — no real credentials
- Never store card numbers, SPTs, or Link auth in HBO JSON state
- Use `--output-file` on credential retrieve; mask PAN in chat unless user requests full values
- Link is US-only; when CLI unavailable, explain mock fallback clearly

## When to Apply

- User wants **approved purchase** workflows (software, subscriptions, enrichment)
- User says **get me a card**, **buy something**, **pay for X**, **complete checkout**
- User asks to **connect**, **log in**, or **sign up** for their Link account
- HBO demo: two-layer approval — HBO action → Stripe Link spend request
- **Optional** — MVP works without Stripe Link CLI (use mock demo action)

## When to skip

- Demo without payments → **local-demo**
- Gmail/Sheets automation → **composio**
- General sales workflows → **sales-ops** / playbooks
- NemoClaw deploy → **nvidia-nemoclaw-setup**

> Link is US-only for now. When CLI is unavailable, use HBO mock action `mock_approved_spend_request` and explain the fallback.

## Phases

1. **HBO gate** — user approves business action in dashboard.
2. **Auth** — `link-cli auth status` or `link-cli onboard`.
3. **Merchant eval** — determine card vs SPT credential type.
4. **Spend request** — `spend-request create` (add `--test` in test mode).
5. **User approval** — present Link app verification URL.
6. **Retrieve** — credentials via `--output-file`, not chat transcript.

## HBO Plugin context

Business purchases use **two approvals**:

```text
1. HBO dashboard: approve the business action
2. Stripe Link: user approves spend credentials in the Link app
```

Demo action `mock_approved_spend_request` records a mock spend in the audit log — no real credentials. Live Link CLI runs are documented only; agents execute them manually after HBO approval.

> [HBO Bridge](rules/hbo-bridge.md) — mock vs live, safety, audit

## Installing

```bash
npm install -g @stripe/link-cli
```

Or run directly:

```bash
npx @stripe/link-cli
```

Verify:

```bash
link-cli --version
link-cli auth status
```

Guided onboarding: `link-cli onboard`

## Running commands

Link CLI runs as a **standalone CLI** or **MCP server** (`npx @stripe/link-cli --mcp`).

Quick reference:

- `link-cli --llms` / `link-cli --llms-full` — command catalog (canonical params)
- `link-cli <command> --schema` — schema before invoke
- `--format json|md|yaml` — structured output (default: `toon`)
- Multi-step flows return `_next.command` — run it to continue
- Present verification and approval URLs clearly to the user

## Core flow

Copy this checklist and track progress:

- Step 1: Authenticate with Link
- Step 2: Evaluate merchant site (determine credential type)
- Step 3: Get payment methods
- Step 4: Create spend request with correct credential type
- Step 5: Complete payment

> Full flow (official): [Create Payment Credential](rules/create-payment-credential.md)

Credential types:

- **card** — virtual PAN for standard checkout forms
- **shared_payment_token** — SPT for HTTP 402 / Machine Payment Protocol merchants

**Test mode:** add `--test` to `spend-request create` for development.

## Rule index

| Rule | Topic |
|------|-------|
| [create-payment-credential.md](rules/create-payment-credential.md) | Auth, merchant eval, spend request, payment (official flow) |
| [hbo-bridge.md](rules/hbo-bridge.md) | HBO two-layer approval, mock demo, live path |
| [errors-limits.md](rules/errors-limits.md) | Limits, error recovery, reporting, further docs |

## Output Format

```
STRIPE LINK CLI REPORT
- Mode: {mock demo | live CLI}
- HBO action: {approved | pending}
- Credential type: {card | shared_payment_token}
- Next: user Link approval | mock audit recorded
```

## Safety (summary)

- Never store card numbers, SPTs, or Link auth in HBO JSON state
- Use `--output-file` on retrieve to keep credentials out of transcripts
- Mask card and address details in chat unless the user requests full values
- Respect `/agents.txt` and `/llm.txt` on merchant sites

## Anti-Patterns

| Don't | Why |
|-------|-----|
| Skip HBO approval before spend request | Two-layer gate |
| Paste full PAN in chat | Credential leak |
| Claim mock spend charged real card | Demo is audit-only |
| Install Link for basic HBO demo | **local-demo** sufficient |

## vs sibling skills

| Skill | Use for |
|-------|---------|
| **stripe-link-cli** (this) | Payment credentials |
| **local-demo** | Mock spend without CLI |
| **composio** | Non-payment external apps |
| **ops-lead-playbook** | Explains mock spend in briefings |
