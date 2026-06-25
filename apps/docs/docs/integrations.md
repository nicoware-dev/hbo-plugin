---
title: Integrations
---

# Integrations

HBO Plugin is **Hermes-native at the core**. Integrations extend the workspace when you need external apps, secure runtimes, or payment approval flows.

## Overview

| Integration | Role | When to use |
|-------------|------|-------------|
| [Composio](./composio-cli) | External app bridge (Gmail, Slack, Sheets, CRM) | Connect live business tools |
| [NVIDIA NemoClaw](./nvidia-nemoclaw) | Secure Hermes runtime + Nemotron inference | Deploy inside a sandboxed Hermes environment |
| [Stripe Link CLI](./stripe-link) | Approved spending workflow | Purchases that require payment approval |

## How they fit

```text
Core: install → dashboard → workflows → approve → audit
Bridge: Composio for external apps
Runtime: NemoHermes + NemoClaw + Nemotron deployment path
Spending: Stripe Link CLI with two-layer approval
```

## Stripe sandbox in the dashboard

Approve action `act_004` (CRM enrichment purchase) to see Stripe Link CLI audit output in sandbox mode — no live charges.

## Technical reference

Implementation notes live in the repository under `docs/INTEGRATIONS.md`.
