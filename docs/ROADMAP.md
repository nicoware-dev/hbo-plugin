# HBO Plugin — Public Roadmap

Next steps for the **Business Ops Demo** MVP.  
Repository: [nicoware-dev/hbo-plugin](https://github.com/nicoware-dev/hbo-plugin)

## Current state (2026-06-25)

| Area | Status |
|------|--------|
| Monorepo scaffold | Done |
| Hermes plugin + 12 `hbo_*` tools | Done |
| Local demo JSON state | Done |
| Dashboard tab (Business Ops) | UI works; requires dashboard restart for API routes |
| 3 profile distributions | Done |
| 5 bundled skills | Done |
| Docusaurus public site | Done |
| Workflows (full outputs) | Partial |
| Composio bridge (live) | Docs only (by design for MVP) |

## Phase 5 — Workflows, approvals, audit

1. Enrich `inbound_sales`, `outbound_growth`, and `daily_ops_briefing` to emit signals and action proposals from demo state.
2. Replace dashboard `window.location.reload()` with SDK refetch after approve/reject.
3. Add tests for `plugin_api.py` (pattern from Hermes kanban plugin tests).
4. Verify approve/reject + audit flow end-to-end in Hermes CLI and dashboard.

## Phase 6 — Demo polish

1. Record demo script flow (install → profiles → briefing → approve → audit).
2. Add screenshots to `apps/docs`.
3. Publish docs site (GitHub Pages: `nicoware-dev.github.io/hbo-plugin`).
4. Clean up demo data copy and edge cases.

## Technical follow-ups

1. **Install docs:** always ship `plugin/hbo-plugin/dashboard/dist/` (run `pnpm build:dashboard` before release).
2. **Dashboard API:** remind users to restart Hermes dashboard after plugin install/update.
3. **Navigation:** use button nav in dashboard (Hermes SDK has no `TabsContent`).
4. **Optional:** pip entry-point for `hermes_agent.plugins` distribution.

## Out of scope (MVP)

- WithOne / One CLI bridge
- n8n bridge
- Standalone SaaS app
- Real CRM / production integrations

## How to contribute

```bash
pnpm install
pnpm build:dashboard
pnpm dev:docs
```

Install plugin: copy `plugin/hbo-plugin` to `%LOCALAPPDATA%\hermes\plugins\hbo-plugin` (Windows) or `~/.hermes/plugins/hbo-plugin`, then `hermes plugins enable hbo-plugin`.
