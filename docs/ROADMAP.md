# HBO Plugin — Public Roadmap

Next steps for the **Business Ops Demo** MVP.  
Repository: [nicoware-dev/hbo-plugin](https://github.com/nicoware-dev/hbo-plugin)

## Current state (2026-06-25)

| Area | Status |
|------|--------|
| Monorepo scaffold | Done |
| Hermes plugin + **16** `hbo_*` tools | Done |
| Local demo JSON state + CRUD mutations | Done |
| Dashboard tab (Business Ops) | **9 pages** — full CRUD, Signals, bridge toggle |
| 3 profile distributions | Done |
| 5 bundled skills | Done |
| Docusaurus public site | Done |
| Workflows (full outputs) | Done |
| Approve/reject + audit + Gmail execution | Done |
| Plugin API tests | Done (**21** tests) |
| Composio bridge (live) | Sheets import, Gmail post-approve, status API |
| Google Sheets import | Done (dashboard + CLI) |

## Phase 5 — Workflows, approvals, audit ✅

1. ~~Enrich workflows~~ — `inbound_sales`, `outbound_growth`, `daily_ops_briefing` emit signals and action proposals.
2. ~~Dashboard refetch~~ — approve/reject shows audit summary + execution status.
3. ~~Tests~~ — `tests/hbo_plugin/` (21 tests); run `pnpm test:plugin`.
4. ~~Manual check~~ — verified in Hermes CLI + dashboard (user confirmed).

## Post-MVP oleadas (IMPROVEMENT_PLAN) ✅ 0–4

| Oleada | Scope | Status |
|--------|-------|--------|
| 0 | Hermes verification | Done |
| 1 | Dashboard polish (feedback, JSON panel, reset) | Done |
| 2 | Backend CRUD API | Done |
| 3 | Dashboard CRUD UI + Signals page | Done |
| 4 | Composio bridge + Gmail execution | Done |
| 5 | Profile skills/cron, more tests, CI | Pending |
| 6 | Demo script, screenshots, video, GitHub Pages | Pending |

## Phase 6 — Demo polish (next)

1. Write `DEMO_SCRIPT.md` — install → reset → import Sheets → workflow → approve → Gmail → audit.
2. Add screenshots to `apps/docs`.
3. Publish docs site (GitHub Pages: `nicoware-dev.github.io/hbo-plugin`).
4. Record demo video; clean up demo data copy and edge cases.

## Technical follow-ups

1. **Install docs:** always ship `plugin/hbo-plugin/dashboard/dist/` (run `pnpm build:dashboard` before release).
2. **Dashboard API:** remind users to restart Hermes dashboard after plugin install/update.
3. **Navigation:** use button nav in dashboard (Hermes SDK has no `TabsContent`).
4. **CI:** GitHub Actions for `pnpm test:plugin` + `pnpm build:dashboard`.
5. **Overview redesign:** charts, funnel, segment breakdown (Priority 8).
6. **Optional:** pip entry-point for `hermes_agent.plugins` distribution.

## Out of scope (MVP)

- WithOne / One CLI bridge
- n8n bridge
- Standalone SaaS app
- Real CRM / production integrations (HubSpot sync deferred)

## How to contribute

```bash
pnpm install
pnpm build:dashboard
pnpm test:plugin
pnpm dev:docs
```

Install plugin: copy `plugin/hbo-plugin` to `%LOCALAPPDATA%\hermes\plugins\hbo-plugin` (Windows) or `~/.hermes/plugins/hbo-plugin`, then `hermes plugins enable hbo-plugin`.
