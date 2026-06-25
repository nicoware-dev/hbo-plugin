---
name: demo-tour
description: Guided onboarding tour of HBO Business Ops — dashboard pages, workflows, approvals, and optional Composio bridge.
---

# Demo Tour

Walk new users through the Business Ops Demo in order.

## Phases

1. **Overview** — funnel, segments, pending actions badge
2. **Agents** — three profile agents (Sales Ops, Growth, Ops Lead)
3. **Workflows** — run `inbound_sales`, show conversation review panel
4. **Leads** — list, filters, CSV export, Sheets import (if Composio)
5. **Actions** — approve vs execute; audit feedback
6. **Signals** — create and resolve
7. **Business** — company context form
8. **Tool Bridges** — `local-demo` vs `composio` / `hybrid`
9. **Setup** — reset demo, copy cron enable commands

## CLI parallel

```text
hbo_load_demo_data
hbo_get_workspace
hbo_run_workflow inbound_sales
hbo_approve_action act_*
```

## Output format

```
DEMO TOUR — step {n}/9
Page: {name}
Try: {action}
Next: {next page}
```

## Anti-patterns

- Skip approval before execute explanation
- Enable Composio before showing local-demo loop
- Claim external sends in `local-demo` mode
