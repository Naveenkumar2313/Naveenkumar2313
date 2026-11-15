import { renderTextPath } from '../font-outliner.mjs';

/**
 * Builds the Bill of Materials (BOM) SVG panel (1200 x 520).
 * @param {'dark'|'light'} mode 
 * @param {object} config 
 * @param {object} t Design token theme
 */
export async function buildBomSvg(mode, config, t) {
  // Header
  const headerPath = renderTextPath('03 // BILL OF MATERIALS // ACTIVE SYSTEM STACK', 'mono', 12, 72, 54, { fill: t.muted, tracking: 0.1 });
  const subPath = renderTextPath('SILKSCREEN BOM TABLE · TRACE-ROUTED CAPABILITIES', 'mono', 10, 1128, 54, { fill: t.muted, tracking: 0.08, anchor: 'end' });

  const bomData = config.bom || {
    "LANGUAGES": [
      { ref: "U1", name: "Python" },
      { ref: "U2", name: "JavaScript" },
      { ref: "U3", name: "TypeScript" },
      { ref: "U4", name: "C/C++" }
    ],
    "WEB & INTERACTIVE": [
      { ref: "U5", name: "React" },
      { ref: "U6", name: "Django" },
      { ref: "U7", name: "WebSockets" },
      { ref: "U8", name: "Konva" },
      { ref: "U9", name: "Zustand" }
    ],
    "HARDWARE & SYSTEMS": [
      { ref: "U10", name: "ESP32" },
      { ref: "U11", name: "Arduino" },
      { ref: "U12", name: "Raspberry Pi" },
      { ref: "U13", name: "AVR8js emulation" },
      { ref: "U14", name: "Circuit simulation (MNA)" }
    ]
  };

  const groupKeys = Object.keys(bomData);
  const colX = [72, 436, 800];
  const colWidth = 328;
  const startY = 90;
  const rowHeight = 52;
  const rowGap = 10;

  const groupElements = [];
  let globalLedIdx = 0;
  const totalLeds = 14;
  const loopDur = 6; // 6s scan loop

  for (let gIdx = 0; gIdx < groupKeys.length; gIdx++) {
    const groupName = groupKeys[gIdx];
    const items = bomData[groupName];
    const gx = colX[gIdx];

    // Group Header
    const gHeaderPath = renderTextPath(groupName, 'mono', 11, gx + 16, startY + 22, { fill: t.accent, tracking: 0.1 });
    const gCountPath = renderTextPath(`[${items.length} ITEMS]`, 'mono', 10, gx + colWidth - 16, startY + 22, { fill: t.muted, tracking: 0.06, anchor: 'end' });

    const rows = [];
    for (let rIdx = 0; rIdx < items.length; rIdx++) {
      const item = items[rIdx];
      const ry = startY + 44 + rIdx * (rowHeight + rowGap);
      const ledIdx = globalLedIdx++;

      // Timing for sequential LED scanning
      const tNorm = ledIdx / totalLeds;
      const tStart = Math.max(0, tNorm - 0.03).toFixed(3);
      const tPeak = tNorm.toFixed(3);
      const tEnd = Math.min(1, tNorm + 0.06).toFixed(3);

      const refPath = renderTextPath(item.ref, 'mono', 11, gx + 20, ry + 32, { fill: t.muted, tracking: 0.08 });
      const namePath = renderTextPath(item.name, 'display', 15, gx + 64, ry + 32, { fill: t.text, tracking: -0.01 });

      rows.push(`
      <!-- Row: ${item.ref} - ${item.name} -->
      <g id="bom-row-${item.ref}">
        <!-- Row boundary -->
        <rect x="${gx}" y="${ry}" width="${colWidth}" height="${rowHeight}" rx="8" fill="${t.surface}" stroke="${t.hairline}" stroke-width="1" />
        
        <!-- Designator tag container -->
        <rect x="${gx + 12}" y="${ry + 15}" width="${refPath.width + 16}" height="22" rx="4" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="0.8" />
        ${refPath.toSvg()}

        <!-- Skill name -->
        ${namePath.toSvg()}

        <!-- SMD Indicator LED Pad -->
        <g transform="translate(${gx + colWidth - 28}, ${ry + 26})">
          <rect x="-6" y="-6" width="12" height="12" rx="2" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="0.8" />
          <circle cx="0" cy="0" r="3" fill="${t.accent}" opacity="0.25">
            <animate attributeName="opacity" dur="${loopDur}s" repeatCount="indefinite"
              values="0.25; 0.25; 1; 0.25; 0.25"
              keyTimes="0; ${tStart}; ${tPeak}; ${tEnd}; 1" />
          </circle>
        </g>
      </g>`);
    }

    groupElements.push(`
    <!-- Column: ${groupName} -->
    <g id="bom-col-${gIdx}">
      <!-- Group Header Bar -->
      <rect x="${gx}" y="${startY}" width="${colWidth}" height="34" rx="6" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
      ${gHeaderPath.toSvg()}
      ${gCountPath.toSvg()}

      <!-- Item Rows -->
      ${rows.join('\n      ')}
    </g>`);
  }

  // Bottom silkscreen info
  const footerPath = renderTextPath('REV 2025.1 · ALL COMPONENTS TESTED & DEPLOYED IN PRODUCTION', 'mono', 10, 600, 480, { fill: t.muted, tracking: 0.06, anchor: 'middle' });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 520" width="1200" height="520">
  <!-- Base Canvas -->
  <rect width="100%" height="100%" fill="${t.bg}" />
  <rect x="16" y="16" width="1168" height="488" rx="20" fill="none" stroke="${t.hairline}" stroke-width="1" />

  <!-- Section Header -->
  ${headerPath.toSvg()}
  ${subPath.toSvg()}

  <!-- 3 BOM Columns -->
  ${groupElements.join('\n\n')}

  <!-- Footer Silkscreen Notice -->
  <line x1="72" y1="456" x2="1128" y2="456" stroke="${t.hairline}" stroke-width="1" stroke-dasharray="3 4" />
  ${footerPath.toSvg()}
</svg>`;
}

