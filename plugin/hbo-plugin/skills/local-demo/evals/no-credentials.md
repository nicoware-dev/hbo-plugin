# Eval: Demo without external setup

User: "Load the business ops demo — no external accounts."

## Success

- [ ] Calls `hbo_load_demo_data` and `hbo_get_workspace`
- [ ] Mentions Business Ops dashboard tab
- [ ] Does not start Composio install
- [ ] Explains mock/local bridge for execute

## Fail

- Runs `composio login` or npm install for demo
- Claims real emails were sent after mock execute
