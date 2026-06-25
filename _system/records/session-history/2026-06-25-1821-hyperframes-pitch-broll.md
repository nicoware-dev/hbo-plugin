---
type: session
title: HyperFrames pitch B-roll — 10 scenes
date: 2026-06-25
time: 18:21
session_id: 2026-06-25-1821
topics:
  - hyperframes
  - demo-video
  - pitch-b-roll
workspace_paths:
  - videos/hbo-pitch
status: closed
related:
  - 2026-06-25-2118-docs-marketing-images.md
---

# HyperFrames pitch B-roll — 10 scenes

## Summary

Planned and built ten HyperFrames B-roll scenes for the hackathon demo video: dark HBO docs branding, English copy, SFX-only audio. Batch 1 covers product overview (hook, problem, workflow, package, agents); batch 2 follows `_local/demo-video-plan.md` (data chaos, signal storm, operating layer, install terminal, approve≠execute). All scenes rendered at `-q high` (1920×1080). The `videos/` tree stays local and was added to root `.gitignore` so renders and HyperFrames scaffold are not pushed.

## Done

- Scaffolded `videos/hbo-pitch/` via `npx hyperframes init`
- Shared assets: `hbo-theme.css` (dark tokens), logo, local Manrope/Source Code Pro fonts, ffmpeg SFX, runtime architecture PNG
- Batch 1 compositions: `scene-01-hook` … `scene-05-agents` (8–10s each)
- Batch 2 compositions: `scene-06-data-chaos` … `scene-10-approve-execute` (7–9s each)
- Draft then high-quality renders for all 10 → `videos/hbo-pitch/renders/*.mp4` (~8.7 MB total)
- Documented edit order for 2:15 trailer in `videos/hbo-pitch/README.md`
- Added `videos/` to root `.gitignore`

## Decisions

- **English on-screen**, dark mode, HBO hue 220 (not plan’s cyan/purple) for site consistency
- **SFX only** in clips; voiceover to be added in external editor
- **`videos/` gitignored** — internal/heavy assets (MP4s, `.agents/`, logo copy); source HTML/CSS remains local only
- Sub-composition paths use root-relative `assets/` and `#root` styling per HyperFrames lint rules

## Files changed

- `.gitignore` — ignore `videos/`
- `videos/hbo-pitch/` — full HyperFrames project (local only, not committed)
- `_system/records/session-history/` — this log + index

## Open / next

- Edit 2:15 trailer per `_local/demo-video-plan.md` (B-roll + screen recordings)
- Optional: scene 11 “Local demo first / bridges optional” (Composio, NemoClaw, Stripe Link)
- Optional: ffmpeg concat script or mute-audio exports for editor
- Record docs landing, dashboard, Actions approve, Audit log for demo proof shots

## Notes

- Suggested B-roll order: `06 → 07 → 08 → 01 → [docs] → 09 → [dashboard] → 03 → 05 → [actions] → 10 → [audit] → 04 → 01`
- High render command: `npx hyperframes render -c compositions/scene-NN-….html -o renders/….mp4 -q high`
