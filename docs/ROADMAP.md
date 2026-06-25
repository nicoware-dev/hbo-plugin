# HBO Plugin — Public Roadmap

Next steps for the **Business Ops Demo** MVP.  
Repository: [nicoware-dev/hbo-plugin](https://github.com/nicoware-dev/hbo-plugin)

## Current state (2026-06-25)

| Area | Status |
|------|--------|
| Monorepo scaffold | Done |
| Hermes plugin + **18** `hbo_*` tools | Done |
| Local demo JSON state + CRUD mutations | Done |
| Dashboard tab (Business Ops) | **10 pages** — full CRUD, Signals, Business, bridge toggle |
| 3 profile distributions | Done |
| 7 bundled skills | Done |
| Docusaurus public site | Done |
| Workflows (full outputs) | Done |
| Approve/reject/execute + audit | Done |
| Plugin API tests + CI | Done |
| Composio bridge (live) | Sheets import, Gmail execute, status API |
| Google Sheets import | Done (dashboard + CLI) |
| Demo script + reset scripts | Done |

## Phase 5 — Workflows, approvals, audit ✅

1. ~~Enrich workflows~~ — `inbound_sales`, `outbound_growth`, `daily_ops_briefing` emit signals and action proposals.
2. ~~Dashboard refetch~~ — approve/reject/execute shows audit summary.
3. ~~Tests~~ — `tests/hbo_plugin/`; run `pnpm test:plugin`.
4. ~~Manual check~~ — verified in Hermes CLI + dashboard.

## Post-MVP oleadas (IMPROVEMENT_PLAN) ✅ 0–4 + audit P0–P3

| Oleada | Scope | Status |
|--------|-------|--------|
| 0 | Hermes verification | Done |
| 1 | Dashboard polish (feedback, JSON panel, reset) | Done |
| 2 | Backend CRUD API | Done |
| 3 | Dashboard CRUD UI + Signals page | Done |
| 4 | Composio bridge + Gmail execution | Done |
| 5 | Profile cron blueprints + sponsor docs | Done |
| 6 | Demo script, screenshots, video, Vercel docs | Partial — script + reset done |

## Phase 6 — Release packaging (next)

1. ~~Write `DEMO_SCRIPT.md`~~ — done (`apps/docs/docs/demo-script.md`)
2. Add screenshots to `apps/docs`
3. Publish docs site on [Vercel](https://hbo-plugin-docs.vercel.app/)
4. Record demo video

## Technical follow-ups

1. **Install docs:** always ship `plugin/hbo-plugin/dashboard/dist/` (run `pnpm build:dashboard` before release).
2. **Dashboard API:** restart Hermes dashboard after plugin install/update.
3. **Navigation:** button nav in dashboard (Hermes SDK has no `TabsContent`).
4. ~~**CI:** GitHub Actions~~ — `.github/workflows/ci.yml`
5. ~~**Overview redesign**~~ — charts, funnel, segment breakdown
6. **Optional:** pip entry-point for `hermes_agent.plugins` distribution
7. **Optional:** migrate runtime state to `~/.hermes/hbo-plugin/state/`

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
