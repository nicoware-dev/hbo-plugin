# HBO Plugin — Improvement Plan

**Created:** 2026-06-25  
**Last updated:** 2026-06-25 (oleadas 0–5 implementation)  
**Status:** In progress — Phase 6 demo polish + P9 skills  
**Phase:** Post-MVP — extensibility skills & public demo

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
| Tests | **48+** passing (`pnpm test:plugin`) |
| Priority 8 Overview charts | Done — funnel, segments, scores, priorities |
| Priority 10 Business context tab | Done — `business-context.json` + form |
| Sheets phone fix | Done — `_clean_phone()` preserves `+` |
| Profile cron blueprints | Done — 5 files in `profiles/*/cron/` |
| Automations dashboard | Done — Setup + `GET /automations` |
| Sponsor integrations | Done — docs + 2 optional skills + deploy stub |

---

## Current State

The HBO Plugin has **17 `hbo_*` tools**, 3 profiles, full workflow outputs, and approve/reject with audit trail via CLI and dashboard.

**Dashboard (10 pages):** Overview, Agents, Workflows, Leads, Actions, Signals, **Business**, Audit, Tool Bridges, Setup.

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

### 4.1 Inbound Sales — conversation review ✅
- **Done:** `GET /conversations`, message threads in demo data, `ConversationReviewPanel` on Workflows with inline approve/reject

### 4.2 Outbound Growth — outreach preview ✅
- **Done:** `OutreachPreviewPanel` in Workflows.tsx; `outreachPreview` on Actions rows

### 4.3 Daily Briefing — schedule ✅ (manual cron)
- **Done:** Cron blueprints + Setup **Copy enable command** + DEMO_SCRIPT step 6b

---

## Priority 5 — Composio bridge (real data)

### 5.1 Composio CLI status
- Install Composio CLI in WSL Ubuntu (Windows) or natively (macOS/Linux)
- Verify with `composio whoami` after setup (`scripts/setup-composio-windows.ps1` on Windows)
- Re-link expired connections as needed (`composio link <toolkit>`)

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

### 5.4 HubSpot sync — **Deferred / out of scope (MVP)**
- Map HubSpot contacts → HBO leads
- Create HubSpot tickets from approved actions

### 5.5 Proactive signals from Gmail — **Deferred / out of scope (MVP)**
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

### 6.1 Profile skills directories ✅
- **Done:** `sales-ops-playbook`, `growth-playbook`, `ops-lead-playbook` in `profiles/*/skills/`

### 6.2 Cron jobs ✅
- **Done:** 5 cron blueprints in `profiles/*/cron/` (sales-source-sync, unread-email-review, prospect-source-sync, daily-ops-briefing, weekly-ops-review)
- **Done:** `GET /automations` catalog + Setup UI (recommended, not auto-enabled)
- See `_local/hbo-plugin-cron-automations-note.md` for architecture

### 6.3 Profile-specific SOUL.md enhancements
- Add trigger conditions, preferred workflows, escalation rules

---

## Priority 7 — Testing & CI

### 7.1 Current test coverage
- **48+ tests** passing (business_rules, plugin_api, execution, sheets, mutations, business_context, sync)
- Missing: dashboard component tests (deferred)

### 7.2 Add tests
- `test_workflows.py` — inbound_sales, outbound_growth, daily_briefing outputs
- `test_state.py` — append/update/reset operations
- `test_mutations.py` — validation and response shape ✅

### 7.3 GitHub Actions ✅
- CI pipeline: pytest + pnpm build on push — `.github/workflows/ci.yml`

---

## Priority 8 — Dashboard Overview redesign ✅

Implemented CSS bar charts (no heavy chart library): funnel, segments, score bins, priorities, agent workload. API: `GET /stats`.

---

## Priority 9 — Skills system (extensibility) ✅

