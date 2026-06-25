# HBO Plugin — Demo Script

Canonical 3-minute demo path for hackathon, video, or live walkthrough.

---

## 1. Demo goal

Show that HBO Plugin turns Hermes into a **business operations workspace**:

- Native plugin + Business Ops dashboard tab
- Three specialized agent profiles
- Self-contained demo data (no external credentials required)
- Human-approved actions with audit trail
- Optional Composio bridge for real Gmail/Sheets

---

## 2. Pre-demo checklist

```bash
pnpm install
pnpm build:dashboard
./scripts/demo-reset.sh          # or .\scripts\demo-reset.ps1 on Windows
# Restart Hermes dashboard process
hermes plugins enable hbo-plugin
```

Verify:

- [ ] Business Ops tab loads (not blank)
- [ ] Overview shows stat cards and charts
- [ ] Setup → Reset demo works
- [ ] Bridge mode is `local-demo` (default)

---

## 3. Install flow (if starting fresh)

```bash
cp -r plugin/hbo-plugin ~/.hermes/plugins/hbo-plugin   # or sync-plugin script
hermes plugins enable hbo-plugin
hermes profile install ./profiles/sales-ops-agent --alias sales-ops
hermes profile install ./profiles/growth-agent --alias growth
hermes profile install ./profiles/ops-lead-agent --alias ops-lead
```

Restart Hermes dashboard. Open **Business Ops** tab.

---

## 4. Business Ops dashboard walkthrough

| Step | Page | What to show |
|------|------|--------------|
| 1 | Overview | Funnel, segments, pending actions card |
| 2 | Agents | Three configured agents |
| 3 | Workflows | Last run status columns |
| 4 | Leads | Demo lead list |
| 5 | Business | Company context form |
| 6 | Setup | Reset demo + recommended automations |

---

## 5. Profiles walkthrough

Mention three installed profiles:

- **Sales Ops** — inbound sales, signals, follow-ups
- **Growth** — outbound batches, prospect scoring
- **Ops Lead** — daily briefing, approvals, audit

Each profile has a SOUL.md and local playbook skill.

---

## 6. Run workflows

From **Workflows** page or Hermes chat:

```text
hbo_run_workflow inbound_sales
hbo_run_workflow outbound_growth
hbo_run_workflow daily_ops_briefing
```

Show output panels: signals created, action proposals, briefing title.

For **inbound_sales**, expand the **Conversation review** panel: read the message thread and approve/reject the linked review action inline.

---

## 6b. Enable daily briefing cron (optional)

From **Setup** → Recommended Automations → **Copy enable command** on **Daily Ops Briefing**, then run in terminal:

```bash
hermes cron add --name daily-ops-briefing --schedule "0 9 * * 1-5" \
  --agent ops-lead --prompt "Run Daily Ops Briefing per profiles/ops-lead-agent/cron/daily-ops-briefing.md"
```

Crons are manual — review each blueprint before enabling.

---

## 7. Approve / reject / execute

1. Open **Actions** → filter `pending`
2. **Approve** one follow-up action → status becomes `approved`, audit event `action_approved`
3. Explain: approve records intent only
4. If bridge is `composio`/`hybrid` and action is executable, click **Execute** → audit `action_executed`
5. In `local-demo` mode, Execute is only for mock actions (e.g. Stripe spend demo)

**Reject** another pending action to show `action_rejected` in audit.

---

## 8. Audit log

Open **Audit** tab. Point to:

- `workflow_run` events
- `action_approved` vs `action_executed` (separate events)
- `action_rejected`

---

## 9. Composio bridge (optional)

Only if Composio CLI is installed and logged in:

1. **Tool Bridges** → set mode to `composio` or `hybrid`
2. Show connection status via `composio whoami`
3. Optional: `hbo_import_leads_from_sheets` or sales-source-sync

Demo works fully without this step.

---

## 10. Sponsor integrations (optional mention)

- **NVIDIA NemoClaw** — deployment/runtime path, not a business workflow
- **Stripe Link CLI** — mock approved spend action in demo

See docs site Integrations section.

---

## 11. Closing pitch

```text
HBO Plugin installs as a native Hermes extension.

It adds a Business Ops dashboard, ships three agent profiles,
runs a self-contained demo with auditable approvals,
and optionally bridges to Gmail and Sheets via Composio.
```

---

## Quick reset between takes

```bash
./scripts/demo-reset.sh
# Restart Hermes dashboard
# Setup → Reset demo (or hbo_load_demo_data in chat)
```

Target: under one minute to fresh state.
