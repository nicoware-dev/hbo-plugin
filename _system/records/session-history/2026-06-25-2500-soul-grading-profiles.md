---
type: session
title: "SOUL grading and 90+ profile upgrades"
date: 2026-06-25
time: "25:00"
session_id: 2026-06-25-2500
topics: [soul-grader, profiles, growth-agent, sales-ops-agent, ops-lead-agent, playbooks]
workspace_paths: [profiles/growth-agent, profiles/sales-ops-agent, profiles/ops-lead-agent]
status: closed
related: [2026-06-25-2400-audit-p0-p3-implementation.md]
---

# SOUL grading and 90+ profile upgrades

## Summary

Graded all three HBO Plugin agent profiles with the soul-grader skill (68–69/100 Scaffold). Applied two remediation passes: compact identity SOULs with negations, thesis, truthfulness, and success artifacts; moved runbooks to profile playbooks; then added 90+ layers (handoff, conflict resolution, soft preferences, source of truth, authority/escalation, behavioral voice, runtime hygiene).

## Done

- soul-grader analysis of Growth, Ops Lead, and Sales Ops SOUL.md files
- Pass 1: fleet negations, core thesis, truthfulness, success, playbook pointers; tools/examples/crons moved to `*-playbook` skills
- Pass 2: operator lane, handoff routing, optimize conflict rules, soft preferences, source of truth, authority + escalation, domain-specific truth claims, workflow IDs in success, Hermes runtime note
- Estimated post-pass scores: 90–94 (Excellent band)

## Decisions

- SOUL stays identity/authority layer; operational runbooks live in profile playbooks and plugin skills
- Truthfulness blocks are domain-specific per agent, not identical fleet copy
- 90+ target appropriate before Composio-live or multi-agent production; demo MVP acceptable at Operational (~80)

## Files changed

- `profiles/growth-agent/SOUL.md`
- `profiles/growth-agent/skills/growth-playbook/SKILL.md`
- `profiles/ops-lead-agent/SOUL.md`
- `profiles/ops-lead-agent/skills/ops-lead-playbook/SKILL.md`
- `profiles/sales-ops-agent/SOUL.md`
- `profiles/sales-ops-agent/skills/sales-ops-playbook/SKILL.md`

## Open / next

- Reinstall profiles or start new Hermes sessions to load updated SOUL
- Optional pass 3: mirror handoff/conflict rules in profile playbooks
- Plugin skill skillify artifacts (README/evals) in working tree — separate commit from SOUL work

## Notes

- Grading source: `.cursor/skills/soul-grader/references/soul-md-grading-standard.md`
- Hermes loads profile SOUL on new session after edits
