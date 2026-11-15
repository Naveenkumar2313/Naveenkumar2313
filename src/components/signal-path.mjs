import { renderTextPath } from '../font-outliner.mjs';
import { escapeXml } from '../utils.mjs';

/**
 * Builds the Signal Path SVG panel (1200 x 300).
 * @param {'dark'|'light'} mode 
 * @param {object} config 
 * @param {object} t Design token theme
 */
export async function buildSignalPathSvg(mode, config, t) {
  // Header title
  const headerPath = renderTextPath('01 // SIGNAL PATH // HARDWARE TO SOFTWARE', 'mono', 12, 72, 54, { fill: t.muted, tracking: 0.1 });

  // 4 Nodes
  const nodes = config.signalPath || [
    { stage: "STAGE 01", label: "B.E. Electronics & Comm", detail: "Hardware & circuit theory" },
    { stage: "STAGE 02", label: "Embedded & Simulators", detail: "Arduino, ESP32, AVR8js, MNA" },
    { stage: "STAGE 03", label: "Full-Stack Development", detail: "React, Django, WebSockets" },
    { stage: "STAGE 04", label: "PyGenicArc (Mar 2025–)", detail: "EdTech & exhibition systems" }
  ];

  const nodePositions = [160, 440, 720, 1000];
  const traceY = 135;

  // PCB trace path
  const traceD = `M 72 ${traceY} L 150 ${traceY} L 160 ${traceY} L 430 ${traceY} L 440 ${traceY} L 710 ${traceY} L 720 ${traceY} L 990 ${traceY} L 1000 ${traceY} L 1128 ${traceY}`;

  // Build node elements
  const nodeElements = [];
  const lightDur = 10; // 10s master trace travel

  for (let i = 0; i < nodes.length; i++) {
    const nx = nodePositions[i];
    const n = nodes[i];
    const tpName = `TP${i + 1}`;

    const tpPath = renderTextPath(tpName, 'mono', 10, nx, traceY - 24, { fill: t.muted, tracking: 0.08, anchor: 'middle' });
    const stagePath = renderTextPath(n.stage, 'mono', 11, nx, traceY + 44, { fill: t.accent, tracking: 0.08, anchor: 'middle' });
    const titlePath = renderTextPath(n.label, 'display', 17, nx, traceY + 70, { fill: t.text, tracking: -0.01, anchor: 'middle' });
    const safeDetail = escapeXml(n.detail);
    const detailText = `<text x="${nx}" y="${traceY + 92}" fill="${t.muted}" font-family="-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="12" font-weight="400" text-anchor="middle">${safeDetail}</text>`;

    // Keyframes for node light-up when pulse arrives
    // Node 0: t ~ 0.8s (8%)
    // Node 1: t ~ 3.5s (35%)
    // Node 2: t ~ 6.3s (63%)
    // Node 3: t ~ 9.0s (90%)
    const triggerTimes = [0.08, 0.35, 0.63, 0.90];
    const trig = triggerTimes[i];
    const t0 = Math.max(0, trig - 0.04).toFixed(3);
    const t1 = trig.toFixed(3);
    const t2 = Math.min(1, trig + 0.06).toFixed(3);

    const values = `0.2; 0.2; 1; 0.2; 0.2`;
    const keyTimes = `0; ${t0}; ${t1}; ${t2}; 1`;

    nodeElements.push(`
    <!-- Node ${i + 1}: ${n.stage} -->
    <g id="node-${i + 1}">
      <!-- Silk TP Label -->
      ${tpPath.toSvg()}

      <!-- Via outer pad -->
      <circle cx="${nx}" cy="${traceY}" r="15" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1.5" />
      
      <!-- Copper contact ring -->
      <circle cx="${nx}" cy="${traceY}" r="9" fill="none" stroke="${t.muted}" stroke-width="2" />
      
      <!-- Via center hole -->
      <circle cx="${nx}" cy="${traceY}" r="4" fill="${t.bg}" />

      <!-- Active glow ring on signal arrival -->
      <circle cx="${nx}" cy="${traceY}" r="12" fill="none" stroke="${t.accent}" stroke-width="2.5" opacity="0.2">
        <animate attributeName="opacity" dur="${lightDur}s" repeatCount="indefinite"
          values="${values}" keyTimes="${keyTimes}" />
      </circle>

      <!-- Stage label & Titles -->
      ${stagePath.toSvg()}
      ${titlePath.toSvg()}
      ${detailText}
    </g>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" width="1200" height="300">
  <defs>
    <filter id="traceGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Base Canvas -->
  <rect width="100%" height="100%" fill="${t.bg}" />
  <rect x="16" y="16" width="1168" height="268" rx="20" fill="none" stroke="${t.hairline}" stroke-width="1" />

  <!-- Section Header -->
  ${headerPath.toSvg()}

  <!-- PCB Copper Trace Lines -->
  <!-- Ground reference hairline -->
  <path d="${traceD}" fill="none" stroke="${t.surface2}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
  <path d="${traceD}" fill="none" stroke="${t.hairline}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Animated Traveling Signal Pulse -->
  <g filter="url(#traceGlow)">
    <circle r="4.5" fill="${t.accent}">
      <animateMotion dur="${lightDur}s" repeatCount="indefinite" path="${traceD}"
        calcMode="spline" keyTimes="0; 1" keySplines="0.4 0 0.2 1" />
    </circle>
    <!-- Traveling halo -->
    <circle r="8" fill="none" stroke="${t.accent}" stroke-width="1" opacity="0.5">
      <animateMotion dur="${lightDur}s" repeatCount="indefinite" path="${traceD}"
        calcMode="spline" keyTimes="0; 1" keySplines="0.4 0 0.2 1" />
      <animate attributeName="r" values="6; 11; 6" dur="2s" repeatCount="indefinite" />
    </circle>
  </g>

  <!-- Nodes -->
  ${nodeElements.join('\n')}
</svg>`;
}
