# syntax=docker/dockerfile:1
# HBO Plugin — NemoHermes custom sandbox image
# Replace BASE_IMAGE with the NemoHermes image from NVIDIA docs before building.

ARG BASE_IMAGE=nemohermes:latest
FROM ${BASE_IMAGE}

LABEL org.opencontainers.image.title="hbo-plugin-nemoclaw"
LABEL org.opencontainers.image.description="Hermes Business Ops Plugin in NemoClaw sandbox"

# Hermes home inside NemoHermes sandbox (adjust if your image differs)
ENV HERMES_HOME=/home/hermes
ENV HBO_PLUGIN_PATH=${HERMES_HOME}/.hermes/plugins/hbo-plugin

WORKDIR ${HERMES_HOME}

# Copy pre-built plugin (run pnpm build:dashboard on host first)
COPY plugin/hbo-plugin ${HBO_PLUGIN_PATH}

# Optional Python deps — uncomment when requirements.txt is added
# RUN pip install --no-cache-dir -r ${HBO_PLUGIN_PATH}/requirements.txt

# Enable plugin in Hermes config if CLI available at build time
RUN if command -v hermes >/dev/null 2>&1; then \
      hermes plugins enable hbo-plugin || true; \
    fi

EXPOSE 18789 8642

# Dashboard + OpenAI-compatible API
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s \
  CMD curl -f http://localhost:18789/ || exit 1
