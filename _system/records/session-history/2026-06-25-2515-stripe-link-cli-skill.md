---
type: session
title: Stripe Link CLI skill aligned with official
date: 2026-06-25
time: "25:15"
session_id: 2026-06-25-2515
topics: [stripe-link-cli, skills, link-cli, hbo-plugin]
workspace_paths: [plugin/hbo-plugin/skills/stripe-link-cli]
status: closed
related: []
---

# Stripe Link CLI skill aligned with official

## Summary

Compared HBO `stripe-link-cli` skill against Stripe's official `create-payment-credential` skill (v0.7.2) from `link-cli` repo. User chose to adopt the official flow as-is, document live path only (no code changes), and keep HBO mock demo as default. Rewrote skill with entry `SKILL.md` plus `rules/` split (official flow, HBO bridge, errors/limits).

## Done

- Gap analysis: wrong CLI commands (`stripe link` vs `link-cli`), missing auth/merchant-eval/SPT flow, no rules structure
- User decisions: (1) official skill content, (2) skill only — no `execution.py`, (3) live path documented not implemented
- New structure: `SKILL.md` (107 lines) + `rules/create-payment-credential.md`, `rules/hbo-bridge.md`, `rules/errors-limits.md`
- Frontmatter: upstream `0.7.2`, official triggers + HBO two-layer approval context
- Correct install: `npm install -g @stripe/link-cli` / `npx @stripe/link-cli`

## Decisions

- Do not align mock command in `execution.py` yet — skill/documentation only
- Live Link CLI runs are manual after HBO approval; mock `mock_approved_spend_request` stays MVP default
- Include full card + SPT/MPP (HTTP 402) flow from official skill

## Files changed

- `plugin/hbo-plugin/skills/stripe-link-cli/SKILL.md`
- `plugin/hbo-plugin/skills/stripe-link-cli/rules/create-payment-credential.md` (new)
- `plugin/hbo-plugin/skills/stripe-link-cli/rules/hbo-bridge.md` (new)
- `plugin/hbo-plugin/skills/stripe-link-cli/rules/errors-limits.md` (new)

## Open / next

- Optional: align `execution.py` mock command to `link-cli spend-request create` syntax
- Track upstream `stripe/link-cli` skill version bumps for `rules/` sync

## Notes

- Reference repo shared at `_temp/link-cli-main` (not committed)
- Unrelated unstaged work in same tree: plugin skills skillify pass, profile SOUL/playbook updates — separate commits
