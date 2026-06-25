# Example: Missed follow-up detection

## User

"Find leads that need follow-up and propose next steps."

## Steps

1. `hbo_get_business_context`
2. `hbo_detect_signals`
3. `hbo_run_workflow` → `inbound_sales`
4. `hbo_list_actions` status=pending

## Output

```text
SALES OPS REPORT
- Leads reviewed: 10
- Signals: 2
- Pending follow-ups: 1
- Next: approval before external send
```
