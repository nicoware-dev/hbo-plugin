# HBO Plugin — Improvement Plan

**Created:** 2026-06-25  
**Last updated:** 2026-06-25 (oleadas 0–4 completas)  
**Status:** In progress — Phase 6 demo polish next  
**Phase:** Post-MVP — Dashboard functionality & Composio bridge

---

## Completed (2026-06-25 session)

| Area | Status |
|------|--------|
| Priority 1 (1.1–1.4) | Done — feedback, JSON outputs, Signals tab, run history |
| Priority 2 (2.1–2.4) | Done — CRUD leads/actions/signals + API |
| Priority 3 (3.1–3.3) | Done — reset demo, edit lead, delete action |
| Priority 5.2 Sheets | Done (prior session) |
| Priority 5.3 Gmail post-approve | Done — `execution.py`, `hbo_send_approval_email` |
| Priority 5.7 mode toggle | Done — `workspace.selectedBridge` + Tool Bridges UI |
| Priority 5.8 scripts | Done |
| Composio bridge status API | Done — `GET /bridge/status`, fix CRLF WSL |
| Tests | 21 passing (`pnpm test:plugin`) |

---

## Current State

The HBO Plugin has **16 `hbo_*` tools**, 3 profiles, full workflow outputs, and approve/reject with audit trail via CLI and dashboard.

**Dashboard (9 pages):** Overview, Agents, Workflows, Leads, Actions, **Signals**, Audit, Tool Bridges, Setup. Full CRUD for leads, actions, and signals. Import from Google Sheets from Leads page. Reset demo from Setup. Approve/reject shows audit + execution status. Workflows show collapsible JSON outputs.

**Composio bridge:** Google Sheets import, Gmail post-approve (modes `composio`/`hybrid`), dynamic Tool Bridges status via `composio whoami`. Windows uses WSL Ubuntu (`scripts/composio.ps1`).

**Hermes verified:** User confirmed dashboard and plugin work after sync + restart.

---

## Priority 1 — Fix existing dashboard interactions

### 1.1 Approve / Reject feedback ✅
- **Problem:** Buttons call the POST endpoint but the UI does not show the result or update the action list reliably.
- **Fix:** After `refetch()`, show a brief success/error indicator. Display the returned `auditEvent` summary inline.
- **Files:** `dashboard/src/routes/Actions.tsx`, `dashboard/src/api/hooks.ts`

### 1.2 Workflow run feedback ✅
- **Problem:** "Run workflow" button calls the endpoint but outputs (signals created, action proposals, lead scores) are not visible.
- **Fix:** After `postAction`, display a collapsible output panel with the structured result from the API.
- **Files:** `dashboard/src/routes/Workflows.tsx`

### 1.3 Signals page ✅
- **Problem:** API endpoint `GET /signals` exists but there is no dashboard page for it.
- **Fix:** Add a "Signals" tab that lists open signals with type, summary, owner, and a "Resolve" button.
- **Files:** New `dashboard/src/routes/Signals.tsx`, update `dashboard/src/index.tsx`

### 1.4 Workflow list shows run history ✅
- **Problem:** `GET /workflows` returns `lastRunAt`, `status`, and `lastOutputs` but the dashboard only shows name and owner.
- **Fix:** Add columns for last run time, status, and a summary of last outputs.
- **Files:** `dashboard/src/routes/Workflows.tsx`

---

## Priority 2 — Data entry forms

### 2.1 Create Lead ✅
- **API:** `POST /api/plugins/hbo-plugin/leads`
- **State function:** `state.append_lead(data)`
- **Fields:** name, source, segment, score (0-100), priority (low/medium/high), status (new/needs_followup/hot), ownerAgentId, recommendedAction
- **Frontend:** Modal or inline form on the Leads page
- **Files:** `plugin_api.py`, `state.py`, `dashboard/src/routes/Leads.tsx`

### 2.2 Create Action ✅
- **API:** `POST /api/plugins/hbo-plugin/actions`
- **State function:** `state.append_action(data)` (already exists)
- **Fields:** title, agentId, source, risk (low/medium/high), description
- **Frontend:** Modal or inline form on the Actions page
- **Files:** `plugin_api.py`, `dashboard/src/routes/Actions.tsx`

### 2.3 Create Signal ✅
- **API:** `POST /api/plugins/hbo-plugin/signals`
- **State function:** `state.append_signal(data)` (already exists)
- **Fields:** type (missed_followup/bot_qa/custom), summary, ownerAgentId, optional leadId/conversationId
- **Frontend:** Form on the Signals page
- **Files:** `plugin_api.py`, `dashboard/src/routes/Signals.tsx`

