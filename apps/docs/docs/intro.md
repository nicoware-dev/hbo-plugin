---
sidebar_position: 1
title: Home
slug: /
---

# HBO Plugin

**Hermes Business Operations Plugin** turns Hermes Agent into a practical operating system for commerce and business workflows — without building a separate SaaS app.

## One-liner

> HBO Plugin is a Hermes-native business operations package: specialized agent profiles, workflows, a dashboard tab, signals and action queues with approval gates, and optional bridges to external tools.

## The problem

Most SMB commerce teams run operations across disconnected tools:

- Google Sheets and CRMs for leads
- WhatsApp, marketplaces, and bots for customer conversations
- Manual spreadsheets for follow-ups and outreach batches
- Slack or Telegram for notifications

Hermes can reason and act — but it needs **business context**, **workflows**, **UI for operators**, and **guardrails** before it can run real commercial operations.

## The solution

HBO Plugin extends Hermes itself through:

| Layer | What it provides |
|-------|------------------|
| **Plugin core** | 12 `hbo_*` tools, business rules, file-backed JSON state |
| **Dashboard** | Business Ops tab with Overview, Agents, Workflows, Leads, Actions, Audit, Tool Bridges, Setup |
| **Profiles** | Sales Ops, Growth, and Ops Lead agent distributions |
| **Skills** | Workflow guidance + optional Composio CLI bridge |
| **Demo workspace** | Self-contained commerce ops data — no credentials required |

## Core operating loop

```text
External apps / demo data  →  Signals  →  Hermes workflows  →  Action proposals  →  Approve / reject  →  Audit log
```

1. **Signals** surface business events (missed follow-ups, bot QA flags, hot leads).
2. **Workflows** (`inbound_sales`, `outbound_growth`, `daily_ops_briefing`) scan state and propose actions.
3. **Operators** approve or reject in Hermes chat or the dashboard.
4. **Audit** records every decision for traceability.
5. **Tool bridge** (optional) executes approved actions against Gmail, Slack, CRM, etc.

See [How it works](./how-it-works) for the full walkthrough.

## Objectives

HBO Plugin helps Hermes answer:

- What happened in the business today?
- Which leads or conversations need attention?
- What should each specialized agent do next?
- Which actions require human approval before execution?
- What was approved, rejected, and when?

Read [Objectives & scope](./objectives) for product goals, target users, and MVP boundaries.

## Quick start

**Fastest path:** copy the [install prompt](./demo-prompt) into Hermes — it installs the plugin, profiles, demo data, and verifies the dashboard.

**Manual path:** follow the [installation guide](./install).

## Documentation map

| Doc | Topic |
|-----|-------|
| [Install](./install) | Plugin, profiles, demo data, dashboard |
| [Demo prompt](./demo-prompt) | Copy-paste Hermes install prompt |
| [How it works](./how-it-works) | Signals, workflows, approvals |
| [Objectives](./objectives) | Product goals and MVP scope |
| [Architecture](./architecture) | System diagram and components |
| [Plugin](./plugin) | All `hbo_*` tools |
| [Dashboard](./dashboard) | Business Ops UI pages |
| [Profiles](./profiles) | Agent distributions |
| [Skills](./skills) | Bundled workflow and bridge skills |
| [Composio CLI](./composio-cli) | External app integration |
| [Business Ops Demo](./business-ops-demo) | Demo workspace and data |
