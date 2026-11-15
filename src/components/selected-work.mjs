import { renderTextPath } from '../font-outliner.mjs';
import { escapeXml } from '../utils.mjs';

/**
 * Builds the Selected Work SVG panel (1200 x 820).
 * @param {'dark'|'light'} mode 
 * @param {object} config 
 * @param {object} t Design token theme
 */
export async function buildSelectedWorkSvg(mode, config, t) {
  // Header
  const headerPath = renderTextPath('02 // SELECTED WORK // IC ARCHITECTURE & SYSTEMS', 'mono', 12, 72, 54, { fill: t.muted, tracking: 0.1 });

  const projects = config.selectedWork || [];
  const cardWidth = 512;
  const cardHeight = 204;
  const colX = [72, 616];
  const rowY = [86, 308, 530];

  const cardElements = [];

  for (let i = 0; i < Math.min(6, projects.length); i++) {
    const p = projects[i];
    const cCol = i % 2;
    const cRow = Math.floor(i / 2);
    const cx = colX[cCol];
    const cy = rowY[cRow];

    // Outlined texts for display titles, designators, and categories
    const desPath = renderTextPath(p.id, 'mono', 11, cx + 32, cy + 34, { fill: t.accent, tracking: 0.1 });
    const catPath = renderTextPath(p.category, 'mono', 10, cx + 64, cy + 34, { fill: t.muted, tracking: 0.08 });
    const titlePath = renderTextPath(p.title, 'display', 19, cx + 32, cy + 68, { fill: t.text, tracking: -0.01 });

    // Long body description uses system font stack per design specification
    const safeDesc = escapeXml(p.description);
    const descText = `<text x="${cx + 32}" y="${cy + 96}" fill="${t.muted}" font-family="-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="12" font-weight="400" letter-spacing="0.2">${safeDesc}</text>`;

    // Render tag chips
    const tagElements = [];
    let tagOffsetX = cx + 32;
    for (const tag of p.tags) {
      const tagText = renderTextPath(tag, 'mono', 10, tagOffsetX + 8, cy + 172, { fill: t.text, tracking: 0.04 });
      const chipW = tagText.width + 16;
      tagElements.push(`
        <rect x="${tagOffsetX}" y="${cy + 158}" width="${chipW}" height="20" rx="4" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
        ${tagText.toSvg()}
      `);
      tagOffsetX += chipW + 8;
    }

    // Micro-animation for this IC card (max 6 elements, restrained)
    let microAnim = '';
    const animX = cx + 400;
    const animY = cy + 32;

    switch (p.animation) {
      case 'rc-curve':
        // U1: Circuit simulator - RC charging curve
        microAnim = `
        <g id="anim-rc-${i}" transform="translate(${animX}, ${animY})">
          <rect x="0" y="0" width="76" height="50" rx="6" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
          <!-- Axes -->
          <line x1="10" y1="10" x2="10" y2="42" stroke="${t.grid}" stroke-width="1" />
          <line x1="10" y1="42" x2="68" y2="42" stroke="${t.grid}" stroke-width="1" />
          <!-- Exponential charging curve: V(1 - e^-t) -->
          <path d="M 10 42 C 20 42, 28 16, 68 15" fill="none" stroke="${t.accent}" stroke-width="1.8" stroke-dasharray="80" stroke-dashoffset="0">
            <animate attributeName="stroke-dashoffset" values="80;0;0;80" dur="4s" repeatCount="indefinite"
              calcMode="spline" keyTimes="0; 0.5; 0.85; 1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
          </path>
        </g>`;
        break;

      case 'led-blink':
        // U2: Arduino simulator - 4 SMD LEDs sequence
        microAnim = `
        <g id="anim-leds-${i}" transform="translate(${animX + 8}, ${animY + 12})">
          <rect x="-6" y="-6" width="68" height="34" rx="4" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
          <!-- 4 tiny LEDs -->
          <circle cx="6" cy="11" r="3.5" fill="${t.accent}" opacity="0.3">
            <animate attributeName="opacity" values="0.2; 1; 0.2; 0.2; 0.2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="20" cy="11" r="3.5" fill="${t.accent}" opacity="0.3">
            <animate attributeName="opacity" values="0.2; 0.2; 1; 0.2; 0.2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="34" cy="11" r="3.5" fill="${t.accent}" opacity="0.3">
            <animate attributeName="opacity" values="0.2; 0.2; 0.2; 1; 0.2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="48" cy="11" r="3.5" fill="${t.accent}" opacity="0.3">
            <animate attributeName="opacity" values="0.2; 0.2; 0.2; 0.2; 1" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>`;
        break;

      case 'radio-arcs':
        // U3: ESP32 RC Car - Radiating wireless arcs
        microAnim = `
        <g id="anim-radio-${i}" transform="translate(${animX + 36}, ${animY + 28})">
          <circle cx="0" cy="0" r="3" fill="${t.accent}" />
          <!-- 3 expanding radio rings -->
          <circle cx="0" cy="0" r="8" fill="none" stroke="${t.accent}" stroke-width="1.2" opacity="0">
            <animate attributeName="r" values="4; 14; 22" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8; 0.4; 0" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="14" fill="none" stroke="${t.accent}" stroke-width="1.2" opacity="0">
            <animate attributeName="r" values="4; 14; 22" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8; 0.4; 0" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="20" fill="none" stroke="${t.accent}" stroke-width="1.2" opacity="0">
            <animate attributeName="r" values="4; 14; 22" dur="2.4s" begin="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8; 0.4; 0" dur="2.4s" begin="1.6s" repeatCount="indefinite" />
          </circle>
        </g>`;
        break;

      case 'servo-sweep':
        // U4: Personal humanoid robot - Servo sweep arc & LED eyes
        microAnim = `
        <g id="anim-robot-${i}" transform="translate(${animX + 38}, ${animY + 24})">
          <!-- Robot head contour -->
          <rect x="-18" y="-14" width="36" height="28" rx="6" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
          <!-- Two LED eyes with blink -->
          <circle cx="-7" cy="-2" r="2.5" fill="${t.accent}">
            <animate attributeName="opacity" values="1; 1; 0.1; 1; 1" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="7" cy="-2" r="2.5" fill="${t.accent}">
            <animate attributeName="opacity" values="1; 1; 0.1; 1; 1" dur="4s" repeatCount="indefinite" />
          </circle>
          <!-- Antenna/Servo horn -->
          <line x1="0" y1="-14" x2="0" y2="-22" stroke="${t.muted}" stroke-width="1.5" />
          <circle cx="0" cy="-22" r="2" fill="${t.accent}" />
        </g>`;
        break;

      case 'sorting-bars':
        // U5: Codorythm - 5 sorting bars
        microAnim = `
        <g id="anim-bars-${i}" transform="translate(${animX + 10}, ${animY + 12})">
          <rect x="-6" y="-6" width="64" height="34" rx="4" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
          <!-- 5 bars -->
          <rect x="4" y="14" width="6" height="12" fill="${t.muted}" rx="1">
            <animate attributeName="height" values="12; 22; 16; 8; 12" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y" values="14; 4; 10; 18; 14" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="14" y="8" width="6" height="18" fill="${t.muted}" rx="1">
            <animate attributeName="height" values="18; 10; 24; 14; 18" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y" values="8; 16; 2; 12; 8" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="24" y="4" width="6" height="22" fill="${t.accent}" rx="1">
            <animate attributeName="height" values="22; 14; 8; 20; 22" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y" values="4; 12; 18; 6; 4" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="34" y="16" width="6" height="10" fill="${t.muted}" rx="1">
            <animate attributeName="height" values="10; 24; 18; 12; 10" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y" values="16; 2; 8; 14; 16" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="44" y="10" width="6" height="16" fill="${t.muted}" rx="1">
            <animate attributeName="height" values="16; 8; 14; 24; 16" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y" values="10; 18; 12; 2; 10" dur="3s" repeatCount="indefinite" />
          </rect>
        </g>`;
        break;

      case 'oscillating-trace':
      default:
        // U6: Virtual Labs - Oscillating trace
        microAnim = `
        <g id="anim-trace-${i}" transform="translate(${animX}, ${animY})">
          <rect x="0" y="0" width="76" height="50" rx="6" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
          <line x1="8" y1="25" x2="68" y2="25" stroke="${t.grid}" stroke-width="1" stroke-dasharray="2 3" />
          <!-- Animated trace -->
          <path d="M 10 25 Q 24 10 38 25 T 66 25" fill="none" stroke="${t.accent}" stroke-width="1.8">
            <animate attributeName="d" dur="3s" repeatCount="indefinite"
              values="M 10 25 Q 24 10 38 25 T 66 25;
                      M 10 25 Q 24 38 38 25 T 66 25;
                      M 10 25 Q 24 10 38 25 T 66 25" />
          </path>
        </g>`;
        break;
    }

    // Metal pins on left and right edges
    const pins = [];
    const pinSpacing = 36;
    for (let pIdx = 0; pIdx < 4; pIdx++) {
      const pinY = cy + 44 + pIdx * pinSpacing;
      // Left pin
      pins.push(`<rect x="${cx}" y="${pinY}" width="16" height="10" rx="1.5" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />`);
      // Right pin
      pins.push(`<rect x="${cx + cardWidth - 16}" y="${pinY}" width="16" height="10" rx="1.5" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />`);
    }

    cardElements.push(`
    <!-- IC Card ${p.id}: ${p.title} -->
    <g id="ic-card-${p.id}">
      <!-- Metal Pins -->
      ${pins.join('\n      ')}

      <!-- Ceramic IC Body -->
      <rect x="${cx + 16}" y="${cy}" width="${cardWidth - 32}" height="${cardHeight}" rx="12" fill="${t.surface}" stroke="${t.hairline}" stroke-width="1.5" />

      <!-- Pin 1 Top Notch -->
      <path d="M ${cx + cardWidth / 2 - 12} ${cy} A 12 12 0 0 0 ${cx + cardWidth / 2 + 12} ${cy} Z" fill="${t.bg}" />

      <!-- Corner Alignment Crosshairs -->
      <line x1="${cx + 28}" y1="${cy + 12}" x2="${cx + 36}" y2="${cy + 12}" stroke="${t.grid}" stroke-width="1" />
      <line x1="${cx + 32}" y1="${cy + 8}" x2="${cx + 32}" y2="${cy + 16}" stroke="${t.grid}" stroke-width="1" />

      <!-- Designator chip & Category -->
      <rect x="${cx + 28}" y="${cy + 22}" width="28" height="18" rx="3" fill="${t.surface2}" stroke="${t.accentBorder}" stroke-width="1" />
      ${desPath.toSvg()}
      ${catPath.toSvg()}

      <!-- Micro-animation signature -->
      ${microAnim}

      <!-- Title & Description -->
      ${titlePath.toSvg()}
      ${descText}

      <!-- Tags / Tech Stack -->
      ${tagElements.join('\n      ')}
    </g>`);
  }

  // Quiet line below grid (body copy uses system font stack)
  const quietText = '<text x="600" y="774" fill="' + t.muted + '" font-family="-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="12" font-weight="400" text-anchor="middle" letter-spacing="0.3">Also shipped at PyGenicArc: Administration Portal · Automated Marks Attainment System · Exhibition Robot</text>';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 820" width="1200" height="820">
  <!-- Base Canvas -->
  <rect width="100%" height="100%" fill="${t.bg}" />
  <rect x="16" y="16" width="1168" height="788" rx="20" fill="none" stroke="${t.hairline}" stroke-width="1" />

  <!-- Section Header -->
  ${headerPath.toSvg()}

  <!-- 6 IC Package Cards (2x3 Grid) -->
  ${cardElements.join('\n\n')}

  <!-- Quiet line under the grid -->
  <line x1="72" y1="750" x2="1128" y2="750" stroke="${t.hairline}" stroke-width="1" stroke-dasharray="4 6" />
  ${quietText}
</svg>`;
}
