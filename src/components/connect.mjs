import { renderTextPath } from '../font-outliner.mjs';

/**
 * Builds the Connect Terminal SVG panel (1200 x 280).
 * @param {'dark'|'light'} mode 
 * @param {object} config 
 * @param {object} t Design token theme
 */
export async function buildConnectSvg(mode, config, t) {
  // Terminal top bar title
  const termTitle = renderTextPath('naveen@bengaluru:~ (bash)', 'mono', 11, 100, 40, { fill: t.muted, tracking: 0.05 });

  // Terminal Prompt line
  const promptUser = renderTextPath('naveen@bengaluru:~$ ', 'mono', 16, 72, 94, { fill: t.accent, tracking: 0.02 });
  const promptCmd = renderTextPath('ping --open-to collaborate', 'mono', 16, 72 + promptUser.width, 94, { fill: t.text, tracking: 0.02 });
  const cursorX = 72 + promptUser.width + promptCmd.width + 4;

  // Terminal Output (system monospace)
  const resp1Text = `<text x="72" y="134" fill="${t.muted}" font-family="monospace, ui-monospace, SFMono-Regular, Menlo, Consolas" font-size="12">PING collaborate (bengaluru.in): 56 data bytes</text>`;
  const resp2Text = `<text x="72" y="160" fill="${t.muted}" font-family="monospace, ui-monospace, SFMono-Regular, Menlo, Consolas" font-size="12">64 bytes from naveen: icmp_seq=1 ttl=64 time=0.042 ms (STATUS: READY)</text>`;

  // Text-only link tiles for confirmed links
  const tileY = 196;
  const tileHeight = 44;

  // Tile 1: GitHub
  const ghHref = config.links?.github || 'https://github.com/Naveenkumar2313';
  const ghLabel = renderTextPath('GITHUB //', 'mono', 11, 92, tileY + 28, { fill: t.accent, tracking: 0.08 });
  const ghVal = renderTextPath(ghHref, 'display', 13, 92 + ghLabel.width + 12, tileY + 27, { fill: t.text, tracking: 0.01 });
  const ghWidth = 460;

  // Tile 2: LinkedIn (exact full URL as requested)
  const liHref = config.links?.linkedin || 'https://www.linkedin.com/in/naveen-kumar-k-426a4a294/';
  const liX = 560;
  const liLabel = renderTextPath('LINKEDIN //', 'mono', 11, liX + 20, tileY + 28, { fill: t.accent, tracking: 0.08 });
  const liVal = renderTextPath(liHref, 'display', 12, liX + 20 + liLabel.width + 10, tileY + 27, { fill: t.text, tracking: 0.01 });
  const liWidth = 568;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 280" width="1200" height="280">
  <!-- Base Canvas -->
  <rect width="100%" height="100%" fill="${t.bg}" />
  <rect x="16" y="16" width="1168" height="248" rx="20" fill="${t.surface}" stroke="${t.hairline}" stroke-width="1.5" />

  <!-- Terminal Top Header Bar -->
  <path d="M 16 36 A 20 20 0 0 1 36 16 L 1164 16 A 20 20 0 0 1 1184 36 L 1184 52 L 16 52 Z" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
  
  <!-- Terminal Window Controls -->
  <circle cx="44" cy="34" r="4.5" fill="${t.hairline}" />
  <circle cx="60" cy="34" r="4.5" fill="${t.hairline}" />
  <circle cx="76" cy="34" r="4.5" fill="${t.hairline}" />

  ${termTitle.toSvg()}

  <!-- Terminal Content -->
  <!-- Prompt line -->
  ${promptUser.toSvg()}
  ${promptCmd.toSvg()}

  <!-- Stepped Blinking Cursor Block -->
  <rect x="${cursorX}" y="78" width="9" height="19" fill="${t.accent}">
    <animate attributeName="opacity" dur="1s" repeatCount="indefinite"
      values="1; 1; 0; 0" keyTimes="0; 0.5; 0.51; 1" />
  </rect>

  <!-- Output stream -->
  ${resp1Text}
  ${resp2Text}

  <!-- Link Tile 1: GitHub -->
  <rect x="72" y="${tileY}" width="${ghWidth}" height="${tileHeight}" rx="8" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
  ${ghLabel.toSvg()}
  ${ghVal.toSvg()}

  <!-- Link Tile 2: LinkedIn -->
  <rect x="${liX}" y="${tileY}" width="${liWidth}" height="${tileHeight}" rx="8" fill="${t.surface2}" stroke="${t.hairline}" stroke-width="1" />
  ${liLabel.toSvg()}
  ${liVal.toSvg()}
</svg>`;
}
