---
type: session
title: Skillify and skill-optimizer for all HBO skills
date: 2026-06-25
time: "26:00"
session_id: 2026-06-25-2600
topics: [skillify, skill-optimizer, profiles, plugin-skills, MECE]
workspace_paths: [profiles/*/skills, plugin/hbo-plugin/skills]
status: closed
related: [2026-06-25-2515-stripe-link-cli-skill.md]
---

# Skillify and skill-optimizer for all HBO skills

## Summary

Applied **skillify** and **skill-optimizer** workflows to all 11 HBO skills (3 profile playbooks + 8 plugin skills). Each skill now has Contract, Phases, Output Format, Anti-Patterns, README, examples, evals, and `skillopt-benchmark.jsonl`. Added pack-level `routing-eval.jsonl` for cross-skill disambiguation. All skills scored 10/10 on the portable checklist — **properly skilled**.

## Done

- **Profile playbooks** (`growth-playbook`, `ops-lead-playbook`, `sales-ops-playbook`): full skillify scaffold + approval-gate anti-patterns
- **Plugin domain** (`growth-ops`, `sales-ops`, `ops-lead`, `local-demo`): expanded from thin drafts to production structure
- **Plugin integration** (`composio`, `stripe-link-cli`, `nvidia-nemoclaw-setup`): Contract/Phases/Output added; rules/ kept for deep reference
- **MECE**: vs-tables document playbook ↔ domain ↔ bridge boundaries
- **Routing**: `plugin/hbo-plugin/skills/routing-eval.jsonl` (12 intents)
- **Skillopt**: 5 holdout tasks per skill with rule judges
- Git: changes landed in `4e1b1cc` (profiles) and `625de48` (plugin skills) before this save

## Decisions

- Frontmatter (`name`, `description`) left unchanged per skillify iron law
- `composio` / `stripe-link-cli` body stays as entrypoint; detail remains in `rules/`
- Crons documented as manual-enable only across all playbooks

## Files changed

- `profiles/*/skills/*-playbook/` — SKILL.md, README, examples/, evals/, skillopt-benchmark.jsonl
- `plugin/hbo-plugin/skills/*/` — same scaffold for 8 skills
- `plugin/hbo-plugin/skills/routing-eval.jsonl`

## Open / next

- Run primary evals in live Hermes sessions (optional validation)
- skill-optimizer cycle 2 on `composio` if more holdout tasks needed
- Push 16 commits ahead of origin when ready

## Notes

- SKILLOPT outcome: **accepted** — skillify expansion from ~2/10 to 10/10 checklist
- No working-tree code changes at save time; session log only