| Skill | File | Status |
|-------|------|--------|
| 9.4 Demo tour | `skills/demo-tour/SKILL.md` | Done |
| 9.5 Health check | `skills/health-check/SKILL.md` | Done |
| 9.6 Export report | `skills/export-report/SKILL.md` | Done |
| 9.1 Connect source | `skills/connect-source/SKILL.md` | Done |
| 9.3 Search leads | `skills/search-leads/SKILL.md` | Done (Composio generic; no google_maps) |
| 9.2 Create agent | `skills/create-agent/SKILL.md` + `profiles/_template/` | Done |
| 9.7 Customize | `skills/customize/SKILL.md` | Done |

---

## Priority 10 — Business Context tab ✅

Implemented Business tab, `business-context.json`, `GET/POST /business-context`, `hbo_get_business_context` tool. SOUL templates instruct agents to load context at session start.

**Future:** auto-inject `promptBlock` into Hermes profile system prompt via distribution.yaml hooks.

---

## Priority 11 — Cron automations (profile distributions) ✅

Per cron automations note: crons in profiles, catalog in plugin, Setup UI, manual enable only.

---

## Priority 12 — Sponsor integrations (optional) ✅

NVIDIA NemoClaw docs/skill, Stripe Link CLI docs/skill, `deploy/nemoclaw/` Dockerfile, mock spend action, Docusaurus Sponsor section.

**Pending:** tested NemoClaw Dockerfile against real NemoHermes image.

---

## Priority 13 — Sheets phone import fix ✅

`_clean_phone()` in `sources/sheets.py`. Format phone column as Plain text in Sheets.

---

## File change summary

| File | Changes |
|------|---------|
| `plugin/hbo-plugin/plugin_api.py` | Add POST/DELETE/PUT routes for leads, actions, signals + stats + company context |
| `plugin/hbo-plugin/state.py` | `get_stats`, `get/save_business_context`, `format_business_context_prompt` |
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
| `dashboard/src/routes/Business.tsx` | Business context form |
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
12. ~~Business Context tab (10)~~ ✅
13. ~~Dashboard Overview redesign (8)~~ ✅
14. ~~Profile cron blueprints (6.2)~~ ✅
15. ~~Sponsor integrations (12)~~ ✅
16. ~~Sheets phone fix (13)~~ ✅
17. ~~Profile skills (6.1)~~ ✅
18. ~~Skills system (9.1–9.7)~~ ✅
19. ~~Additional tests (7.2)~~ ✅ + CI (7.3) ✅
20. ~~Phase 6 demo polish~~ — screenshots in docs; video project `videos/hbo-pitch/` lint-clean
21. HubSpot sync (5.4) + proactive signals (5.5) — future
22. ~~Response consistency (11.1)~~ ✅ — `mutations.py` standardized shape
23. ~~Input validation (11.2)~~ ✅ — enums + score 0–100 via `schemas.parse_score`
24. ~~Lead pagination (12.1)~~ ✅
25. ~~Search & filters (12.2)~~ ✅
26. ~~Notification badges (12.3)~~ ✅
27. ~~Visual timeline (12.4)~~ ✅
28. ~~Export CSV (12.5)~~ ✅

---

## Priority 11 — Response Consistency & Input Validation

### 11.1 Response shape consistency ✅
- **Done:** `mutations.py` returns `{success, lead|action|signal, auditEvent}`; approve/reject/execute in `business_rules.py` match

### 11.2 Input validation ✅
- **Done:** Enums validated in `mutations.py`; score 0–100 via `schemas.parse_score()` (API + Sheets import)

---

## Priority 12 — Dashboard UX Improvements

### 12.1 Lead pagination ✅
- **Done:** 10 per page in `Leads.tsx`

### 12.2 Search and filters ✅
- **Done:** Client-side search + filter dropdowns in `Leads.tsx`

### 12.3 Notification badges ✅
- **Done:** `pendingActions` / `openSignals` badges in `index.tsx`

### 12.4 Visual timeline chart ✅
- **Done:** `auditTimeline` bar chart in `Overview.tsx`

### 12.5 Export to CSV ✅
- **Done:** Export button in `Leads.tsx`
