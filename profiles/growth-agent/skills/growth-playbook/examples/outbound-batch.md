# Example: Weekly outbound batch

## User

"Run this week's outbound growth batch for wholesale prospects."

## Agent steps

1. `hbo_get_business_context` — pull USPs for wholesale segment
2. `hbo_list_leads` — filter wholesale, score fit
3. `hbo_run_workflow` with `workflow: outbound_growth`
4. `hbo_list_actions` with `status: pending`

## Expected output

```text
GROWTH PLAYBOOK REPORT
- Segment: wholesale
- Workflow: outbound_growth
- Pending actions: 5
- Next: user approval on act_003, act_004, act_005, act_006, act_007
```

Agent summarizes one preview action (subject + lead name) and states approval is required before `hbo_execute_action`.
