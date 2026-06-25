---
sidebar_position: 6
title: Architecture
---

# Architecture

HBO Plugin extends Hermes as a single installable package under `plugin/hbo-plugin/`.

![HBO Plugin system architecture](/img/hbo-architecture.jpg)

## Components

| Layer | What it does |
|-------|--------------|
| **Plugin core** | `hbo_*` tools, business rules, and file-backed JSON state |
| **Dashboard** | React UI tab + FastAPI routes at `/api/plugins/hbo-plugin/` |
| **Tool bridge** | `composio-cli` skill for external app execution |
| **Profiles** | Sales Ops, Growth, and Ops Lead agent distributions |

## Data flow

1. The **operator** interacts via Hermes Agent chat or the Business Ops dashboard.
2. **Plugin core** reads and writes **local workspace state** (file-backed JSON).
3. The **dashboard** calls the same backend logic through plugin API routes.
4. The **tool bridge** executes actions in external apps when credentials are configured.

## Operating loop

![HBO Plugin workflow — signal to proposal to approval](/img/hbo-how-it-works.jpg)

See [How it works](./how-it-works) for the full workflow walkthrough.

## Agent profiles

![Three specialist agents share one workspace](/img/hbo-agents.jpg)

See [Profiles](./profiles) for install commands and role details.
