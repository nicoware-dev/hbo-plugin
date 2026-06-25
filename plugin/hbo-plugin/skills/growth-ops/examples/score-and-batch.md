# Example: Score and batch wholesale prospects

## User

"Score wholesale leads and prepare an outreach batch."

## Steps

1. `hbo_get_business_context`
2. `hbo_list_leads` — filter wholesale, note scores
3. `hbo_run_workflow` → `outbound_growth`
4. `hbo_list_actions` status=pending

## Output

```text
GROWTH OPS REPORT
- Segment: wholesale
- Leads scored: 8
- Pending outreach: 5
- Next: approval on act_003–act_007
```
