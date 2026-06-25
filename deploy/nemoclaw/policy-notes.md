# NemoClaw network policy notes for HBO Plugin

Allow outbound only when optional bridges are used inside the sandbox.

## Endpoints

| Service | When needed |
|---------|-------------|
| pypi.org | Runtime `pip install` for plugin deps |
| npm registry | Stripe Link CLI or other npm CLIs |
| Composio API | `composio-cli` skill / bridge |
| Stripe Link API | Live spend requests (optional) |
| telegram.org | Telegram briefings (future) |

## Principle

```text
Default deny outbound.
Allow only endpoints required for enabled optional skills.
Document each allow rule in deployment README.
```

## MVP

Local demo mode needs **no** outbound from sandbox.

Composio or Stripe paths require explicit policy updates before enabling crons or bridges inside NemoClaw.
