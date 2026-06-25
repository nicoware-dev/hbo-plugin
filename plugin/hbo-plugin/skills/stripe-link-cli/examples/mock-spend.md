# Example: Mock approved spend in HBO demo

## User

"Demo an approved software purchase without installing Link CLI."

## Steps

1. Explain two-layer approval (HBO then Link)
2. Guide user to approve `mock_approved_spend_request` in dashboard
3. `hbo_execute_action` after approval
4. `hbo_list_audit_events` — confirm mock audit entry

## Output

```text
STRIPE LINK CLI REPORT
- Mode: mock demo
- HBO action: approved
- Credential type: n/a (mock)
- Next: mock audit recorded — no real card issued
```

No PAN or SPT in chat.
