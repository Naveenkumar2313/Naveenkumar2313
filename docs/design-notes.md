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


## Phase 2: Design Tokens & Hero Implementation
- **Design Tokens (`src/theme.mjs`)**: Implemented complete palette across dark (`#0C0E11` / `#13161B` / `#F5A524`) and light (`#F5F3EE` / `#FBFAF7` / `#B45309`).
- **Typography Engine (`src/font-outliner.mjs`)**: Fully integrated `opentype.js` converting OFL fonts (*Space Grotesk* for display, *JetBrains Mono* for technical labels) into exact Bézier `<path>` strings with kerning and tracking compensation (-2% display, +8% mono). Font files and licenses checked into `src/fonts/`.
- **Photo Cutout Pipeline (`src/image-optimizer.mjs`)**: Optimized source photo to WebP data URI (23 KB, well below the 120 KB ceiling). Applied duotone remapping matrix and accent rim lighting in SVG.
- **Waveform Morphing Engine (`src/waveform-generator.mjs`)**: Built mathematical generator creating 40 cubic Bézier segments with identical coordinate count for all 5 stages (Sine, Distorted, Clipped, Square, Bits).
- **Master Clock Synchronization**: Synced the 12-second master clock across the 3 role titles (4s each) and the 4 oscilloscope stages (ANALOG, COMPARATOR, DIGITAL, CODE).
- **Dual Variant Support**: Default photo variant and etched monogram (`NK`) chip variant both generated deterministically via `photo: true|false`.
- **Payload Verification**: All Hero assets measure ~161 KB (Photo) and ~130 KB (Monogram), comfortably below the 400 KB per-asset budget.


## Phase 4: Live Activity Trace & GitHub Actions Setup

### Overview
Component E renders the user's GitHub contribution calendar as a precision oscilloscope trace. The weekly totals become waveform amplitudes along a baseline, the peak week is automatically highlighted, and an API-derived telemetry row reports total contributions, active days, and longest streak with a visible UTC date stamp.

### One-Time Repository Setup Guide
1. **Enable GitHub Actions Permissions**:
   - Go to your repository on GitHub: `https://github.com/Naveenkumar2313/Naveenkumar2313/settings/actions`
   - Under **Workflow permissions**, select **Read and write permissions**.
   - Check the box **Allow GitHub Actions to create and approve pull requests** (if present).
   - Click **Save**.

2. **(Optional) Configure Private Contribution Counts via Personal Access Token (PAT)**:
   - By default, GitHub's built-in `GITHUB_TOKEN` only provides access to *public* contribution counts.
   - If you want the activity trace to include commits to private repositories:
     1. Go to `https://github.com/settings/tokens?type=beta` (or classic tokens).
     2. Create a token with `read:user` and `user:email` scopes (or account activity permissions).
     3. In your profile repository, navigate to **Settings > Secrets and variables > Actions**.
     4. Click **New repository secret**.
     5. Name: `GH_PAT`.
     6. Secret: Paste your generated personal access token.
     7. Click **Add secret**.
   - The workflow `.github/workflows/activity.yml` automatically checks for `GH_PAT` first and falls back to `GITHUB_TOKEN`.

3. **Daily Automation Schedule**:
   - The cron job is configured to run at `00:00 UTC` every night.
   - It only commits and pushes if the generated SVG has changed, keeping your git history clean.
   - You can also manually trigger an instant update at any time from the **Actions** tab by selecting **Update Live Activity Trace** and clicking **Run workflow**.

4. **Failure Resiliency & Offline Fallback**:
   - If the GitHub GraphQL API encounters a rate limit or network error, `src/fetch-activity.mjs` preserves the existing `assets/activity-*.svg` files and exits with code 0.
   - Under no circumstances will an API hiccup break a build or commit corrupted files.


## Production Hotfix: XML Entity Escaping & Camo Cache Invalidation
- **Root Cause Analysis**: The live GitHub render of `path` and `work` failed with broken image placeholders because unescaped ampersands (`&`) in description copy (`"Hardware foundations & circuit theory"`, `"Interactive electronics lab with MNA engine & real-time collaboration."`) caused strict XML parsing failures when GitHub's Camo proxy validated the SVGs.
- **Resolution**:
  1. Implemented `src/utils.mjs` (`escapeXml`) to ensure all interpolated copy is sanitized before entering SVG text elements.
  2. Verified 100% of generated SVGs against Python's strict `xml.etree.ElementTree` parser.
  3. Corrected status chip padding in the Hero panel.
  4. Bumped all asset query versions to `?v=2` in `README.md` to force GitHub Camo to flush cached 500 error responses and re-proxy the validated XML.
  5. Pushed fix directly to `origin/main`.
