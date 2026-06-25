---
sidebar_position: 11
title: Development
---

# Development

```bash
pnpm install
pnpm dev:docs        # Docusaurus at http://localhost:3000
pnpm dev:dashboard   # Rebuild dashboard extension on change
pnpm build           # Build dashboard + docs
```

## Monorepo layout

- `plugin/hbo-plugin/` — Python plugin + dashboard extension
- `profiles/` — Agent distributions
- `apps/docs/` — This documentation site
- `docs/` — Contributor architecture docs

See `AGENTS.md` in the repository root for agent-oriented guidance.

Contributor docs:

- [Project status](https://github.com/nicoware-dev/hbo-plugin/blob/main/docs/PROJECT_STATUS.md) — what is built and what remains
- [Hermes alignment](https://github.com/nicoware-dev/hbo-plugin/blob/main/docs/HERMES_ALIGNMENT.md) — how we match Hermes conventions