### 2.4 Resolve Signal ✅
- **API:** `POST /api/plugins/hbo-plugin/signals/{signal_id}/resolve`
- **State function:** `state.resolve_signal(signal_id)`
- **Files:** `plugin_api.py`, `state.py`, `dashboard/src/routes/Signals.tsx`

---

## Priority 3 — Data management

### 3.1 Reset demo data button ✅
- **API:** `POST /api/plugins/hbo-plugin/demo/reset` (already exists)
- **Frontend:** Button on the Setup page with confirmation dialog
- **Files:** `dashboard/src/routes/Setup.tsx`

### 3.2 Edit Lead ✅
- **API:** `PUT /api/plugins/hbo-plugin/leads/{lead_id}`
- **State function:** `state.update_lead(lead_id, data)`
- **Frontend:** Edit button per row on Leads page
- **Files:** `plugin_api.py`, `state.py`, `dashboard/src/routes/Leads.tsx`

### 3.3 Delete Action ✅
- **API:** `DELETE /api/plugins/hbo-plugin/actions/{action_id}`
- **State function:** `state.remove_action(action_id)`
- **Frontend:** Delete button per row on Actions page
- **Files:** `plugin_api.py`, `state.py`, `dashboard/src/routes/Actions.tsx`

---

## Priority 4 — Workflow enhancements

### 4.1 Inbound Sales — conversation review
- **Current:** Flags bot QA issues and creates follow-up actions
- **Enhancement:** Show conversation details inline so a human can review and approve/reject from the dashboard

### 4.2 Outbound Growth — outreach preview
- **Current:** Creates an outreach batch
- **Enhancement:** Preview the draft message before approving the action

### 4.3 Daily Briefing — schedule
- **Current:** On-demand generation
- **Enhancement:** Cron integration so ops-lead-agent generates briefings automatically

---

## Priority 5 — Composio bridge (real data)

### 5.1 Composio CLI status
- **Already installed** in WSL Ubuntu (v0.2.31), logged in as `nicoware.dev@gmail.com`
- **12 active connections:** Gmail, Google Sheets, Google Drive, Google Calendar, Google Meet, Google Maps, YouTube, HubSpot, LinkedIn (×3)
- **WhatsApp and one Google Meet connection are EXPIRED** — need re-link

### 5.2 Google Sheets integration ✅ DONE
- Create a Google Sheet with columns: name, email, company, phone, source, segment, score, priority, status, ownerAgentId, recommendedAction
- Populate with sample leads (10-15 rows of realistic demo data)
- Implement `composio_sheets_import()` in a new `plugin/hbo-plugin/sources/sheets.py`
- Map Sheets rows → `state.append_lead()` to bring real data into HBO
- Add `hbo_import_leads_from_sheets` tool for on-demand import
- **Entry point:** agent runs `composio search "google sheets"` → `composio execute GOOGLESHEETS_list_rows` → normalize → `state.append_lead()`

### 5.3 Gmail — send follow-up emails after approval ✅
- When an action with type "send_email" is approved, agent uses:
  ```bash
  composio execute GMAIL_SEND_EMAIL --data '{"recipient_email":"...","subject":"...","body":"..."}'
  ```
- Closes the loop: workflow proposes → user approves → Composio executes
- Add `hbo_send_approval_email` tool

### 5.4 HubSpot sync (future)
- Map HubSpot contacts → HBO leads
- Create HubSpot tickets from approved actions

### 5.5 Proactive signals from Gmail
- Detect unanswered emails → create signals automatically
- Use `composio listen` for real-time event streaming

### 5.6 Re-link expired connections
- WhatsApp and Google Meet are expired but critical for business ops
- Run: `composio link whatsapp` and `composio link googlemeet`

### 5.7 Mode toggle ✅ (workspace.selectedBridge; defer DataSource ABC)
- `workspace.json` field `selectedBridge`: `local-demo` | `composio` | `hybrid`
- Tool Bridges UI + `POST /bridge/mode`, `GET /bridge/status`
- ~~`state.py` DataSource abstraction~~ — deferred (over-engineering for demo)

### 5.8 Composio scripts (already in repo)
- `scripts/setup-composio-windows.ps1` — one-time WSL setup
- `scripts/composio.ps1` / `composio.cmd` — forward `composio` to WSL
- `scripts/wsl-composio-profile.sh` — WSL profile config
- `scripts/install-composio-windows-path.ps1` — add to PATH

