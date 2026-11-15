import fs from 'fs';
import path from 'path';

const outDir = path.resolve('render-lab');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. SMIL Opacity and Transform
const svg01 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <rect width="100%" height="100%" fill="#13161B" rx="8" stroke="#262B33"/>
  <text x="20" y="30" fill="#8D95A1" font-family="monospace" font-size="12">01. SMIL Opacity &amp; Transform</text>
  <!-- Opacity pulse -->
  <circle cx="80" cy="70" r="24" fill="#F5A524">
    <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
  </circle>
  <text x="80" y="105" fill="#ECEEF1" font-family="monospace" font-size="10" text-anchor="middle">Opacity</text>
  <!-- Rotate transform -->
  <g transform="translate(240, 70)">
    <rect x="-18" y="-18" width="36" height="36" fill="none" stroke="#F5A524" stroke-width="3">
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
    </rect>
  </g>
  <text x="240" y="105" fill="#ECEEF1" font-family="monospace" font-size="10" text-anchor="middle">Transform Rotate</text>
</svg>`;
fs.writeFileSync(path.join(outDir, '01-smil-opacity-transform.svg'), svg01);

// 2. Animate Motion
const svg02 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <rect width="100%" height="100%" fill="#13161B" rx="8" stroke="#262B33"/>
  <text x="20" y="30" fill="#8D95A1" font-family="monospace" font-size="12">02. SMIL animateMotion</text>
  <path id="track" d="M 40 70 Q 120 20 200 70 T 360 70" fill="none" stroke="#262B33" stroke-width="2" stroke-dasharray="4 4"/>
  <circle r="6" fill="#F5A524">
    <animateMotion dur="3s" repeatCount="indefinite" path="M 40 70 Q 120 20 200 70 T 360 70" />
  </circle>
  <text x="200" y="105" fill="#ECEEF1" font-family="monospace" font-size="10" text-anchor="middle">Pulse following path</text>
</svg>`;
fs.writeFileSync(path.join(outDir, '02-animate-motion.svg'), svg02);

// 3. Path Morphing
const svg03 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <rect width="100%" height="100%" fill="#13161B" rx="8" stroke="#262B33"/>
  <text x="20" y="30" fill="#8D95A1" font-family="monospace" font-size="12">03. SMIL Path d-Attribute Morph</text>
  <path d="M 50 70 C 100 40, 150 100, 200 70 C 250 40, 300 100, 350 70" fill="none" stroke="#F5A524" stroke-width="3">
    <animate attributeName="d" dur="3s" repeatCount="indefinite"
      values="M 50 70 C 100 40, 150 100, 200 70 C 250 40, 300 100, 350 70;
              M 50 70 C 100 70, 150 70, 200 70 C 250 70, 300 70, 350 70;
              M 50 70 C 100 100, 150 40, 200 70 C 250 100, 300 40, 350 70;
              M 50 70 C 100 40, 150 100, 200 70 C 250 40, 300 100, 350 70" />
  </path>
</svg>`;
fs.writeFileSync(path.join(outDir, '03-path-morph.svg'), svg03);

// 4. CSS Keyframes in Style Block
const svg04 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <style>
    @keyframes colorCycle {
      0% { fill: #F5A524; transform: scale(1); }
      50% { fill: #38BDF8; transform: scale(1.15); }
      100% { fill: #F5A524; transform: scale(1); }
    }
    .css-anim {
      transform-origin: 200px 70px;
      animation: colorCycle 3s infinite ease-in-out;
    }
  </style>
  <rect width="100%" height="100%" fill="#13161B" rx="8" stroke="#262B33"/>
  <text x="20" y="30" fill="#8D95A1" font-family="monospace" font-size="12">04. CSS Keyframes in &lt;style&gt;</text>
  <circle class="css-anim" cx="200" cy="70" r="22" />
  <text x="200" y="108" fill="#ECEEF1" font-family="monospace" font-size="10" text-anchor="middle">CSS Keyframes test</text>
</svg>`;
fs.writeFileSync(path.join(outDir, '04-css-keyframes.svg'), svg04);

