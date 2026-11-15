# Project SIGNAL — Design & Architecture Notes

## Concept & Vision
**SIGNAL** tells the authentic journey of Naveen Kumar K: an electronics and communication engineer who pivoted into full-stack development. The profile README is engineered as one unified physical-digital artifact — an instrument panel where an analog signal progressively converts into digital logic, then into interactive software.

## Core Tenets
1. **Engineered Object, Not a Template**: Every element belongs to a single 1200-wide schematic grid. Zero third-party widget counters, zero badge walls, zero generic stats cards.
2. **Master Clock Coherence**: All motion across panels is synchronized to a single 12-second master clock using SMIL (`keySplines="0.4 0 0.2 1"`).
3. **Restrained Tone**: A single accent color (`#F5A524` dark / `#B45309` light) on a technical neutral canvas (`#0C0E11` / `#F5F3EE`), separated by 1px neutral hairlines (`#262B33` / `#D8D3C8`).
4. **Deterministic Build**: Driven entirely by `src/profile.config.json` and `src/theme.mjs`. Rendered to pure SVGs with pre-outlined vector text (`opentype.js` or `fontTools`) so GitHub's camo proxy cannot break typography or layouts.
5. **Strict First-Frame Rule**: With animation disabled or reduced, frame 0 is visually complete and informative.

## Architectural Phases
- **Phase 0: Plan & Fact Alignment** (Current)
  - Freeze requirements, establish design token system, configure question set.
- **Phase 1: Render Lab & Camo Matrix**
  - Stress-test GitHub camo proxy quirks with targeted SVG micro-fixtures in `render-lab/`.
  - Validate SMIL, morphing, color schemes, filters, and font-outlining.
- **Phase 2: System, Tokens & Hero Component**
  - Implement token engine, build scripts, Space Grotesk / JetBrains Mono font outline pipeline, and dual-theme Hero panel (oscilloscope waveform morph + photo/monogram variants).
- **Phase 3: Signal Trace, IC Work Grid, Silkscreen BOM & Terminal Connect**
  - Build Panels B, C, D, and F.
  - Assemble README with `<picture>` dark/light toggles and accessible companion Markdown tables.
- **Phase 4: Live Activity Trace**
  - Implement Panel E (oscilloscope calendar amplitude), GraphQL query script, and GitHub Actions workflow.
- **Phase 5: Verification, Benchmarks & Polish**
  - Test at 1280px, 820px, and 390px. Verify WCAG AA contrast, < 1.5MB total payload, and license boundary.



## Checkpoint 0 Decisions
- **Confirmed Identity**: Naveen Kumar K (`Naveenkumar2313`), Software Developer at PyGenicArc (Bengaluru) since March 2025.
- **Tagline**: Anchor = "Signal to software."; Subtagline = "I make complex systems visible.".
- **Role Sequence (4s per title)**: Software Developer -> Full-Stack Developer -> Embedded & Interactive Systems Builder.
- **Photo Strategy**: Cutout photo saved as `inputs/naveen-cutout.png`. Configured with `photo: true|false` toggle, defaulting to `true`. High-quality downscaled WebP/PNG embedded in SVG (< 120KB). Monogram `NK` fallback. Raw `inputs/` ignored in git.
- **BOM Matrix**: Confirmed 3 groups (Languages, Web & Interactive, Hardware & Systems), 4 to 5 entries each.
- **Selected Work**: 6 IC cards (U1–U6) representing 4 personal systems + 2 generic employer platforms. 3 additional generic employer systems noted below grid. All 4 personal projects currently have `NONE` public repos; will display cleanly without dead link styling.


## Phase 1 Findings & Render Matrix Summary
- **Render Lab Execution**: Created 14 SVG stress fixtures in `render-lab/` and verified with multi-viewport headless Chrome testing.
- **Webfont Confirmation**: Confirmed `@font-face` is blocked inside `<img>` by browser sandboxes. All display text will be outlined to SVG `<path>` vectors using `opentype.js`.
- **SMIL Superiority**: Native SMIL (`animate`, `animateTransform`, `animateMotion`, and path `d` morphing) passed with 100% fidelity.
- **Responsive Sizing**: Documented 1200-wide viewBox scaling on 390px mobile screens (0.33x factor). Essential text rule enforced (>= 30 units).
- **Theme Support**: Verified `<picture>` switching between dark and light SVGs.