---

## Priority 6 — Profile & cron completion

### 6.1 Profile skills directories
- **Current:** `profiles/*/skills/` are empty
- **Fix:** Each profile gets its own SOUL-specific skills bundled

### 6.2 Cron jobs
- **Current:** `profiles/*/cron/` are empty
- **Fix:** ops-lead-agent gets daily briefing cron, sales-ops-agent gets follow-up check cron

### 6.3 Profile-specific SOUL.md enhancements
- Add trigger conditions, preferred workflows, escalation rules

---

## Priority 7 — Testing & CI

### 7.1 Current test coverage
- **21 tests** passing (business_rules + plugin_api + execution)
- Missing: workflows.py, state.py edge cases, dashboard component tests

### 7.2 Add tests
- `test_workflows.py` — inbound_sales, outbound_growth, daily_briefing outputs
- `test_state.py` — append/update/reset operations
- `test_tools.py` — tool definition schema validation

### 7.3 GitHub Actions
- CI pipeline: pytest + pnpm build on push

---

## Priority 8 — Dashboard Overview redesign

### 8.1 Current state
Today's Overview page shows 4 plain stat cards (active agents, open signals, pending actions, workspace name). It lacks visual impact and actionable insights.

### 8.2 Goals
- Visual, at-a-glance understanding of business health
- Actionable insights (not just numbers)
- Professional look that stakeholders trust

### 8.3 Proposed visualizations
- **Funnel chart:** Leads by status (new → needs_followup → hot → converted)
- **Bar chart:** Leads by segment (commerce, wholesale, services, enterprise)
- **Score distribution:** Histogram of lead scores (0-50, 51-70, 71-85, 86-100)
- **Priority breakdown:** Pie/donut of high/medium/low priority
- **Timeline:** Actions completed over time (from audit events)
- **Agent workload:** Actions pending per agent
- **Signal heatmap:** Signals by type

### 8.4 Implementation approach
- Add lightweight charting library (recharts works with React, can be bundled in IIFE)
- Alternative: pure CSS/SVG charts if bundle size is a concern
- New plugin_api routes for aggregated stats:
  - `GET /api/plugins/hbo-plugin/stats/funnel`
  - `GET /api/plugins/hbo-plugin/stats/segments`
  - `GET /api/plugins/hbo-plugin/stats/scores`
  - `GET /api/plugins/hbo-plugin/stats/priorities`
  - `GET /api/plugins/hbo-plugin/stats/timeline`

### 8.5 Files
- `dashboard/src/routes/Overview.tsx` — redesign with charts
- `dashboard/src/components/` — new chart components (FunnelChart, BarChart, PieChart, etc.)
- `plugin/hbo-plugin/plugin_api.py` — add stats aggregation routes
- `plugin/hbo-plugin/state.py` — add `get_stats()` function

---

## Priority 9 — Skills system (extensibility)

### 9.1 Skill "Conectar nueva fuente" (data source onboarding)
- Guides user to connect external apps via Composio
- Flow: ask which app → search in Composio → link account → configure mapping → test
- Creates a new adapter in `sources/` dynamically
- Files: new skill `skills/connect-source/SKILL.md`, `sources/registry.py`

### 9.2 Skill "Crear nuevo agente" (agent builder)
- Guides user to create a specialized agent profile
- Flow: ask role → tone → tools → workflows → generate profile → install
- Uses a template system for dynamic profile generation
- Files: new skill `skills/create-agent/SKILL.md`, `profiles/_template/`

### 9.3 Skill "Buscar leads" (prospective lead search)
- Search for leads using Google Places, LinkedIn, or other sources
- Flow: ask what/where to search → call Composio → preview results → import
- Files: new skill `skills/search-leads/SKILL.md`, `sources/google_maps.py` (future)

### 9.4 Skill "Demo / Tour guiado" (onboarding)
- Interactive walkthrough for new users
- Shows: what the system does, how to run workflows, how to import leads, how to approve actions
- Files: new skill `skills/demo-tour/SKILL.md`

### 9.5 Skill "Auditoría de salud del sistema" (system health)
- Checks: workflow status, unassigned leads, stale signals, Composio connection health
- Generates a health report
- Files: new skill `skills/health-check/SKILL.md`

### 9.6 Skill "Exportar / Reportes" (reporting)
- Export leads to CSV
- Generate activity reports per agent/workflow
- Files: new skill `skills/export-report/SKILL.md`

