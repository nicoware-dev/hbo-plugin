# Example: First demo session

## User

"Show me the Business Ops demo without setting up any APIs."

## Steps

1. `hbo_load_demo_data`
2. `hbo_get_workspace`
3. Direct user to Business Ops dashboard tab
4. Optional: `hbo_run_workflow` → `inbound_sales`
5. `hbo_list_actions` status=pending

## Output

```text
LOCAL DEMO REPORT
- State: loaded
- Bridge: local-demo
- Workflow run: inbound_sales
- Pending actions: 1
- Next: approve act_002 in Business Ops tab
```

Agent states no Composio or Stripe setup required.
