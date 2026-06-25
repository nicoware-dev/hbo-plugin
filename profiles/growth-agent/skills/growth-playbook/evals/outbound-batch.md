# Eval: Outbound growth batch

User: "Run outbound growth for high-fit wholesale leads."

## Success

- [ ] Calls `hbo_get_business_context` before workflow
- [ ] Runs `hbo_run_workflow` with `outbound_growth`
- [ ] Lists pending actions; does not auto-execute
- [ ] Output includes `GROWTH PLAYBOOK REPORT` or equivalent summary
- [ ] Mentions user approval required for external send

## Fail

- Skips business context and runs workflow blindly
- Calls `hbo_execute_action` without user approval
- Routes to inbound sales or daily briefing workflows
- Attempts Composio CLI install instead of HBO tools