### 9.7 Skill "Customizar sistema" (admin configuration)
- Add custom action types
- Add custom workflow templates
- Add custom fields to leads
- Configure approval rules (which actions need approval, risk levels)
- Files: new skill `skills/customize/SKILL.md`

---

## Priority 10 — Company Context tab

### 10.1 Why
Agents need to know what the company does, what it sells, tone of voice, competitors — to act with the right context from day one.

### 10.2 What
- New "Company" tab in dashboard
- Form fields: company name, description, products/services, target audience, tone of voice, competitors, unique selling points, custom instructions
- Stored in `data/company-context.json`
- Injected into agent prompts automatically

### 10.3 Files
- `dashboard/src/routes/Company.tsx` — new page with form
- `dashboard/src/index.tsx` — add Company tab
- `plugin/hbo-plugin/state.py` — add `get_company_context()`, `save_company_context()`
- `plugin/hbo-plugin/plugin_api.py` — add `GET/POST /company-context`

---

## File change summary

| File | Changes |
|------|---------|
| `plugin/hbo-plugin/plugin_api.py` | Add POST/DELETE/PUT routes for leads, actions, signals + stats + company context |
| `plugin/hbo-plugin/state.py` | Add `append_lead`, `update_lead`, `resolve_signal`, `remove_action`, `get_stats`, `get/save_company_context` |
| `plugin/hbo-plugin/sources/sheets.py` | **NEW** — Google Sheets import: fetch rows, normalize, append leads |
| `plugin/hbo-plugin/sources/gmail.py` | **NEW** — Gmail send after approval, proactive signal detection |
| `plugin/hbo-plugin/sources/google_maps.py` | **NEW** — Google Places lead search (future) |
| `plugin/hbo-plugin/sources/registry.py` | **NEW** — data source registry for dynamic adapters |
| `plugin/hbo-plugin/tools.py` | Add `hbo_import_leads_from_sheets`, `hbo_send_approval_email` |
| `dashboard/src/api/hooks.ts` | Add `postJSON` helper for POST with body |
| `dashboard/src/routes/Actions.tsx` | Add create form, feedback, delete button |
| `dashboard/src/routes/Leads.tsx` | Add create form, edit modal |
| `dashboard/src/routes/Signals.tsx` | New page — list, create, resolve |
| `dashboard/src/routes/Workflows.tsx` | Add output panel, run history columns |
| `dashboard/src/routes/Setup.tsx` | Add reset demo button |
| `dashboard/src/routes/Overview.tsx` | **Redesign** — charts, funnel, segments, scores, timeline |
| `dashboard/src/routes/Company.tsx` | **NEW** — company context form |
| `dashboard/src/components/` | **NEW** — chart components (FunnelChart, BarChart, PieChart) |
| `dashboard/src/index.tsx` | Add Signals tab + Company tab |
| `skills/connect-source/SKILL.md` | **NEW** — data source onboarding skill |
| `skills/create-agent/SKILL.md` | **NEW** — agent builder skill |
| `skills/search-leads/SKILL.md` | **NEW** — lead search skill |
| `skills/demo-tour/SKILL.md` | **NEW** — onboarding tour skill |
| `skills/health-check/SKILL.md` | **NEW** — system health audit skill |
| `skills/export-report/SKILL.md` | **NEW** — export and reporting skill |
| `skills/customize/SKILL.md` | **NEW** — system customization skill |
| `profiles/_template/` | **NEW** — base template for dynamic agent creation |

---

## Implementation order

1. ~~Fix approve/reject feedback (1.1)~~ ✅
2. ~~Add create Lead form (2.1)~~ ✅
3. ~~Add create Action form (2.2)~~ ✅
4. ~~Add Signals page (1.3, 2.3, 2.4)~~ ✅
5. ~~Workflow output panel (1.2, 1.4)~~ ✅
6. ~~Reset button (3.1)~~ ✅
7. ~~Edit/Delete (3.2, 3.3)~~ ✅
8. ~~Google Sheets integration (5.2)~~ ✅
9. ~~Gmail follow-up emails (5.3)~~ ✅
10. ~~Mode toggle + bridge status (5.7)~~ ✅
11. Re-link expired connections (5.6) — manual
12. **Company Context tab** (10) — high value, low effort
13. **Dashboard Overview redesign** (8) — charts, funnel, segments
14. Profile skills & cron (6.1, 6.2)
15. Skills system (9.1–9.7)
16. Additional tests (7.2) + CI (7.3)
17. Phase 6 demo polish — script, screenshots, video, GitHub Pages
18. HubSpot sync (5.4) + proactive signals (5.5) — future
