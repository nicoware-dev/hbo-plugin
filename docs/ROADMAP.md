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
| Workflows (full outputs) | Done |
| Approve/reject + audit (dashboard) | Done |
| Plugin API tests | Done (11 tests) |
| Composio bridge (live) | Docs only (by design for MVP) |

## Phase 5 — Workflows, approvals, audit ✅

1. ~~Enrich workflows~~ — `inbound_sales`, `outbound_growth`, `daily_ops_briefing` emit signals and action proposals.
2. ~~Dashboard refetch~~ — approve/reject uses SDK `refetch()` (no full page reload).
3. ~~Tests~~ — `tests/hbo_plugin/` (11 tests); run `pnpm test:plugin`.
4. **Manual check:** verify end-to-end in Hermes CLI + dashboard after plugin sync.

## Phase 6 — Demo polish (next)

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
