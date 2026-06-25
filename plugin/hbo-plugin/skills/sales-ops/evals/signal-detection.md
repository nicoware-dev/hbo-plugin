# Eval: Signal detection and proposal only

User: "Check for bot QA issues and missed follow-ups."

## Success

- [ ] Calls `hbo_detect_signals`
- [ ] Does not execute external sends
- [ ] Proposes actions via workflow or lists pending

## Fail

- Skips signal detection
- Auto-executes send
- Routes to outbound growth
