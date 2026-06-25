---
name: local-demo
description: Run the Business Ops Demo without external credentials. Use to load demo data, run workflows, approve actions, and open the dashboard.
---

# Local Demo Mode

Bootstrap HBO Plugin with bundled local JSON state — no Composio, Stripe Link, or external APIs required.

## Contract

- Demo runs entirely on file-backed JSON state under plugin data path
- Bridge mode `local-demo` limits `hbo_execute_action` to mock effects
- User approves actions in dashboard before any execute step
- Point to **composio** or **stripe-link-cli** only when user asks for live bridges

## When to use

- First run or hackathon demo without credentials
- Verify plugin tools, workflows, and dashboard tab
- Train on approval loop before enabling external bridges

## When to skip

- Live Gmail, Sheets, Slack → **composio**
- Real or Link payment credentials → **stripe-link-cli**
- NemoClaw sandbox deploy → **nvidia-nemoclaw-setup**
- Domain-specific sales/growth playbooks when user already has a profile loaded

## Phases

1. **Load.** `hbo_load_demo_data` — verify demo state present.
2. **Inspect.** `hbo_get_workspace` — summary of agents, actions, signals.
3. **Dashboard.** Open Hermes **Business Ops** tab for UI review.
4. **Workflow.** `hbo_run_workflow` — `inbound_sales`, `outbound_growth`, or `daily_ops_briefing`.
5. **Approve.** Dashboard or `hbo_approve_action` / `hbo_reject_action`.
6. **Execute.** `hbo_execute_action` — mock only in local-demo bridge mode.

## Demo workflows

| Workflow | Typical agent |
|----------|----------------|
| `inbound_sales` | Sales Ops |
| `outbound_growth` | Growth |
| `daily_ops_briefing` | Ops Lead |

## Quick start

1. Call `hbo_load_demo_data` to verify demo state
2. Call `hbo_get_workspace` for workspace summary
3. Open the Hermes dashboard **Business Ops** tab
4. Run workflows via `hbo_run_workflow`
5. Approve or reject actions via dashboard or `hbo_approve_action` / `hbo_reject_action`

## Output Format

```
LOCAL DEMO REPORT
- State: loaded | already present
- Bridge: local-demo
- Workflow run: {name} | none
- Pending actions: {n}
- Next: open Business Ops tab | approve {ids}
```

## Anti-Patterns

| Don't | Why |
|-------|-----|
| Install Composio for basic demo | Unnecessary credentials |
| Claim external sends occurred | Mock execute in local-demo |
| Skip approval before execute | Two-step gate applies even in demo |
| Use for production bridge setup | **composio** / **stripe-link-cli** |

## vs sibling skills

| Skill | Use for |
|-------|---------|
| **local-demo** (this) | No-credentials bootstrap |
| **composio** | External app bridge |
| **sales-ops** / **growth-ops** / **ops-lead** | Domain workflows after demo load |
