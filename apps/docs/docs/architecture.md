---
sidebar_position: 6
title: Architecture
---

# Architecture

HBO Plugin extends Hermes as a single installable package under `plugin/hbo-plugin/`.

![HBO Plugin system architecture](/img/hbo-plugin-architecture.png)

## Components

| Layer | What it does |
|-------|--------------|
| **Plugin core** | `hbo_*` tools, business rules, and file-backed JSON state |
| **Dashboard** | React UI tab + FastAPI routes at `/api/plugins/hbo-plugin/` |
| **Tool bridge** | Optional `composio-cli` skill for external app execution |
| **Profiles** | Sales Ops, Growth, and Ops Lead agent distributions |

## Data flow

1. The **operator** interacts via Hermes Agent chat or the Business Ops dashboard.
2. **Plugin core** reads and writes **local state** (demo JSON under `data/business-ops-demo/`).
3. The **dashboard** calls the same backend logic through plugin API routes.
4. The **tool bridge** executes actions in external apps when credentials are configured.

## Alternate view

![HBO Plugin architecture — alternate layout](/img/hbo-plugin-architecture-2.png)

See contributor docs in the repository `docs/` folder for detailed architecture notes.
