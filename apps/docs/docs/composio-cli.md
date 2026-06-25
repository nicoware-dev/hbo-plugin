---
sidebar_position: 9
title: Composio CLI
---

# Composio CLI Bridge

The MVP external bridge is **composio-cli** — optional and not required for the local demo.

## Setup

```bash
curl -fsSL https://composio.dev/install | bash
composio login
composio whoami
```

## Usage

```bash
composio search "update spreadsheet row"
composio link googlesheets
composio execute <TOOL> --data '{...}'
```

If Composio is not configured, use **local-demo** mode instead.
