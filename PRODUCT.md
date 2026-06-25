# Product

## Register

product

## Users

**Primary:** Hermes operators and developers installing HBO Plugin for commerce teams.

- **Developers / integrators** evaluate the repo, install the plugin and profiles, wire Composio or demo data, and verify the Business Ops dashboard inside Hermes.
- **Ops leads and sales/growth operators** use the Business Ops tab daily: review signals, approve or reject proposed actions, run workflows, and audit decisions.
- **Evaluators** skim the public docs site to understand scope, architecture, and install path before committing to Hermes.

Context: users are technical enough to run CLI commands and read API-shaped docs. They are not shopping for another standalone SaaS CRM. They want Hermes to become their operations workspace.

## Product Purpose

HBO Plugin extends [Hermes Agent](https://hermes-agent.nousresearch.com/) with a Hermes-native business operations layer:

- `hbo_*` plugin tools and local demo state
- Business Ops dashboard tab (Overview, Agents, Workflows, Leads, Actions, Audit, Tool Bridges, Setup)
- Three profile distributions (Sales Ops, Growth, Ops Lead)
- Optional Composio CLI bridge for external apps

Success looks like: install from docs in one session, load demo data, see signals and pending actions, approve one action with a full audit trail, and understand how to enable real integrations later.

## Brand Personality

**Three words:** capable, controlled, native.

Voice is direct and technical, not hype-driven. We explain workflows and guardrails plainly. Confidence comes from showing real architecture, tools, and approval gates, not from marketing superlatives.

Emotional goals:

- **Product surfaces (dashboard):** clarity under load, trust through auditability, calm control over agent proposals.
- **Brand surfaces (docs site):** competent first impression, fast path to install, credible devtool aesthetic.

## Anti-references

- Standalone SaaS CRM or "AI ops platform" landing pages with hero metrics, purple gradients, and three identical feature cards
- Generic AI tool marketing: emoji icons, glassmorphism everywhere, gradient text, neon glows
- Dashboard patterns that hide approval risk: auto-execute without human gates, no audit trail
- Editorial-magazine or luxury-consumer palettes on a developer product
- Fake product UI built from div rectangles instead of real screenshots or components
- Match-and-refuse patterns from impeccable: side-stripe borders, hero-metric templates, modal-first flows

## Design Principles

1. **Hermes-native, not separate app.** UI and copy reinforce that HBO Plugin ships inside Hermes: plugin, profiles, dashboard tab, skills.
2. **Show the operating loop.** Signals, proposed actions, human approval, optional execution. Every surface should make that loop legible.
3. **Trust through gates.** Pending actions stay pending until a human decides. Audit events are a feature, not fine print.
4. **Dual register discipline.** `apps/docs` is **brand** (landing + documentation). `plugin/hbo-plugin/dashboard` is **product** (dense ops UI). Do not apply marketing layouts to the dashboard or app chrome to the docs homepage.
5. **Demo-first, bridge-optional.** First run works without external credentials. Composio and other bridges are clearly optional upgrades.

## Accessibility & Inclusion

- Target **WCAG 2.1 AA** for text contrast, focus visibility, and keyboard navigation on docs and dashboard.
- Honor `prefers-reduced-motion` on all marketing animations and button micro-interactions.
- Honor `prefers-color-scheme`; dark mode is the docs default but light mode must remain coherent.
- Avoid color-only status encoding in the action queue; pair color with labels and icons.
- Copy is plain English; avoid idioms that confuse non-native readers in install instructions.

## Surfaces (register overrides)

| Surface | Path | Register | Job |
|---------|------|----------|-----|
| Public docs + homepage | `apps/docs/` | brand | Explain, convince, install |
| Business Ops dashboard | `plugin/hbo-plugin/dashboard/` | product | Operate, approve, audit |
| Contributor docs | `docs/` | product | Specs and architecture for builders |

When impeccable commands target a file, infer register from the surface in focus, not only from the default above.
