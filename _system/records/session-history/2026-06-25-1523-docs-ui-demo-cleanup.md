---
type: session
title: "Docs site UI polish and demo-data cleanup"
date: 2026-06-25
time: "15:23"
session_id: 2026-06-25-1523
topics: [docs-site, ui-ux, demo-deemphasis, docusaurus]
workspace_paths: [apps/docs, PRODUCT.md, DESIGN.md]
status: closed
related: [2026-06-25-1930-phase5-workflows-dashboard.md]
---

# Docs site UI polish and demo-data cleanup

## Summary

Improved the public Docusaurus site (`apps/docs`) with UI/UX skills (impeccable, design-taste, ui-ux-pro-max): homepage bento layout, install prompt terminal, architecture tabs, scroll reveal, doc index cards, OKLCH tokens, self-hosted fonts, Mermaid theme, and code-block padding fixes. Then reframed all user-facing docs to remove hackathon-only “demo data” language — replaced demo prompt with install prompt, deleted Business Ops Demo page, and aligned homepage copy with real operator workflows.

## Done

### Docs site UI
- Homepage hero, Problem/Solution, workflow loop, feature grid, copy-install prompt, architecture section with tabs/zoom
- `DocsIndexCards` on intro; `intro.md` → `intro.mdx`
- Global styling: `custom.css`, `docs-theme.css`, Manrope + Source Code Pro via `@fontsource`
- Mermaid rendering fixed (`@docusaurus/theme-mermaid` + config)
- Code snippet padding fixed in `docs-theme.css`
- Navbar CTA, footer links, favicon assets
- `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json` for future UI sessions

### Demo-data de-emphasis (user-facing)
- Deleted `business-ops-demo.md`, `demo-prompt.md`; added `install-prompt.md` (9 steps, no load-demo step)
- Rewrote install, how-it-works, objectives, dashboard, plugin, skills, profiles, composio-cli, architecture
- Updated homepage components: install prompt, package list, workflow/solution copy
- Footer: Demo prompt → Install prompt
- `pnpm build` passes with `onBrokenLinks: 'throw'`

## Decisions

- Demo data stays in plugin code for hackathon use but is not documented as a user-facing product feature
- Public framing: “local workspace” / built-in workflows instead of “Business Ops Demo”
- `hbo_load_demo_data` omitted from public tool table in docs

## Files changed

- `apps/docs/docs/*` — content rewrites, deletions, `install-prompt.md`, `intro.mdx`
- `apps/docs/src/components/*`, `apps/docs/src/pages/*`, `apps/docs/src/css/*`
- `apps/docs/docusaurus.config.ts`, `sidebars.ts`, `package.json`, `pnpm-lock.yaml`
- `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`
- `.gitignore` — added `docs/` (contributor docs)

## Open / next

- Optional redirects from `/docs/demo-prompt` and `/docs/business-ops-demo`
- Dashboard screenshot on homepage
- Align Hermes dashboard UI with `DESIGN.md` (product register)
- `.cursor/skills/` UI skills installed locally (gitignored)

## Notes

- UI skills live under `.cursor/skills/` (not committed)
- Internal demo paths (`plugin/hbo-plugin/data/business-ops-demo/`) unchanged in code
