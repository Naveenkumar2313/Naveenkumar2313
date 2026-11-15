import { renderTextPath } from '../font-outliner.mjs';

/**
 * Builds the Activity Trace SVG panel (1200 x 420).
 * @param {'dark'|'light'} mode 
 * @param {object} calendarData 
 * @param {object} t Design token theme
 */
export async function buildActivitySvg(mode, calendarData, t) {
  const {
    weeks = [],
    totalContributions = 0,
    activeDays = 0,
    longestStreak = 0,
    timestamp = new Date().toISOString().slice(0, 10)
  } = calendarData;

  // Header Title & Timestamp
  const headerPath = renderTextPath('04 // LIVE SIGNAL // CONTRIBUTIONS TELEMETRY TRACE', 'mono', 12, 72, 52, { fill: t.muted, tracking: 0.1 });
  const timeStampPath = renderTextPath(`as of ${timestamp} UTC`, 'mono', 11, 1128, 52, { fill: t.accent, tracking: 0.08, anchor: 'end' });

  // Oscilloscope scope window: x=72, y=70, w=1056, h=220
  const scopeX = 72;
  const scopeY = 70;
  const scopeW = 1056;
  const scopeH = 220;
  const baseY = 255; // Zero-activity baseline

  // Calculate weekly amplitudes
  // Ensure we have ~52 data points
  const pointsCount = Math.max(1, weeks.length);
  const stepX = (scopeW - 40) / (pointsCount - 1 || 1);

  let maxWeekCount = 0;
  let peakIdx = 0;
  const points = [];

  for (let i = 0; i < pointsCount; i++) {
    const wk = weeks[i] || { total: 0 };
    const count = typeof wk.total === 'number' ? wk.total : (wk.contributionDays || []).reduce((sum, d) => sum + d.contributionCount, 0);
    if (count > maxWeekCount) {
      maxWeekCount = count;
      peakIdx = i;
    }
    const px = scopeX + 20 + i * stepX;
    // Scale amplitude: max count maps to ~140px height above baseline
    const ampScale = maxWeekCount > 0 ? Math.min(140, (count / (maxWeekCount || 1)) * 130) : 0;
    const py = baseY - ampScale;
    points.push({ x: Number(px.toFixed(1)), y: Number(py.toFixed(1)), count });
  }

  // Smooth cubic spline across points
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const cx1 = Number((p0.x + stepX * 0.45).toFixed(1));
    const cy1 = p0.y;
    const cx2 = Number((p1.x - stepX * 0.45).toFixed(1));
    const cy2 = p1.y;
    pathD += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`;
  }

  // Baseline path
  const baselineD = `M ${scopeX + 16} ${baseY} L ${scopeX + scopeW - 16} ${baseY}`;

  // Peak annotation marker
  const peakPoint = points[peakIdx] || { x: scopeX + 20, y: baseY, count: 0 };
  const peakTagText = `PEAK: ${peakPoint.count} COMMITS / WK ${peakIdx + 1}`;
  const peakTagPath = renderTextPath(peakTagText, 'mono', 10, peakPoint.x, peakPoint.y - 18, { fill: t.accent, tracking: 0.06, anchor: 'middle' });

  // Grid background inside scope
  const gridLines = [];
  for (let gy = 100; gy < baseY; gy += 38) {
    gridLines.push(`<line x1="${scopeX + 10}" y1="${gy}" x2="${scopeX + scopeW - 10}" y2="${gy}" stroke="${t.grid}" stroke-width="1" stroke-dasharray="2 4" />`);
  }
  for (let gx = scopeX + 60; gx < scopeX + scopeW; gx += 88) {
    gridLines.push(`<line x1="${gx}" y1="${scopeY + 10}" x2="${gx}" y2="${baseY + 15}" stroke="${t.grid}" stroke-width="1" stroke-dasharray="2 4" />`);
  }

  // Stats row pods at bottom (y = 312, h = 76)
  const statsY = 312;
  const statW = 336;
  const statGap = 24;

  const stats = [
    { label: 'TOTAL CONTRIBUTIONS', value: totalContributions.toLocaleString(), unit: 'EVENTS' },
    { label: 'ACTIVE DAYS', value: activeDays.toLocaleString(), unit: 'DAYS' },
    { label: 'LONGEST STREAK', value: longestStreak.toLocaleString(), unit: 'DAYS' }
  ];

  const statPods = [];
  for (let sIdx = 0; sIdx < stats.length; sIdx++) {
    const s = stats[sIdx];
    const sx = scopeX + sIdx * (statW + statGap);

    const sLabelPath = renderTextPath(s.label, 'mono', 10.5, sx + 16, statsY + 26, { fill: t.muted, tracking: 0.08 });
    const sValPath = renderTextPath(s.value, 'display', 24, sx + 16, statsY + 58, { fill: t.text, tracking: -0.02 });
    const sUnitPath = renderTextPath(s.unit, 'mono', 10, sx + 24 + sValPath.width, statsY + 56, { fill: t.accent, tracking: 0.08 });

    statPods.push(`
    <!-- Stat Pod ${sIdx + 1}: ${s.label} -->
    <g id="stat-pod-${sIdx + 1}">
      <rect x="${sx}" y="${statsY}" width="${statW}" height="76" rx="10" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
      ${sLabelPath.toSvg()}
      ${sValPath.toSvg()}
      ${sUnitPath.toSvg()}
    </g>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420" width="1200" height="420">
  <defs>
    <filter id="actGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Base Canvas -->
  <rect width="100%" height="100%" fill="${t.bg}" />
  <rect x="16" y="16" width="1168" height="388" rx="20" fill="${t.surface}" stroke="${t.hairline}" stroke-width="1.5" />

  <!-- Section Header -->
  ${headerPath.toSvg()}
  ${timeStampPath.toSvg()}

  <!-- Oscilloscope Display Window -->
  <rect x="${scopeX}" y="${scopeY}" width="${scopeW}" height="${scopeH}" rx="12" fill="${t.bg}" stroke="${t.hairline}" stroke-width="1" />

  <!-- Scope Reticle Grid -->
  <g id="act-grid">
    ${gridLines.join('\n    ')}
  </g>

  <!-- Baseline -->
  <path d="${baselineD}" fill="none" stroke="${t.hairline}" stroke-width="1.5" />

  <!-- Activity Amplitude Waveform -->
  <g filter="url(#actGlow)">
    <path d="${pathD}" fill="none" stroke="${t.accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
      stroke-dasharray="1600" stroke-dashoffset="1600">
      <animate attributeName="stroke-dashoffset" from="1600" to="0" dur="3.5s" fill="freeze"
        calcMode="spline" keyTimes="0; 1" keySplines="0.4 0 0.2 1" />
    </path>
  </g>

  <!-- Peak Annotation Marker -->
  <g id="peak-marker">
    <line x1="${peakPoint.x}" y1="${peakPoint.y}" x2="${peakPoint.x}" y2="${peakPoint.y - 12}" stroke="${t.accent}" stroke-width="1.2" stroke-dasharray="2 2" />
    <circle cx="${peakPoint.x}" cy="${peakPoint.y}" r="4" fill="${t.accent}" />
    <!-- Callout background chip -->
    <rect x="${peakPoint.x - peakTagPath.width / 2 - 8}" y="${peakPoint.y - 30}" width="${peakTagPath.width + 16}" height="18" rx="4" fill="${t.surface2}" stroke="${t.accentBorder}" stroke-width="0.8" />
    ${peakTagPath.toSvg()}
  </g>

  <!-- Telemetry Stats Pods -->
  ${statPods.join('\n\n')}
</svg>`;
}

