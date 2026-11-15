import { renderTextPath } from '../font-outliner.mjs';
import { escapeXml } from '../utils.mjs';

/**
 * Builds the Selected Work SVG panel (1200 x 870).
 * @param {'dark'|'light'} mode 
 * @param {object} config 
 * @param {object} t Design token theme
 */
export async function buildSelectedWorkSvg(mode, config, t) {
  // Header
  const headerPath = renderTextPath('02 // SELECTED WORK // IC ARCHITECTURE & SYSTEMS', 'mono', 12, 72, 54, { fill: t.muted, tracking: 0.1 });

  const projects = config.selectedWork || [];
  const cardWidth = 512;
  const cardHeight = 224;
  const colX = [72, 616];
  const rowY = [86, 326, 566];

  const cardElements = [];

  for (let i = 0; i < Math.min(6, projects.length); i++) {
    const p = projects[i];
    const cCol = i % 2;
    const cRow = Math.floor(i / 2);
    const cx = colX[cCol];
    const cy = rowY[cRow];

    // Outlined texts: Designator & Category
    const desPath = renderTextPath(p.id, 'mono', 11, cx + 32, cy + 32, { fill: t.accent, tracking: 0.1 });
    const catPath = renderTextPath(p.category, 'mono', 10, cx + 64, cy + 32, { fill: t.muted, tracking: 0.08 });

    // Title: >= 28 units (Space Grotesk outlined)
    const titlePath = renderTextPath(p.title, 'display', 28, cx + 32, cy + 78, { fill: t.text, tracking: -0.02 });

    // One-line description: >= 28 units (clean system font stack)
    const safeDesc = escapeXml(p.description);
    const descText = `<text x="${cx + 32}" y="${cy + 124}" fill="${t.muted}" font-family="-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="28" font-weight="400" letter-spacing="-0.3">${safeDesc}</text>`;

    // Decorative tags / tech chips (small, decorative only)
    const tagElements = [];
    let tagOffsetX = cx + 32;
    for (const tag of p.tags) {
      const tagText = renderTextPath(tag, 'mono', 10, tagOffsetX + 8, cy + 188, { fill: t.text, tracking: 0.04 });
      const chipW = tagText.width + 16;
      tagElements.push(`
        <rect x="${tagOffsetX}" y="${cy + 174}" width="${chipW}" height="20" rx="4" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
        ${tagText.toSvg()}
      `);
      tagOffsetX += chipW + 8;
    }

    // Micro-animation for this IC card (max 6 elements)
    let microAnim = '';
    const animX = cx + 412;
    const animY = cy + 24;

    switch (p.animation) {
      case 'rc-curve':
        microAnim = `
        <g id="anim-rc-${i}" transform="translate(${animX}, ${animY})">
          <rect x="0" y="0" width="68" height="44" rx="6" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
          <line x1="10" y1="10" x2="10" y2="36" stroke="${t.grid}" stroke-width="1" />
          <line x1="10" y1="36" x2="60" y2="36" stroke="${t.grid}" stroke-width="1" />
          <path d="M 10 36 C 18 36, 26 14, 60 13" fill="none" stroke="${t.accent}" stroke-width="1.8" stroke-dasharray="70" stroke-dashoffset="0">
            <animate attributeName="stroke-dashoffset" values="70;0;0;70" dur="4s" repeatCount="indefinite"
              calcMode="spline" keyTimes="0; 0.5; 0.85; 1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
          </path>
        </g>`;
        break;

      case 'led-blink':
        microAnim = `
        <g id="anim-leds-${i}" transform="translate(${animX + 6}, ${animY + 8})">
          <rect x="-4" y="-4" width="64" height="30" rx="4" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
          <circle cx="6" cy="11" r="3" fill="${t.accent}" opacity="0.3">
            <animate attributeName="opacity" values="0.2; 1; 0.2; 0.2; 0.2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="20" cy="11" r="3" fill="${t.accent}" opacity="0.3">
            <animate attributeName="opacity" values="0.2; 0.2; 1; 0.2; 0.2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="34" cy="11" r="3" fill="${t.accent}" opacity="0.3">
            <animate attributeName="opacity" values="0.2; 0.2; 0.2; 1; 0.2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="48" cy="11" r="3" fill="${t.accent}" opacity="0.3">
            <animate attributeName="opacity" values="0.2; 0.2; 0.2; 0.2; 1" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>`;
        break;

      case 'radio-arcs':
        microAnim = `
        <g id="anim-radio-${i}" transform="translate(${animX + 34}, ${animY + 22})">
          <circle cx="0" cy="0" r="3" fill="${t.accent}" />
          <circle cx="0" cy="0" r="8" fill="none" stroke="${t.accent}" stroke-width="1.2" opacity="0">
            <animate attributeName="r" values="4; 14; 22" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8; 0.4; 0" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="14" fill="none" stroke="${t.accent}" stroke-width="1.2" opacity="0">
            <animate attributeName="r" values="4; 14; 22" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8; 0.4; 0" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
          </circle>
        </g>`;
        break;

      case 'servo-sweep':
        microAnim = `
        <g id="anim-robot-${i}" transform="translate(${animX + 34}, ${animY + 22})">
          <rect x="-16" y="-12" width="32" height="24" rx="5" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
          <circle cx="-6" cy="-2" r="2.5" fill="${t.accent}">
            <animate attributeName="opacity" values="1; 1; 0.1; 1; 1" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="6" cy="-2" r="2.5" fill="${t.accent}">
            <animate attributeName="opacity" values="1; 1; 0.1; 1; 1" dur="4s" repeatCount="indefinite" />
          </circle>
          <line x1="0" y1="-12" x2="0" y2="-18" stroke="${t.muted}" stroke-width="1.5" />
          <circle cx="0" cy="-18" r="2" fill="${t.accent}" />
        </g>`;
        break;

      case 'sorting-bars':
        microAnim = `
        <g id="anim-bars-${i}" transform="translate(${animX + 6}, ${animY + 8})">
          <rect x="-4" y="-4" width="60" height="30" rx="4" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
          <rect x="4" y="12" width="5" height="12" fill="${t.muted}" rx="1">
            <animate attributeName="height" values="12; 20; 16; 8; 12" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y" values="12; 4; 8; 16; 12" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="14" y="8" width="5" height="16" fill="${t.muted}" rx="1">
            <animate attributeName="height" values="16; 8; 20; 12; 16" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y" values="8; 16; 4; 12; 8" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="24" y="4" width="5" height="20" fill="${t.accent}" rx="1">
            <animate attributeName="height" values="20; 12; 8; 18; 20" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y" values="4; 12; 16; 6; 4" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="34" y="14" width="5" height="10" fill="${t.muted}" rx="1">
            <animate attributeName="height" values="10; 20; 16; 10; 10" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y" values="14; 4; 8; 14; 14" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="44" y="10" width="5" height="14" fill="${t.muted}" rx="1">
            <animate attributeName="height" values="14; 8; 12; 20; 14" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y" values="10; 16; 12; 4; 10" dur="3s" repeatCount="indefinite" />
          </rect>
        </g>`;
        break;

      case 'oscillating-trace':
      default:
        microAnim = `
        <g id="anim-trace-${i}" transform="translate(${animX}, ${animY})">
          <rect x="0" y="0" width="68" height="44" rx="6" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
          <line x1="8" y1="22" x2="60" y2="22" stroke="${t.grid}" stroke-width="1" stroke-dasharray="2 3" />
          <path d="M 10 22 Q 22 10 35 22 T 58 22" fill="none" stroke="${t.accent}" stroke-width="1.8">
            <animate attributeName="d" dur="3s" repeatCount="indefinite"
              values="M 10 22 Q 22 10 35 22 T 58 22;
                      M 10 22 Q 22 34 35 22 T 58 22;
                      M 10 22 Q 22 10 35 22 T 58 22" />
          </path>
        </g>`;
        break;
    }

    // Metal pins on left and right edges
    const pins = [];
    const pinSpacing = 40;
    for (let pIdx = 0; pIdx < 4; pIdx++) {
      const pinY = cy + 48 + pIdx * pinSpacing;
      pins.push(`<rect x="${cx}" y="${pinY}" width="16" height="10" rx="1.5" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />`);
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

      <!-- Designator chip & Category -->
      <rect x="${cx + 28}" y="${cy + 20}" width="28" height="18" rx="3" fill="${t.surface2}" stroke="${t.accentBorder}" stroke-width="1" />
      ${desPath.toSvg()}
      ${catPath.toSvg()}

      <!-- Micro-animation signature -->
      ${microAnim}

      <!-- Title (>= 28 units) & Description (>= 28 units) -->
      ${titlePath.toSvg()}
      ${descText}

      <!-- Tags / Tech Stack -->
      ${tagElements.join('\n      ')}
    </g>`);
  }

  // Quiet line below grid
  const quietText = '<text x="600" y="826" fill="' + t.muted + '" font-family="-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="12" font-weight="400" text-anchor="middle" letter-spacing="0.3">Also shipped at PyGenicArc: Administration Portal · Automated Marks Attainment System · Exhibition Robot</text>';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 860" width="1200" height="860">
  <!-- Base Canvas -->
  <rect width="100%" height="100%" fill="${t.bg}" />
  <rect x="16" y="16" width="1168" height="828" rx="20" fill="none" stroke="${t.hairline}" stroke-width="1" />

  <!-- Section Header -->
  ${headerPath.toSvg()}

  <!-- 6 IC Package Cards (2x3 Grid) -->
  ${cardElements.join('\n\n')}

  <!-- Quiet line under the grid -->
  <line x1="72" y1="806" x2="1128" y2="806" stroke="${t.hairline}" stroke-width="1" stroke-dasharray="4 6" />
  ${quietText}
</svg>`;
}
