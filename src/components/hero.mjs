import { renderTextPath } from '../font-outliner.mjs';
import { getOptimizedCutoutWebP } from '../image-optimizer.mjs';

/**
 * Builds the Hero SVG panel with Option 2 layout (Dedicated ID Window at far right).
 * @param {'dark'|'light'} mode 
 * @param {object} config 
 * @param {object} t Design token theme
 * @param {number|null} snapshotTime Optional timestamp in seconds (0, 3, 6, 9) for static frame rendering
 */
export async function buildHeroSvg(mode, config, t, snapshotTime = null) {
  const isDark = mode === 'dark';
  const showPhoto = config.photo !== false;

  // Left Column Display Texts
  const eyebrowPath = renderTextPath(config.eyebrow, 'mono', 14, 72, 86, { fill: t.muted, tracking: 0.1 });
  const name1Path = renderTextPath('NAVEEN', 'display', 72, 72, 166, { fill: t.text, tracking: -0.02 });
  const name2Path = renderTextPath('KUMAR K', 'display', 72, 72, 244, { fill: t.text, tracking: -0.02 });

  // 3 Roles
  const role1Path = renderTextPath(config.roles[0], 'display', 28, 72, 304, { fill: t.accent, tracking: -0.01 });
  const role2Path = renderTextPath(config.roles[1], 'display', 28, 72, 304, { fill: t.accent, tracking: -0.01 });
  const role3Path = renderTextPath(config.roles[2], 'display', 28, 72, 304, { fill: t.accent, tracking: -0.01 });

  // Subtagline
  const subtaglinePath = renderTextPath(config.subTagline, 'mono', 15, 72, 350, { fill: t.muted, tracking: 0.04 });

  // Status Chip Text
  const statusLabel = config.companyTagline || 'Building at PyGenicArc since Mar 2025';
  const statusPath = renderTextPath(statusLabel, 'mono', 13, 106, 493, { fill: t.text, tracking: 0.05 });

  // Scope Geometry: Shifted left so scope is completely uncovered
  const scopeX = 450;
  const scopeW = 430;
  const scopeY = 52;
  const scopeH = 436;

  // Waveform coordinates mapped to uncovered scope width
  const wfStartX = scopeX + 30;
  const wfEndX = scopeX + scopeW - 30;
  const wfMidY = scopeY + scopeH / 2;
  const wfWidth = wfEndX - wfStartX;
  const wfAmp = 50;
  const N = 40;

  function makeWaveform(sampleFn) {
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const p = i / N;
      const x = wfStartX + p * wfWidth;
      const y = sampleFn(p);
      pts.push({ x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) });
    }
    let d = `M ${pts[0].x} ${pts[0].y}`;
    const dx = wfWidth / N;
    for (let i = 1; i <= N; i++) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const cp1x = Number((p0.x + dx * 0.4).toFixed(1));
      const cp2x = Number((p1.x - dx * 0.4).toFixed(1));
      d += ` C ${cp1x} ${p0.y}, ${cp2x} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  }

  const sineWf = makeWaveform(p => wfMidY - wfAmp * Math.sin(p * Math.PI * 6));
  const distWf = makeWaveform(p => {
    const raw = Math.sin(p * Math.PI * 6) + 0.35 * Math.sin(p * Math.PI * 12 + 0.4);
    return wfMidY - wfAmp * Math.tanh(raw * 1.4);
  });
  const clipWf = makeWaveform(p => {
    const raw = Math.sin(p * Math.PI * 6) * 1.8;
    return wfMidY - wfAmp * (Math.max(-0.7, Math.min(0.7, raw)) / 0.7);
  });
  const squareWf = makeWaveform(p => wfMidY - wfAmp * Math.tanh(Math.sin(p * Math.PI * 6) * 15) * 0.95);
  const bitsWf = makeWaveform(p => {
    const bits = [1, 0, 1, 1, 0, 1, 0, 0];
    const b = bits[Math.min(7, Math.floor(p * 8))];
    return wfMidY + wfAmp * (b === 1 ? -0.85 : 0.85);
  });

  const morphValues = `${sineWf}; ${distWf}; ${clipWf}; ${squareWf}; ${bitsWf}; ${sineWf}`;
  const morphKeyTimes = '0; 0.22; 0.44; 0.66; 0.88; 1';

  // Snapshot handling for static audits
  let activeWaveform = sineWf;
  let r1Op = '1', r2Op = '0', r3Op = '0';
  let anOp = '1', compOp = '0.35', digOp = '0.35', codeOp = '0.35';

  if (snapshotTime !== null) {
    if (snapshotTime < 2.5) {
      activeWaveform = sineWf;
      r1Op = '1'; r2Op = '0'; r3Op = '0';
      anOp = '1'; compOp = '0.35'; digOp = '0.35'; codeOp = '0.35';
    } else if (snapshotTime < 5.5) {
      activeWaveform = clipWf;
      r1Op = '0'; r2Op = '1'; r3Op = '0';
      anOp = '0.35'; compOp = '1'; digOp = '0.35'; codeOp = '0.35';
    } else if (snapshotTime < 8.5) {
      activeWaveform = squareWf;
      r1Op = '0'; r2Op = '1'; r3Op = '0';
      anOp = '0.35'; compOp = '0.35'; digOp = '1'; codeOp = '0.35';
    } else {
      activeWaveform = bitsWf;
      r1Op = '0'; r2Op = '0'; r3Op = '1';
      anOp = '0.35'; compOp = '0.35'; digOp = '0.35'; codeOp = '1';
    }
  }

  // Telemetry labels inside scope
  const scopeHeaderLeft = renderTextPath('CH1 50mV / 10μs', 'mono', 11, scopeX + 20, scopeY + 28, { fill: t.muted, tracking: 0.08 });
  const scopeHeaderRight = renderTextPath('12.0s CLK / RUN', 'mono', 11, scopeX + scopeW - 20, scopeY + 28, { fill: t.muted, tracking: 0.08, anchor: 'end' });

  // 4 Stage Labels below scope (100% uncovered)
  const stageY = 512;
  const labelAnalog = renderTextPath('ANALOG', 'mono', 11, scopeX + 45, stageY, { fill: t.muted, tracking: 0.08 });
  const labelComparator = renderTextPath('COMPARATOR', 'mono', 11, scopeX + 130, stageY, { fill: t.muted, tracking: 0.08 });
  const labelDigital = renderTextPath('DIGITAL', 'mono', 11, scopeX + 250, stageY, { fill: t.muted, tracking: 0.08 });
  const labelCode = renderTextPath('CODE', 'mono', 11, scopeX + 340, stageY, { fill: t.muted, tracking: 0.08 });

  // Grid dots inside scope
  const gridDots = [];
  for (let gx = scopeX + 30; gx <= scopeX + scopeW - 30; gx += 36) {
    for (let gy = scopeY + 48; gy <= scopeY + scopeH - 48; gy += 36) {
      gridDots.push(`<circle cx="${gx}" cy="${gy}" r="1" fill="${t.grid}" />`);
    }
  }

  // Dedicated ID Window Geometry (Option 2)
  const idWinX = 904;
  const idWinY = 52;
  const idWinW = 224;
  const idWinH = 436;

  const idHeader = renderTextPath('OPERATOR ID // 2025', 'mono', 10, idWinX + 16, idWinY + 22, { fill: t.muted, tracking: 0.08 });
  const idName = renderTextPath('NAVEEN KUMAR K', 'mono', 10, idWinX + idWinW / 2, idWinY + idWinH - 14, { fill: t.accent, tracking: 0.08, anchor: 'middle' });

  // Photo layer preparation
  let idContent = '';
  if (showPhoto) {
    const photoDataUri = await getOptimizedCutoutWebP();
    idContent = `
    <!-- Interior Photo Port -->
    <g clip-path="url(#idWindowInteriorClip)">
      <g mask="url(#shoulderFeatherMaskOpt2)" transform="translate(${idWinX - 10}, ${idWinY + 32})">
        <image href="${photoDataUri}" x="0" y="0" width="${idWinW + 20}" height="${idWinH - 56}" preserveAspectRatio="xMidYMax meet" filter="url(#photoFilter)" />
        
        <!-- Scanline at top edge in first frame, 1px, 25% opacity -->
        <line x1="0" y1="0" x2="${idWinW + 20}" y2="0" stroke="${t.accent}" stroke-width="1" opacity="0.25">
          <animateTransform attributeName="transform" type="translate" from="0 0" to="0 ${idWinH - 56}" dur="12s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.4;0.5;0.4;0.25" dur="12s" repeatCount="indefinite" />
        </line>
      </g>
    </g>`;
  } else {
    // Monogram inside ID window
    const monogramPath = renderTextPath('NK', 'display', 48, idWinX + idWinW / 2, idWinY + idWinH / 2 + 10, { fill: t.accent, tracking: 0.05, anchor: 'middle' });
    idContent = `
    <g transform="translate(0, 0)">
      <circle cx="${idWinX + idWinW / 2}" cy="${idWinY + idWinH / 2}" r="50" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1.5" />
      ${monogramPath.toSvg()}
    </g>`;
  }

  // Duotone filter: warm paper tone in light mode, neutral duotone with accent rim in dark mode
  const filterDef = isDark ? `
    <filter id="photoFilter" x="-10%" y="-10%" width="120%" height="120%">
      <feColorMatrix type="matrix" values="
        0.35 0.35 0.35 0 0.05
        0.35 0.35 0.35 0 0.05
        0.35 0.35 0.35 0 0.06
        0    0    0    1 0" />
    </filter>` : `
    <filter id="photoFilter" x="-10%" y="-10%" width="120%" height="120%">
      <feColorMatrix type="matrix" values="
        0.42 0.42 0.42 0 0.16
        0.39 0.39 0.39 0 0.14
        0.34 0.34 0.34 0 0.10
        0    0    0    1 0" />
    </filter>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 560" width="1200" height="560">
  <defs>
    <!-- ID Window Interior ClipPath -->
    <clipPath id="idWindowInteriorClip">
      <rect x="${idWinX}" y="${idWinY + 32}" width="${idWinW}" height="${idWinH - 60}" />
    </clipPath>

    <!-- Shoulder Side Feather Mask -->
    <linearGradient id="featherGradOpt2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fff" stop-opacity="0" />
      <stop offset="8%" stop-color="#fff" stop-opacity="1" />
      <stop offset="92%" stop-color="#fff" stop-opacity="1" />
      <stop offset="100%" stop-color="#fff" stop-opacity="0" />
    </linearGradient>
    <mask id="shoulderFeatherMaskOpt2">
      <rect x="0" y="0" width="${idWinW + 20}" height="${idWinH}" fill="url(#featherGradOpt2)" />
    </mask>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    ${filterDef}
  </defs>

  <!-- Background Base -->
  <rect width="100%" height="100%" fill="${t.bg}" />
  <rect x="16" y="16" width="1168" height="528" rx="20" fill="none" stroke="${t.hairline}" stroke-width="1" />

  <!-- ==================== LEFT COLUMN: IDENTITY AND ROLES ==================== -->
  <g id="hero-left">
    ${eyebrowPath.toSvg()}
    ${name1Path.toSvg()}
    ${name2Path.toSvg()}

    <!-- Cross-fading 3 Roles -->
    <g id="role-slot">
      <g opacity="${r1Op}">
        ${role1Path.toSvg()}
        <animate attributeName="opacity" dur="12s" repeatCount="indefinite"
          values="1; 1; 0; 0; 0; 0; 1" keyTimes="0; 0.28; 0.33; 0.95; 0.98; 0.99; 1"
          calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
      </g>
      <g opacity="${r2Op}">
        ${role2Path.toSvg()}
        <animate attributeName="opacity" dur="12s" repeatCount="indefinite"
          values="0; 0; 1; 1; 0; 0; 0" keyTimes="0; 0.28; 0.33; 0.61; 0.66; 0.99; 1"
          calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
      </g>
      <g opacity="${r3Op}">
        ${role3Path.toSvg()}
        <animate attributeName="opacity" dur="12s" repeatCount="indefinite"
          values="0; 0; 0; 0; 1; 1; 0" keyTimes="0; 0.61; 0.66; 0.94; 0.99; 0.995; 1"
          calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
      </g>
    </g>

    ${subtaglinePath.toSvg()}

    <!-- Status Chip -->
    <g id="status-chip" transform="translate(0, 0)">
      <rect x="72" y="472" width="${statusPath.width + 54}" height="34" rx="8" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
      <circle cx="89" cy="489" r="4.5" fill="${t.accent}">
        <animate attributeName="opacity" values="1; 0.3; 1" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="89" cy="489" r="7.5" fill="none" stroke="${t.accent}" stroke-width="1" opacity="0.4">
        <animate attributeName="r" values="5; 9; 5" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6; 0; 0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      ${statusPath.toSvg()}
    </g>
  </g>

  <!-- ==================== CENTER: OSCILLOSCOPE (100% UNCOVERED) ==================== -->
  <g id="hero-oscilloscope">
    <!-- Frame -->
    <rect x="${scopeX}" y="${scopeY}" width="${scopeW}" height="${scopeH}" rx="18" fill="${t.surface}" stroke="${t.hairline}" stroke-width="1.5" />
    <rect x="${scopeX + 14}" y="${scopeY + 14}" width="${scopeW - 28}" height="${scopeH - 28}" rx="12" fill="${t.bg}" stroke="${t.hairline}" stroke-width="1" />

    <!-- Grid Dots -->
    <g id="scope-grid">
      ${gridDots.join('\n      ')}
      <line x1="${scopeX + 14}" y1="${wfMidY}" x2="${scopeX + scopeW - 14}" y2="${wfMidY}" stroke="${t.grid}" stroke-width="1" stroke-dasharray="3 5" />
      <line x1="${scopeX + scopeW / 2}" y1="${scopeY + 14}" x2="${scopeX + scopeW / 2}" y2="${scopeY + scopeH - 14}" stroke="${t.grid}" stroke-width="1" stroke-dasharray="3 5" />
    </g>

    ${scopeHeaderLeft.toSvg()}
    ${scopeHeaderRight.toSvg()}

    <polygon points="${scopeX + 18},${wfMidY} ${scopeX + 25},${wfMidY - 4} ${scopeX + 25},${wfMidY + 4}" fill="${t.accent}" opacity="0.8" />

    <!-- Morphing Waveform (100% visible, sine start fully exposed) -->
    <g filter="url(#glow)">
      <path id="scope-signal" d="${activeWaveform}" fill="none" stroke="${t.accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <animate attributeName="d" dur="12s" repeatCount="indefinite"
          values="${morphValues}" keyTimes="${morphKeyTimes}"
          calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
      </path>
    </g>

    <!-- Stage Indicators Beneath Scope (100% visible) -->
    <g id="scope-stage-indicators">
      <g opacity="${anOp}">
        ${labelAnalog.toSvg()}
        <animate attributeName="opacity" dur="12s" repeatCount="indefinite"
          values="1; 1; 0.35; 0.35; 0.35; 1" keyTimes="0; 0.25; 0.3; 0.95; 0.99; 1" />
      </g>
      <g opacity="${compOp}">
        ${labelComparator.toSvg()}
        <animate attributeName="opacity" dur="12s" repeatCount="indefinite"
          values="0.35; 0.35; 1; 1; 0.35; 0.35" keyTimes="0; 0.24; 0.29; 0.52; 0.57; 1" />
      </g>
      <g opacity="${digOp}">
        ${labelDigital.toSvg()}
        <animate attributeName="opacity" dur="12s" repeatCount="indefinite"
          values="0.35; 0.35; 1; 1; 0.35; 0.35" keyTimes="0; 0.49; 0.54; 0.77; 0.82; 1" />
      </g>
      <g opacity="${codeOp}">
        ${labelCode.toSvg()}
        <animate attributeName="opacity" dur="12s" repeatCount="indefinite"
          values="0.35; 0.35; 1; 1; 0.35; 0.35" keyTimes="0; 0.74; 0.79; 0.95; 0.99; 1" />
      </g>
    </g>
  </g>

  <!-- ==================== RIGHT: DEDICATED ID WINDOW (OPTION 2) ==================== -->
  <g id="hero-id-window">
    <rect x="${idWinX}" y="${idWinY}" width="${idWinW}" height="${idWinH}" rx="16" fill="${t.surface}" stroke="${t.hairline}" stroke-width="1.5" />
    
    <!-- ID Header bar -->
    <rect x="${idWinX}" y="${idWinY}" width="${idWinW}" height="32" rx="16" fill="${t.surface2}" />
    <rect x="${idWinX}" y="${idWinY + 20}" width="${idWinW}" height="12" fill="${t.surface2}" />
    <line x1="${idWinX}" y1="${idWinY + 32}" x2="${idWinX + idWinW}" y2="${idWinY + 32}" stroke="${t.hairline}" stroke-width="1" />
    <circle cx="${idWinX + idWinW - 16}" cy="${idWinY + 16}" r="3.5" fill="${t.accent}" />
    ${idHeader.toSvg()}

    <!-- Interior Content -->
    ${idContent}

    <!-- Bottom Tag Bar -->
    <line x1="${idWinX}" y1="${idWinY + idWinH - 28}" x2="${idWinX + idWinW}" y2="${idWinY + idWinH - 28}" stroke="${t.hairline}" stroke-width="1" />
    ${idName.toSvg()}
  </g>
</svg>`;
}
