# Example: Hackathon onboard

## User

"Deploy HBO Plugin on NemoClaw for the hackathon."

## Steps

1. Build from `deploy/nemoclaw/Dockerfile`
2. `nemohermes onboard --name hbo-demo --from ./deploy/nemoclaw/Dockerfile`
3. Open dashboard :18789 → Business Ops tab
4. Select Nemotron inference provider

## Output

```text
NEMOCLAW SETUP REPORT
- Image: built
- Dashboard: http://localhost:18789
- Plugin: hbo-plugin enabled
- Inference: Nemotron configured
- Network policy: n/a (local-demo only)
```

Agent does not run `skill install` for full plugin package.