// 5. @font-face with data-URI WOFF2 (minimal 1-char font test or fallback check)
// Tiny valid base64 woff2 stub (or generic data-uri test)
const svg05 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <style>
    @font-face {
      font-family: 'TestFont';
      src: url('data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAOEAAwAAAAAB1wAAAMwAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGhwIGicHMAZgAFYRCFYEAQE2AiQDCAMEIAWEIAc2G4sHUZSLm5i1a24I+iT4F3bLg/c2/uT27Z03713uO46Yl0SSGvEiqdGomfJgD55e71e7a5EaFmZ7kgg1iW6d3eU49w8gYfV9hL5h/5s3qT2+TqRjE92Q3Qn8Y2T37p13F/vHqYh3o2Kip7v7aO9q8W51c3R9+Hw9P75a');
      font-weight: normal;
      font-style: normal;
    }
    .custom-font {
      font-family: 'TestFont', monospace;
    }
  </style>
  <rect width="100%" height="100%" fill="#13161B" rx="8" stroke="#262B33"/>
  <text x="20" y="30" fill="#8D95A1" font-family="monospace" font-size="12">05. @font-face Data-URI WOFF2</text>
  <text x="200" y="70" fill="#F5A524" font-size="24" text-anchor="middle" class="custom-font">WOFF2 EMBED TEST</text>
  <text x="200" y="98" fill="#8D95A1" font-family="monospace" font-size="10" text-anchor="middle">Camo usually blocks external; data:uri often stripped</text>
</svg>`;
fs.writeFileSync(path.join(outDir, '05-font-face-woff2.svg'), svg05);

// 6. Embedded PNG and WebP
// 1x1 orange PNG:
const png1x1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
// 1x1 orange WebP:
const webp1x1 = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';

const svg06 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <rect width="100%" height="100%" fill="#13161B" rx="8" stroke="#262B33"/>
  <text x="20" y="30" fill="#8D95A1" font-family="monospace" font-size="12">06. Embedded Raster (PNG &amp; WebP)</text>
  <g transform="translate(100, 45)">
    <image href="${png1x1}" width="40" height="40" />
    <rect x="0" y="0" width="40" height="40" fill="none" stroke="#262B33"/>
    <text x="20" y="55" fill="#ECEEF1" font-family="monospace" font-size="10" text-anchor="middle">PNG</text>
  </g>
  <g transform="translate(260, 45)">
    <image href="${webp1x1}" width="40" height="40" />
    <rect x="0" y="0" width="40" height="40" fill="none" stroke="#262B33"/>
    <text x="20" y="55" fill="#ECEEF1" font-family="monospace" font-size="10" text-anchor="middle">WebP</text>
  </g>
</svg>`;
fs.writeFileSync(path.join(outDir, '06-embedded-png-webp.svg'), svg06);

// 7. Filters: feGaussianBlur and feColorMatrix
const svg07 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <defs>
    <filter id="blurFilter">
      <feGaussianBlur stdDeviation="4"/>
    </filter>
    <filter id="matrixFilter">
      <feColorMatrix type="matrix" values="
        0.33 0.33 0.33 0 0
        0.33 0.33 0.33 0 0
        0.33 0.33 0.33 0 0
        0    0    0    1 0"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#13161B" rx="8" stroke="#262B33"/>
  <text x="20" y="30" fill="#8D95A1" font-family="monospace" font-size="12">07. SVG Filters (Blur &amp; ColorMatrix)</text>
  <circle cx="120" cy="70" r="22" fill="#F5A524" filter="url(#blurFilter)"/>
  <text x="120" y="105" fill="#ECEEF1" font-family="monospace" font-size="10" text-anchor="middle">feGaussianBlur</text>
  
  <rect x="250" y="50" width="40" height="40" fill="#F5A524" filter="url(#matrixFilter)"/>
  <text x="270" y="105" fill="#ECEEF1" font-family="monospace" font-size="10" text-anchor="middle">feColorMatrix</text>
