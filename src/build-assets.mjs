import fs from 'fs';
import path from 'path';
import { theme } from './theme.mjs';
import { initFonts } from './font-outliner.mjs';
import { buildHeroSvg } from './components/hero.mjs';

async function main() {
  console.log('--- Project SIGNAL: Build Pipeline ---');
  const configRaw = fs.readFileSync(path.resolve('src/profile.config.json'), 'utf8');
  const config = JSON.parse(configRaw);

  const assetsDir = path.resolve('assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  console.log('[1/3] Loading OFL typography (Space Grotesk & JetBrains Mono)...');
  await initFonts();

  console.log('[2/3] Generating Hero panels (Dark & Light)...');
  // 1. Hero Panels (Configured variant: photo: true)
  const heroDarkSvg = await buildHeroSvg('dark', config, theme.dark);
  const heroLightSvg = await buildHeroSvg('light', config, theme.light);

  fs.writeFileSync(path.join(assetsDir, 'hero-dark.svg'), heroDarkSvg);
  fs.writeFileSync(path.join(assetsDir, 'hero-light.svg'), heroLightSvg);

  // Also generate the no-photo (monogram) variant for validation
  const monogramConfig = { ...config, photo: false };
  const heroMonogramDarkSvg = await buildHeroSvg('dark', monogramConfig, theme.dark);
  const heroMonogramLightSvg = await buildHeroSvg('light', monogramConfig, theme.light);

  fs.writeFileSync(path.join(assetsDir, 'hero-monogram-dark.svg'), heroMonogramDarkSvg);
  fs.writeFileSync(path.join(assetsDir, 'hero-monogram-light.svg'), heroMonogramLightSvg);

  // Generate 4 timestamp frames (t=0s, 3s, 6s, 9s) for visual audit
  const timestamps = [0, 3, 6, 9];
  for (const tSec of timestamps) {
    const frameDark = await buildHeroSvg('dark', config, theme.dark, tSec);
    fs.writeFileSync(path.join(assetsDir, `hero-frame-t${tSec}-dark.svg`), frameDark);
  }

  console.log('[3/3] Inspecting asset budgets (Max: 400 KB per file)...');
  const files = [
    'hero-dark.svg',
    'hero-light.svg',
    'hero-monogram-dark.svg',
    'hero-monogram-light.svg'
  ];

  let totalBytes = 0;
  for (const f of files) {
    const filePath = path.join(assetsDir, f);
    const stat = fs.statSync(filePath);
    totalBytes += stat.size;
    const kb = (stat.size / 1024).toFixed(1);
    const pass = stat.size <= 400 * 1024 ? 'PASS' : 'OVER BUDGET';
    console.log(`  - ${f.padEnd(26)} : ${kb.padStart(6)} KB [${pass}]`);
  }
  console.log(`Total generated payload: ${(totalBytes / 1024).toFixed(1)} KB`);
  console.log('Build complete.\n');
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
