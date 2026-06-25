# Example: Cross-agent morning standup

## User

"What's the ops priority this morning?"

## Steps

1. `hbo_get_business_context`
2. `hbo_get_workspace`
3. `hbo_generate_briefing` or `daily_ops_briefing` workflow
4. `hbo_list_actions` status=pending

## Output

```text
OPS LEAD REPORT
- Pending actions: 3
- Open signals: 2
- Bridge: local-demo
- Priority items: follow-up María; growth batch act_003
- Next: dashboard Actions review
```