</svg>`;
fs.writeFileSync(path.join(outDir, '07-filters-blur-matrix.svg'), svg07);

// 8. Mask and ClipPath
const svg08 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <defs>
    <clipPath id="circleClip">
      <circle cx="120" cy="70" r="24"/>
    </clipPath>
    <linearGradient id="maskGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fff"/>
      <stop offset="100%" stop-color="#000"/>
    </linearGradient>
    <mask id="fadeMask">
      <rect x="240" y="46" width="60" height="48" fill="url(#maskGrad)"/>
    </mask>
  </defs>
  <rect width="100%" height="100%" fill="#13161B" rx="8" stroke="#262B33"/>
  <text x="20" y="30" fill="#8D95A1" font-family="monospace" font-size="12">08. clipPath &amp; mask</text>
  
  <g clip-path="url(#circleClip)">
    <rect x="90" y="40" width="60" height="60" fill="#F5A524"/>
    <line x1="90" y1="40" x2="150" y2="100" stroke="#13161B" stroke-width="6"/>
  </g>
  <text x="120" y="105" fill="#ECEEF1" font-family="monospace" font-size="10" text-anchor="middle">clipPath</text>
  
  <rect x="240" y="46" width="60" height="48" fill="#F5A524" mask="url(#fadeMask)"/>
  <text x="270" y="105" fill="#ECEEF1" font-family="monospace" font-size="10" text-anchor="middle">linear mask</text>
</svg>`;
fs.writeFileSync(path.join(outDir, '08-mask-clippath.svg'), svg08);

