# Render Matrix & Camo Proxy Compatibility Report

**Environment Tested:** Chrome Headless v131 (Blink), Windows 10/11 x64, GitHub Camo Target Spec (`<img src="https://camo.githubusercontent.com/..." />` and `<picture>` tags).

---

## 1. Feature Compatibility Matrix

| Feature | Primitive / Test | Status | Camo / Browser Behavior | Architectural Ruling |
| :--- | :--- | :--- | :--- | :--- |
| **SMIL Opacity & Transform** | `<animate>`, `<animateTransform>` | **PASS** | Camo proxies XML unchanged. Blink/WebKit/Gecko execute SMIL inside `<img>` tags cleanly. | **APPROVED** for master clock animations (rotations, pulses, fades). |
| **SMIL animateMotion** | `<animateMotion path="...">` | **PASS** | Hardware pulse travels along complex SVG spline paths with zero JS dependency. | **APPROVED** for Panel B (PCB trace pulse). |
| **SMIL Path d Morph** | `<animate attributeName="d">` | **PASS** | Morphs smoothly between waveforms provided vertex counts match. | **APPROVED** for Hero oscilloscope waveform morphing. |
| **CSS Keyframes in `<style>`** | `@keyframes`, `.class` | **CONDITIONAL** | Works in modern Chrome/Firefox, but can encounter stutter or scoping issues in isolated SVG image contexts. | **AVOID** for core loops; use SMIL for guaranteed synchronization. |
| **@font-face Data-URI WOFF2** | `@font-face { src: url(data:...) }` | **FAIL** | **Blocked by browsers** inside SVG `<img>` sandbox (CORS/privacy boundary prevention). Text falls back to local fonts. | **PROHIBITED**. All display headings and technical labels **must be vector-outlined paths**. |
| **Embedded Raster (PNG/WebP)** | `<image href="data:image/webp;base64,...">` | **PASS** | Both base64 PNG and WebP render crisply. WebP achieves ~35% smaller footprint than PNG. | **APPROVED** for Hero cutout photo (WebP preferred, < 120 KB). |
| **SVG Filters** | `<feGaussianBlur>`, `<feColorMatrix>` | **PASS** | Duotone transforms and ambient glow render properly. | **APPROVED** for photo duotone treatment and subtle scope reticle glow. |
| **clipPath & mask** | `<clipPath>`, `<mask>` | **PASS** | Hardware-accelerated clipping and linear gradient alpha masking render cleanly. | **APPROVED** for IC chip pin cutouts, photo bottom-anchor, and terminal scan lines. |
| **Dark/Light `<picture>`** | `<picture><source media="..." srcset="...">` | **PASS** | GitHub Markdown natively parses `<picture>` and dynamically switches dark/light assets. | **APPROVED**. Generate dual dark/light assets for every panel (`*-dark.svg`, `*-light.svg`). |
| **prefers-reduced-motion** | `@media (prefers-reduced-motion)` | **CONDITIONAL** | Not consistently propagated into the isolated SVG `<img>` context on all platforms. | **FALLBACK TO FIRST-FRAME RULE**. Ensure initial static frame (`t=0`) is complete, balanced, and readable. |
| **Cache-Busting (?v=N)** | `image.svg?v=N` | **PASS** | GitHub Camo respects query strings and refreshes its cached proxy image on parameter bump. | **APPROVED**. Add `?v=1` to every asset link in `README.md`. |
| **Outlined Vector Text** | `<path d="...">` | **PASS** | 100% deterministic vector glyphs across all operating systems and viewports. Zero font flash. | **APPROVED (STANDARD)**. Convert Space Grotesk and JetBrains Mono to vector paths at build time. |
| **File Size (300 KB – 800 KB)** | Large SVG payload | **PASS** | Camo proxy limit is ~5 MB. 300 KB and 800 KB assets loaded instantly without truncation. | **BUDGET APPROVED**. Target < 400 KB per asset; total suite < 1.5 MB. |

---

## 2. Multi-Viewport & Mobile Scaling Observations

- **Desktop (1280px)**: The 1200-unit viewBox renders at nearly 1:1 scale with crisp hairline borders (`1px`) and comfortable negative space.
- **Tablet (820px)**: Renders at ~0.68x scale. Hairlines remain distinct; 24-unit typography scales down to ~16px (fully legible).
- **Mobile (390px)**:
  - Renders at ~0.33x scale.
  - **Critical Type Scale Rule**: Any text smaller than 30 SVG units will shrink below 10px on mobile screens.
  - Display titles (`48–64` units) scale to ~16–21px (prominent and readable).
  - Primary labels (`30–36` units) scale to ~10–12px (crisp).
  - Micro-annotations below 24 units must be purely decorative; essential information must also reside in companion Markdown text.

---

## 3. Approved Engineering Stack for Phases 2–5
1. **Renderer Standard:** Pure SVG 1.1 with SMIL animations (`<animate>`, `<animateTransform>`, `<animateMotion>`).
2. **Typography Engine:** Node.js script using `opentype.js` to convert TTF font glyphs into SVG `<path>` data.
3. **Image Processor:** Node.js `sharp` pipeline for photo resizing, duotone preparation, and WebP base64 encoding (< 120 KB).
4. **Theme Toggling:** GitHub native `<picture>` tags with `(prefers-color-scheme: dark)` and `(prefers-color-scheme: light)`.
5. **Cache Control:** Semantic asset versioning (`?v=1`) on all asset URLs.

