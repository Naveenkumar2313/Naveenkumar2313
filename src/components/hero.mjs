import { renderTextPath } from '../font-outliner.mjs';
import { getAllWaveforms } from '../waveform-generator.mjs';
import { getOptimizedCutoutWebP } from '../image-optimizer.mjs';

/**
 * Builds the Hero SVG panel (1200 x 560).
 * @param {'dark'|'light'} mode 
 * @param {object} config 
 * @param {object} t Design token theme
 * @param {number|null} snapshotTime Optional timestamp in seconds (0, 3, 6, 9) for static frame rendering
 */
export async function buildHeroSvg(mode, config, t, snapshotTime = null) {
  const isDark = mode === 'dark';
  const showPhoto = config.photo !== false;

  // Waveforms for 12s clock morphing
  const waveforms = getAllWaveforms();
  
  // Determine static states if snapshotTime is provided
  let activeWaveform = waveforms.sine;
  let r1Op = '1', r2Op = '0', r3Op = '0';
  let anOp = '1', compOp = '0.35', digOp = '0.35', codeOp = '0.35';

  if (snapshotTime !== null) {
    if (snapshotTime < 2.5) {
      activeWaveform = waveforms.sine;
      r1Op = '1'; r2Op = '0'; r3Op = '0';
      anOp = '1'; compOp = '0.35'; digOp = '0.35'; codeOp = '0.35';
    } else if (snapshotTime < 5.5) {
      activeWaveform = waveforms.clipped;
      r1Op = '0'; r2Op = '1'; r3Op = '0';
      anOp = '0.35'; compOp = '1'; digOp = '0.35'; codeOp = '0.35';
    } else if (snapshotTime < 8.5) {
      activeWaveform = waveforms.square;
      r1Op = '0'; r2Op = '1'; r3Op = '0';
      anOp = '0.35'; compOp = '0.35'; digOp = '1'; codeOp = '0.35';
    } else {
      activeWaveform = waveforms.bits;
      r1Op = '0'; r2Op = '0'; r3Op = '1';
      anOp = '0.35'; compOp = '0.35'; digOp = '0.35'; codeOp = '1';
    }
  }
  const eyebrowPath = renderTextPath(config.eyebrow, 'mono', 14, 72, 86, { fill: t.muted, tracking: 0.1 });
  const name1Path = renderTextPath('NAVEEN', 'display', 72, 72, 166, { fill: t.text, tracking: -0.02 });
  const name2Path = renderTextPath('KUMAR K', 'display', 72, 72, 244, { fill: t.text, tracking: -0.02 });

  // 3 Cross-fading roles (4s each, 12s total cycle)
  const role1Path = renderTextPath(config.roles[0], 'display', 28, 72, 304, { fill: t.accent, tracking: -0.01 });
  const role2Path = renderTextPath(config.roles[1], 'display', 28, 72, 304, { fill: t.accent, tracking: -0.01 });
  const role3Path = renderTextPath(config.roles[2], 'display', 28, 72, 304, { fill: t.accent, tracking: -0.01 });

  // Subtagline
  const subtaglinePath = renderTextPath(config.subTagline, 'mono', 15, 72, 350, { fill: t.muted, tracking: 0.04 });

  // Status Chip Text
  const statusLabel = config.companyTagline || 'Building at PyGenicArc since Mar 2025';
  const statusPath = renderTextPath(statusLabel, 'mono', 13, 102, 493, { fill: t.text, tracking: 0.05 });

  // Oscilloscope Stage Labels (Beneath screen)
  const stageY = 512;
  const labelAnalog = renderTextPath('ANALOG', 'mono', 12, 690, stageY, { fill: t.muted, tracking: 0.1, anchor: 'middle' });
  const labelComparator = renderTextPath('COMPARATOR', 'mono', 12, 810, stageY, { fill: t.muted, tracking: 0.1, anchor: 'middle' });
  const labelDigital = renderTextPath('DIGITAL', 'mono', 12, 930, stageY, { fill: t.muted, tracking: 0.1, anchor: 'middle' });
  const labelCode = renderTextPath('CODE', 'mono', 12, 1040, stageY, { fill: t.muted, tracking: 0.1, anchor: 'middle' });

  // Oscilloscope screen telemetry labels
  const scopeHeaderLeft = renderTextPath('CH1 50mV / 10μs', 'mono', 11, 680, 80, { fill: t.muted, tracking: 0.08 });
  const scopeHeaderRight = renderTextPath('12.0s CLK / RUN', 'mono', 11, 1110, 80, { fill: t.muted, tracking: 0.08, anchor: 'end' });

  // Waveforms for 12s clock morphing
  // Morph sequence: Sine -> Distorted -> Clipped -> Square -> Bits -> Sine
  const morphValues = `${waveforms.sine}; ${waveforms.distorted}; ${waveforms.clipped}; ${waveforms.square}; ${waveforms.bits}; ${waveforms.sine}`;
  const morphKeyTimes = '0; 0.22; 0.44; 0.66; 0.88; 1';

  // Photo cutout preparation
  let photoElement = '';
  if (showPhoto) {
    const photoDataUri = await getOptimizedCutoutWebP();
    if (photoDataUri) {
      photoElement = `
      <!-- Photo Cutout with Bottom Anchor and Duotone Accent Treatment -->
      <g id="hero-photo-group" transform="translate(480, 110)">
        <defs>
          <clipPath id="photoClip">
            <rect x="0" y="0" width="300" height="450" />
          </clipPath>
          <filter id="photoDuotone" x="-10%" y="-10%" width="120%" height="120%">
            <!-- Desaturate and remap into subtle technical tone -->
            <feColorMatrix type="matrix" values="
              ${isDark ? '0.4 0.4 0.4 0 0.05' : '0.5 0.5 0.5 0 0.1'}
              ${isDark ? '0.4 0.4 0.4 0 0.06' : '0.5 0.5 0.5 0 0.12'}
              ${isDark ? '0.4 0.4 0.4 0 0.08' : '0.5 0.5 0.5 0 0.15'}
              0   0   0   1 0" />
          </filter>
        </defs>
        <!-- Photo layer -->
        <image href="${photoDataUri}" x="0" y="0" width="280" height="450" preserveAspectRatio="xMidYMax meet" filter="url(#photoDuotone)" />
        <!-- Accent rim light on edge -->
        <rect x="0" y="0" width="2" height="450" fill="${t.accent}" opacity="0.3" />
        <!-- Scanline sweep animation -->
        <line x1="0" y1="0" x2="280" y2="0" stroke="${t.accent}" stroke-width="1.5" opacity="0.4">
          <animateTransform attributeName="transform" type="translate" from="0 0" to="0 450" dur="12s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.5;0.6;0.5;0" dur="12s" repeatCount="indefinite" />
        </line>
      </g>`;
    }
  } else {
    // Monogram Chip Variant
    const monogramPath = renderTextPath('NK', 'display', 42, 576, 310, { fill: t.accent, tracking: 0.05, anchor: 'middle' });
    photoElement = `
    <!-- Monogram IC Chip Variant -->
    <g id="hero-monogram-chip" transform="translate(516, 220)">
      <rect x="0" y="0" width="120" height="140" rx="12" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1.5" />
      <!-- Notch -->
      <path d="M 52 0 A 8 8 0 0 0 68 0 Z" fill="${t.bg}" />
      <!-- Gold corner contact pads -->
      <rect x="6" y="8" width="12" height="4" fill="${t.accent}" opacity="0.8" rx="1" />
      <rect x="102" y="8" width="12" height="4" fill="${t.accent}" opacity="0.8" rx="1" />
      <rect x="6" y="128" width="12" height="4" fill="${t.accent}" opacity="0.8" rx="1" />
      <rect x="102" y="128" width="12" height="4" fill="${t.accent}" opacity="0.8" rx="1" />
      <!-- Monogram text -->
      ${monogramPath.toSvg()}
      <text x="60" y="120" fill="${t.muted}" font-family="monospace" font-size="9" text-anchor="middle" letter-spacing="2">REV 2.5</text>
    </g>`;
  }

  // Grid dots inside oscilloscope (660, 52 to 1128, 488)
  const gridDots = [];
  for (let gx = 690; gx <= 1100; gx += 40) {
    for (let gy = 100; gy <= 440; gy += 40) {
      gridDots.push(`<circle cx="${gx}" cy="${gy}" r="1" fill="${t.grid}" />`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 560" width="1200" height="560">
  <defs>
    <linearGradient id="scopeGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.surface}" stop-opacity="0.9" />
      <stop offset="100%" stop-color="${t.bg}" stop-opacity="0.95" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="100%" height="100%" fill="${t.bg}" />

  <!-- Subtle instrument frame -->
  <rect x="16" y="16" width="1168" height="528" rx="20" fill="none" stroke="${t.hairline}" stroke-width="1" />

  <!-- ==================== LEFT COLUMN: IDENTITY AND ROLES ==================== -->
  <g id="hero-left">
    <!-- Eyebrow -->
    ${eyebrowPath.toSvg()}

    <!-- Huge Name Display -->
    ${name1Path.toSvg()}
    ${name2Path.toSvg()}

    <!-- Cross-fading 3 Roles (4s each, 12s master loop) -->
    <!-- First frame rule: Role 1 visible at t=0 -->
    <g id="role-slot">
      <g opacity="${r1Op}">
        ${role1Path.toSvg()}
        <animate attributeName="opacity" dur="12s" repeatCount="indefinite"
          values="1; 1; 0; 0; 0; 0; 1"
          keyTimes="0; 0.28; 0.33; 0.95; 0.98; 0.99; 1"
          calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
      </g>
      <g opacity="${r2Op}">
        ${role2Path.toSvg()}
        <animate attributeName="opacity" dur="12s" repeatCount="indefinite"
          values="0; 0; 1; 1; 0; 0; 0"
          keyTimes="0; 0.28; 0.33; 0.61; 0.66; 0.99; 1"
          calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
      </g>
      <g opacity="${r3Op}">
        ${role3Path.toSvg()}
        <animate attributeName="opacity" dur="12s" repeatCount="indefinite"
          values="0; 0; 0; 0; 1; 1; 0"
          keyTimes="0; 0.61; 0.66; 0.94; 0.99; 0.995; 1"
          calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
      </g>
    </g>

    <!-- Subtagline Descriptor -->
    ${subtaglinePath.toSvg()}

    <!-- Status Chip -->
    <g id="status-chip" transform="translate(0, 0)">
      <rect x="72" y="472" width="${statusPath.width + 54}" height="34" rx="8" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
      <!-- Pulsing Accent Dot -->
      <circle cx="89" cy="489" r="4.5" fill="${t.accent}">
        <animate attributeName="opacity" values="1; 0.3; 1" dur="2s" repeatCount="indefinite" />
      </circle>
      <!-- Ambient halo -->
      <circle cx="89" cy="489" r="7.5" fill="none" stroke="${t.accent}" stroke-width="1" opacity="0.4">
        <animate attributeName="r" values="5; 9; 5" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6; 0; 0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      ${statusPath.toSvg()}
    </g>
  </g>

  <!-- ==================== RIGHT COLUMN: OSCILLOSCOPE ==================== -->
  <g id="hero-oscilloscope">
    <!-- Scope Enclosure Frame -->
    <rect x="660" y="52" width="468" height="436" rx="20" fill="url(#scopeGrad)" stroke="${t.hairline}" stroke-width="1.5" />
    
    <!-- Screen Bezel Reticle -->
    <rect x="674" y="66" width="440" height="408" rx="14" fill="${t.surface}" stroke="${t.hairline}" stroke-width="1" />

    <!-- Grid Dots Matrix -->
    <g id="scope-grid">
      ${gridDots.join('\n      ')}
      <!-- Center Reticle Lines -->
      <line x1="674" y1="240" x2="1114" y2="240" stroke="${t.grid}" stroke-width="1" stroke-dasharray="3 5" />
      <line x1="894" y1="66" x2="894" y2="474" stroke="${t.grid}" stroke-width="1" stroke-dasharray="3 5" />
    </g>

    <!-- Screen Telemetry Readouts -->
    ${scopeHeaderLeft.toSvg()}
    ${scopeHeaderRight.toSvg()}

    <!-- Trigger Indicator Arrow -->
    <polygon points="678,240 685,236 685,244" fill="${t.accent}" opacity="0.8" />

    <!-- Primary Morphing Signal Waveform -->
    <g filter="url(#glow)">
      <!-- Waveform: dynamically set to active waveform (sine at t=0) -->
      <path id="scope-signal" d="${activeWaveform}" fill="none" stroke="${t.accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <animate attributeName="d" dur="12s" repeatCount="indefinite"
          values="${morphValues}"
          keyTimes="${morphKeyTimes}"
          calcMode="spline"
          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
      </path>
    </g>

    <!-- Stage Indicators Beneath Scope (ANALOG, COMPARATOR, DIGITAL, CODE) -->
    <g id="scope-stage-indicators">
      <!-- ANALOG: active 0s - 3s -->
      <g opacity="${anOp}">
        ${labelAnalog.toSvg()}
        <animate attributeName="opacity" dur="12s" repeatCount="indefinite"
          values="1; 1; 0.35; 0.35; 0.35; 1"
          keyTimes="0; 0.25; 0.3; 0.95; 0.99; 1" />
      </g>
      <!-- COMPARATOR: active 3s - 6s -->
      <g opacity="${compOp}">
        ${labelComparator.toSvg()}
        <animate attributeName="opacity" dur="12s" repeatCount="indefinite"
          values="0.35; 0.35; 1; 1; 0.35; 0.35"
          keyTimes="0; 0.24; 0.29; 0.52; 0.57; 1" />
      </g>
      <!-- DIGITAL: active 6s - 9s -->
      <g opacity="${digOp}">
        ${labelDigital.toSvg()}
        <animate attributeName="opacity" dur="12s" repeatCount="indefinite"
          values="0.35; 0.35; 1; 1; 0.35; 0.35"
          keyTimes="0; 0.49; 0.54; 0.77; 0.82; 1" />
      </g>
      <!-- CODE: active 9s - 12s -->
      <g opacity="${codeOp}">
        ${labelCode.toSvg()}
        <animate attributeName="opacity" dur="12s" repeatCount="indefinite"
          values="0.35; 0.35; 1; 1; 0.35; 0.35"
          keyTimes="0; 0.74; 0.79; 0.95; 0.99; 1" />
      </g>
    </g>
  </g>

  <!-- ==================== PHOTO / MONOGRAM LAYER ==================== -->
  ${photoElement}

</svg>`;
}