// 09. Dark/Light Pairs
const svg09Dark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <rect width="100%" height="100%" fill="#0C0E11" rx="8" stroke="#262B33"/>
  <text x="20" y="30" fill="#8D95A1" font-family="monospace" font-size="12">09. Theme Pair: DARK DETECTED</text>
  <rect x="40" y="50" width="320" height="40" fill="#13161B" stroke="#F5A524" rx="4"/>
  <text x="200" y="75" fill="#ECEEF1" font-family="monospace" font-size="14" text-anchor="middle">ACTIVE: DARK THEME (#0C0E11 / #F5A524)</text>
</svg>`;
fs.writeFileSync(path.join(outDir, '09-dark.svg'), svg09Dark);

const svg09Light = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <rect width="100%" height="100%" fill="#F5F3EE" rx="8" stroke="#D8D3C8"/>
  <text x="20" y="30" fill="#5A616C" font-family="monospace" font-size="12">09. Theme Pair: LIGHT DETECTED</text>
  <rect x="40" y="50" width="320" height="40" fill="#FBFAF7" stroke="#B45309" rx="4"/>
  <text x="200" y="75" fill="#13161B" font-family="monospace" font-size="14" text-anchor="middle">ACTIVE: LIGHT THEME (#F5F3EE / #B45309)</text>
</svg>`;
fs.writeFileSync(path.join(outDir, '09-light.svg'), svg09Light);

// 10. prefers-reduced-motion
const svg10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <style>
    @keyframes moveX {
      0% { transform: translateX(0px); }
      100% { transform: translateX(120px); }
    }
    .motion-ball {
      animation: moveX 2s infinite alternate ease-in-out;
    }
    @media (prefers-reduced-motion: reduce) {
      .motion-ball {
        animation: none;
      }
      .reduced-text {
        display: block !important;
      }
    }
  </style>
  <rect width="100%" height="100%" fill="#13161B" rx="8" stroke="#262B33"/>
  <text x="20" y="30" fill="#8D95A1" font-family="monospace" font-size="12">10. prefers-reduced-motion</text>
  <g transform="translate(140, 70)">
    <circle class="motion-ball" cx="0" cy="0" r="14" fill="#F5A524"/>
  </g>
  <text x="200" y="105" fill="#8D95A1" font-family="monospace" font-size="10" text-anchor="middle">If system reduces motion, ball stays parked</text>
</svg>`;
fs.writeFileSync(path.join(outDir, '10-reduced-motion.svg'), svg10);

// 11. ?v= cache busting test
const svg11 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <rect width="100%" height="100%" fill="#13161B" rx="8" stroke="#262B33"/>
  <text x="20" y="30" fill="#8D95A1" font-family="monospace" font-size="12">11. Cache Busting ?v=N</text>
  <circle cx="80" cy="70" r="18" fill="#F5A524"/>
  <text x="120" y="75" fill="#ECEEF1" font-family="monospace" font-size="14">Asset Version: v=1</text>
  <text x="20" y="105" fill="#8D95A1" font-family="monospace" font-size="10">Checks if Camo honors query param updates</text>
</svg>`;
fs.writeFileSync(path.join(outDir, '11-cache-bust-v.svg'), svg11);

// 12. Outlined vector text (Path instead of text)
// Hand-crafted clean vector glyphs for "SIGNAL"
const svg12 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <rect width="100%" height="100%" fill="#13161B" rx="8" stroke="#262B33"/>
  <text x="20" y="30" fill="#8D95A1" font-family="monospace" font-size="12">12. Outlined Vector Text (0% font dependency)</text>
  <!-- Outlined letters S I G N A L -->
  <g transform="translate(60, 50)" fill="#F5A524">
    <!-- S -->
    <path d="M 30 5 C 25 0, 5 0, 5 12 C 5 24, 30 18, 30 30 C 30 42, 5 42, 0 35 L 4 28 C 9 34, 25 35, 25 29 C 25 20, 0 24, 0 12 C 0 0, 24 0, 30 0 Z"/>
    <!-- I -->
    <path d="M 45 2 H 52 V 40 H 45 Z"/>
    <!-- G -->
    <path d="M 85 8 C 75 0, 60 4, 60 21 C 60 38, 75 42, 85 36 V 23 H 74 V 17 H 91 V 40 C 80 46, 54 44, 54 21 C 54 -1, 80 -1, 89 5 Z"/>
    <!-- N -->
    <path d="M 100 2 H 107 L 123 30 V 2 H 129 V 40 H 122 L 106 12 V 40 H 100 Z"/>
    <!-- A -->
    <path d="M 148 2 H 155 L 168 40 H 161 L 157 28 H 146 L 142 40 H 135 Z M 151 10 L 148 22 H 155 Z"/>
    <!-- L -->
    <path d="M 178 2 H 185 V 34 H 200 V 40 H 178 Z"/>
  </g>
  <text x="200" y="105" fill="#8D95A1" font-family="monospace" font-size="10" text-anchor="middle">Pure Bézier curves; renders identically on any machine</text>
</svg>`;
fs.writeFileSync(path.join(outDir, '12-outlined-text.svg'), svg12);

// 13. File size test ~300 KB
const junk300kb = '<!-- ' + 'X'.repeat(300 * 1024) + ' -->';
const svg13 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <rect width="100%" height="100%" fill="#13161B" rx="8" stroke="#262B33"/>
  <text x="20" y="30" fill="#8D95A1" font-family="monospace" font-size="12">13. Size Test: 300 KB Payload</text>
  <circle cx="80" cy="70" r="20" fill="#F5A524"/>
  <text x="120" y="75" fill="#ECEEF1" font-family="monospace" font-size="14">300 KB SVG Loaded Successfully</text>
  <text x="20" y="105" fill="#8D95A1" font-family="monospace" font-size="10">Verifies GitHub Camo proxy size cutoff &gt;= 300KB</text>
  ${junk300kb}
</svg>`;
fs.writeFileSync(path.join(outDir, '13-size-300kb.svg'), svg13);

// 14. File size test ~800 KB
const junk800kb = '<!-- ' + 'X'.repeat(800 * 1024) + ' -->';
const svg14 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <rect width="100%" height="100%" fill="#13161B" rx="8" stroke="#262B33"/>
  <text x="20" y="30" fill="#8D95A1" font-family="monospace" font-size="12">14. Size Test: 800 KB Payload</text>
  <circle cx="80" cy="70" r="20" fill="#F5A524"/>
  <text x="120" y="75" fill="#ECEEF1" font-family="monospace" font-size="14">800 KB SVG Loaded Successfully</text>
  <text x="20" y="105" fill="#8D95A1" font-family="monospace" font-size="10">Verifies GitHub Camo proxy limit behaviour around 800KB</text>
  ${junk800kb}
</svg>`;
fs.writeFileSync(path.join(outDir, '14-size-800kb.svg'), svg14);

console.log('Render-lab SVG suite generated.');
