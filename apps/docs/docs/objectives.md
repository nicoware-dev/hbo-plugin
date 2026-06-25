---
sidebar_position: 5
title: Objectives
---

# Objectives & scope

This page defines what HBO Plugin is for, who it serves, and what the MVP includes.

## Product thesis

Most commerce businesses do not need another CRM or automation platform. They need a practical way for an AI agent to:

1. Understand what is happening across existing tools
2. Propose concrete next steps
3. Stay behind human approval gates
4. Leave an audit trail

Hermes already provides the agent runtime, profiles, skills, plugins, and dashboard. HBO Plugin adds the **business operations layer** on top.

## Primary objectives

### O1 — Hermes-native packaging

Ship as a Hermes plugin + dashboard extension + profile distributions — not a standalone SaaS app.

### O2 — Specialized commerce agents

Provide three ready-to-install profiles:

- **Sales Ops** — inbound sales, bot QA, follow-ups
- **Growth** — outbound leads, scoring, outreach
- **Ops Lead** — daily briefing, prioritization, approvals

### O3 — Observable operating loop

Make the signal → action → approval loop visible and actionable:

- Signals from business data
- Workflow-driven action proposals
- Real approve/reject with audit events
- Dashboard and chat surfaces for operators

### O4 — Optional real integrations

Document and bundle the Composio CLI bridge as the path to Gmail, Slack, CRM, and other apps.

### O5 — Public documentation

Publish install guides, architecture, and a copy-paste Hermes prompt so users can self-serve.

## Target users

| User | Need |
|------|------|
| SMB commerce operators | Daily visibility into leads, conversations, and tasks |
| E-commerce / marketplace sellers | Coordinate inbound and outbound without new tools |
| Hermes developers | Reusable business ops package for client deployments |
| Consultants | Deploy Hermes business ops for client engagements |

Ideal experience:

```text
User pastes install prompt → Hermes installs everything → Dashboard opens → Workflow runs → User approves an action
```

## What HBO Plugin is

- A Hermes-native plugin with business ops tools
- A dashboard tab for operators
- Profile distributions for specialized agents
- Bundled skills for workflows and integrations
- Public documentation and landing site

## What HBO Plugin is not (MVP)

- A CRM replacement
- A WhatsApp inbox
- A standalone SaaS application
- A full automation platform (n8n replacement)
- A Composio-only or WithOne-only project
- Production CRM sync (file-backed workspace for MVP)

## Success criteria

| Criteria | How to verify |
|----------|---------------|
| Install in one prompt | [Install prompt](./install-prompt) completes without manual CLI |
| Dashboard works | Business Ops tab shows leads, actions, audit |
| Approval loop works | Approve/reject mutates state + audit |
| Three profiles usable | Each profile runs its workflow skill |
| Docs self-explanatory | New user understands problem, loop, and install |

## Roadmap snapshot

Current MVP status (see repository `docs/ROADMAP.md`):

- Plugin + tools, workspace state, dashboard UI — **done**
- Profile distributions + skills — **done**
- Workflow enrichment (signals/actions from scans) — **in progress**
- Composio live bridge — **docs only** (by design for MVP)
- WithOne / n8n bridges — **out of scope**

## Related docs

- [How it works](./how-it-works) — signal and approval loop detail
- [Architecture](./architecture) — system diagram
