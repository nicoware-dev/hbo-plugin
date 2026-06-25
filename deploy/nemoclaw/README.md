# NemoClaw deployment for HBO Plugin

Conceptual Dockerfile for running HBO Plugin inside NemoHermes.

## Build flow

1. Start from NemoHermes base image (see NVIDIA NemoClaw docs).
2. Copy `plugin/hbo-plugin` to Hermes plugins path inside image.
3. Install Python deps if `requirements.txt` is added later.
4. Pre-build dashboard: `pnpm build:dashboard` on host before copy.

## Onboard

```bash
nemohermes onboard --name hbo-demo --from ./deploy/nemoclaw/Dockerfile
```

## Dockerfile (stub)

```dockerfile
# Replace BASE_IMAGE with current NemoHermes image from NVIDIA docs
FROM nemohermes:latest

# Hermes plugin path inside sandbox — adjust per NemoHermes layout
COPY plugin/hbo-plugin /home/hermes/.hermes/plugins/hbo-plugin

RUN hermes plugins enable hbo-plugin || true

EXPOSE 18789 8642
```

> **Note:** Exact base image and paths depend on NemoHermes version. Test during hackathon setup.

## Smoke test (2026-06-25)

| Step | Result |
|------|--------|
| `docker build -f deploy/nemoclaw/Dockerfile` with `BASE_IMAGE=node:22-bookworm-slim` | **Blocked** — Docker Desktop not running on dev host (`dockerDesktopLinuxEngine` pipe missing) |
| Dockerfile syntax | Valid — copies `plugin/hbo-plugin` to `${HERMES_HOME}/.hermes/plugins/hbo-plugin` |
| Real NemoHermes base | Pending — replace `BASE_IMAGE` with NVIDIA image when available |

Re-run when Docker is available:

```bash
pnpm build:dashboard
docker build -f deploy/nemoclaw/Dockerfile --build-arg BASE_IMAGE=nemohermes:latest -t hbo-nemoclaw:smoke .
```

## Verify

- Dashboard at port 18789 shows Business Ops tab
- `GET /api/plugins/hbo-plugin/workspace` returns demo summary
