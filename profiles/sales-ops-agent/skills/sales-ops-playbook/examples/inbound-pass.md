# Example: Inbound sales pass

## User

"Check for missed follow-ups and propose next steps."

## Agent steps

1. `hbo_get_business_context`
2. `hbo_list_leads` — focus needs_followup
3. `hbo_detect_signals`
4. `hbo_run_workflow` with `workflow: inbound_sales`
5. `hbo_list_actions` with `status: pending`

## Expected output

```text
SALES OPS PLAYBOOK REPORT
- Workflow: inbound_sales
- Leads reviewed: 12
- Signals: 2
- Pending actions: 1
- Next: user approval on act_002 before external send
```

Agent names the lead (e.g. María García) and does not call `hbo_execute_action` until user approves.
