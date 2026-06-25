---
name: HBO Plugin
description: Hermes-native business operations — devtool docs and dense ops dashboard
colors:
  accent: "#4A9EFF"
  accent-hover: "#3B82F6"
  surface: "#F7F8FC"
  surface-raised: "#FFFFFF"
  surface-sunken: "#EEF1F7"
  text: "#2A3142"
  text-muted: "#6B7589"
  border: "#D8DEEA"
  footer-bg: "#141A26"
typography:
  display:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Source Code Pro, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
spacing:
  sm: "0.75rem"
  md: "1.25rem"
  lg: "2rem"
  section: "clamp(3rem, 6vw, 5rem)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
---

# Design System: HBO Plugin

## 1. Overview

**Creative North Star: "The Control Room Manual"**

HBO Plugin looks like serious infrastructure documentation for people who run agents in production: crisp type, tinted cool neutrals, one confident blue accent, and layouts that teach the operating loop instead of selling vibes. The docs homepage is a brand surface; the Hermes dashboard is a product surface. Both share tokens but not layout recipes.

We reject SaaS landing clichés, AI-purple gradients, emoji-as-icons, and decorative glass. Depth comes from surface tiers (sunken / raised), hairline borders, and restrained glow on interaction, not from stacked identical cards.

**Key Characteristics:**

- OKLCH tokens with hue 220; neutrals tinted toward blue, never pure black or white
- Manrope for UI type; Source Code Pro for labels, paths, and terminal blocks
- Asymmetric homepage sections (split hero, bento features, horizontal workflow track)
- Motion only on hover/focus; disabled under `prefers-reduced-motion`
- SVG stroke icons at 1.75px; no emoji in feature lists

## 2. Colors

Cool devtool palette: restrained accent on tinted surfaces.

### Primary

- **Hermes Signal Blue** (`#4A9EFF` / `oklch(0.62 0.19 220)`): CTAs, active nav, step markers, icon wells. Rare enough to signal action, not wallpaper.
- **Signal Blue Pressed** (`#3B82F6` / `oklch(0.56 0.2 220)`): hover and pressed primary buttons.

### Neutral

- **Console Surface** (`oklch(0.98 0.008 220)` light / `oklch(0.14 0.02 220)` dark): page background.
- **Panel Raised** (`oklch(1 0.004 220)` light / `oklch(0.18 0.025 220)` dark): cards, hero aside, bento cells.
- **Panel Sunken** (`oklch(0.94 0.012 220)` light / `oklch(0.11 0.018 220)` dark): alternating sections, code well backdrop.
- **Ink Muted** (`oklch(0.48 0.025 220)` light / `oklch(0.68 0.02 220)` dark): secondary copy, list intros.
- **Hairline Border** (`oklch(0.88 0.015 220)` light / `oklch(0.28 0.025 220)` dark): panels, terminal chrome, diagram frame.

### Named Rules

**The Tinted Neutral Rule.** Every gray carries a trace of hue 220. No `#000`, no `#fff`, no warm paper creams on the docs site.

**The One Accent Rule.** Blue is the only saturated brand color on marketing pages. Status colors in the dashboard may add semantic greens/ambers but docs stay single-accent.

## 3. Typography

**Display Font:** Manrope (system-ui fallback)  
**Body Font:** Manrope (system-ui fallback)  
**Label/Mono Font:** Source Code Pro (ui-monospace fallback)

**Character:** Geometric-humanist sans with tight display tracking; mono for package paths, eyebrows, and terminal prompts.

### Hierarchy

- **Display** (700, `clamp(2.25rem, 5vw, 3.25rem)`, line-height 1.05): homepage hero title only.
- **Headline** (700, `clamp(1.75rem, 3vw, 2.25rem)`, line-height 1.15): section titles across homepage components.
- **Title** (600, ~1.05–1.1rem): card and step titles.
- **Body** (400, 0.92–1.05rem, line-height 1.55–1.65, max ~65ch): paragraphs and feature copy.
- **Label** (600, 0.72–0.75rem, uppercase, letter-spacing 0.08–0.1em): eyebrows, terminal labels, footer column titles.

**The Mono Labels Rule.** Uppercase mono eyebrows appear at most once per three sections on the homepage.

## 4. Elevation

Flat-by-default with tonal layering. Shadows appear on hover (buttons, bento cells) and on hero terminal / architecture diagram frames.

### Shadow Vocabulary

- **Accent glow** (`0 6px 20px var(--hbo-glow)`): primary button hover.
- **Panel lift** (`0 16px 40px oklch(0 0 0 / 0.12)`): package card, terminal block.
- **Diagram frame** (`0 24px 60px oklch(0 0 0 / 0.2)`): architecture screenshot.

**The Flat Section Rule.** Section backgrounds alternate via surface tokens, not heavy drop shadows on every block.

## 5. Components

### Buttons

- **Shape:** moderately rounded (10px / `--ifm-global-radius`)
- **Primary:** accent fill, white text, subtle ring shadow; hover lifts 1px with accent glow
- **Outline:** transparent fill, accent text and border; no fill on hover unless theme requires
- **Active:** `scale(0.98)`; disabled under reduced motion

### Cards / Containers

- **Corner Style:** 12–14px on marketing panels; 10px on icon wells
- **Background:** raised or sunken surface; accent tint only on featured bento cells
- **Border:** 1px hairline; hover shifts border toward accent at 45% opacity
- **Internal Padding:** 1.25–2rem by section density

### Terminal / Code blocks

- **Style:** sunken near-black panel (`oklch(0.11 0.02 220)`), mono body at 0.8rem
- **Chrome:** three traffic-light dots + filename label in mono
- **Use:** install prompt, package manifest paths, not generic code samples

### Navigation (docs)

- **Style:** 4rem height, backdrop blur, hairline bottom border
- **Typography:** 600 title, 500 links at 0.92rem

### Bento feature grid

- **Layout:** 3-column grid with `wide` (span 2) and `tall` (span 2 rows) cells
- **Mobile:** single column collapse
- **Icons:** 2.5rem rounded wells with accent-tinted background

## 6. Do's and Don'ts

### Do:

- **Do** use OKLCH tokens from `apps/docs/src/css/custom.css` as the source of truth for docs.
- **Do** vary section layout families on the homepage (split hero, dual panels, horizontal track, bento, terminal split).
- **Do** use inline SVG icons from `apps/docs/src/components/icons.tsx`.
- **Do** keep hero subcopy under ~20 words visible above the fold with CTAs present.
- **Do** apply `prefers-reduced-motion` overrides for transforms and scroll behavior.

### Don't:

- **Don't** use emoji as feature icons on the docs site.
- **Don't** ship identical three-column feature card grids or hero metric templates (12 tools / 3 profiles / 8 pages).
- **Don't** use gradient text, side-stripe borders, or decorative glassmorphism on marketing sections.
- **Don't** use pure `#000000` or `#ffffff` for text or backgrounds.
- **Don't** paste fake dashboard UI built from divs; use real architecture diagrams or terminal content.
- **Don't** apply homepage marketing layouts to the Business Ops dashboard tab inside Hermes.
