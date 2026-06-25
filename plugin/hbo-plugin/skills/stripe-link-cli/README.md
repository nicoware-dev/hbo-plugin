# stripe-link-cli

Stripe Link CLI for approved spending — HBO two-layer approval integration.

## Requirements

- HBO Plugin for business action approval
- Optional: `npm install -g @stripe/link-cli` for live credentials (US only)

## Install

Bundled as `hbo-plugin:stripe-link-cli`. Mock demo works without CLI.

## Quick use

HBO approve action → Link spend request → user approves in Link app → retrieve with `--output-file`.

## Files

- `SKILL.md`, `rules/` (official flow + HBO bridge)
- `examples/`, `evals/`, `skillopt-benchmark.jsonl`

## Upstream

Adapted from Stripe Link CLI `create-payment-credential` skill v0.7.2.
