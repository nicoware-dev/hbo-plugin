# Example: Morning daily briefing

## User

"Give me today's ops briefing."

## Agent steps

1. `hbo_get_business_context`
2. `hbo_get_workspace`
3. `hbo_run_workflow` with `workflow: daily_ops_briefing`
4. `hbo_list_actions` with `status: pending`

## Expected output

```text
OPS LEAD PLAYBOOK REPORT
- Briefing: daily_ops_briefing
- Pending actions: 3 across sales-ops, growth
- Signals: 2 open
- Bridge: local-demo
- Next: review act_001, act_002, act_003 in dashboard Actions tab
```

Agent highlights high-priority items and reminds user that mock Stripe spend demos involve no real payment.
