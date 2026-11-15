import fs from 'fs';
import path from 'path';
import { theme } from './theme.mjs';
import { initFonts } from './font-outliner.mjs';
import { buildHeroSvg } from './components/hero.mjs';
import { buildSignalPathSvg } from './components/signal-path.mjs';
import { buildSelectedWorkSvg } from './components/selected-work.mjs';
import { buildBomSvg } from './components/bom.mjs';
import { buildConnectSvg } from './components/connect.mjs';

async function main() {
  console.log('--- Project SIGNAL: Build Pipeline ---');
  const configRaw = fs.readFileSync(path.resolve('src/profile.config.json'), 'utf8');
  const config = JSON.parse(configRaw);

  const assetsDir = path.resolve('assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  console.log('[1/5] Loading OFL typography (Space Grotesk & JetBrains Mono)...');
  await initFonts();

  console.log('[2/5] Generating Hero panels (Dark & Light)...');
  const heroDarkSvg = await buildHeroSvg('dark', config, theme.dark);
  const heroLightSvg = await buildHeroSvg('light', config, theme.light);
  fs.writeFileSync(path.join(assetsDir, 'hero-dark.svg'), heroDarkSvg);
  fs.writeFileSync(path.join(assetsDir, 'hero-light.svg'), heroLightSvg);

  // Monogram variant
  const monogramConfig = { ...config, photo: false };
  const heroMonogramDarkSvg = await buildHeroSvg('dark', monogramConfig, theme.dark);
  const heroMonogramLightSvg = await buildHeroSvg('light', monogramConfig, theme.light);
  fs.writeFileSync(path.join(assetsDir, 'hero-monogram-dark.svg'), heroMonogramDarkSvg);
  fs.writeFileSync(path.join(assetsDir, 'hero-monogram-light.svg'), heroMonogramLightSvg);

  console.log('[3/5] Generating Signal Path panels...');
  const pathDarkSvg = await buildSignalPathSvg('dark', config, theme.dark);
  const pathLightSvg = await buildSignalPathSvg('light', config, theme.light);
  fs.writeFileSync(path.join(assetsDir, 'path-dark.svg'), pathDarkSvg);
  fs.writeFileSync(path.join(assetsDir, 'path-light.svg'), pathLightSvg);

  console.log('[4/5] Generating Selected Work, BOM & Connect panels...');
  const workDarkSvg = await buildSelectedWorkSvg('dark', config, theme.dark);
  const workLightSvg = await buildSelectedWorkSvg('light', config, theme.light);
  fs.writeFileSync(path.join(assetsDir, 'work-dark.svg'), workDarkSvg);
  fs.writeFileSync(path.join(assetsDir, 'work-light.svg'), workLightSvg);

  const bomDarkSvg = await buildBomSvg('dark', config, theme.dark);
  const bomLightSvg = await buildBomSvg('light', config, theme.light);
  fs.writeFileSync(path.join(assetsDir, 'bom-dark.svg'), bomDarkSvg);
  fs.writeFileSync(path.join(assetsDir, 'bom-light.svg'), bomLightSvg);

  const connectDarkSvg = await buildConnectSvg('dark', config, theme.dark);
  const connectLightSvg = await buildConnectSvg('light', config, theme.light);
  fs.writeFileSync(path.join(assetsDir, 'connect-dark.svg'), connectDarkSvg);
  fs.writeFileSync(path.join(assetsDir, 'connect-light.svg'), connectLightSvg);

  console.log('[5/5] Inspecting asset budgets (Max: 400 KB per file, <= 1.5 MB total)...');
  const primaryFiles = [
    'hero-dark.svg',
    'hero-light.svg',
    'path-dark.svg',
    'path-light.svg',
    'work-dark.svg',
    'work-light.svg',
    'bom-dark.svg',
    'bom-light.svg',
    'activity-dark.svg',
    'activity-light.svg',
    'connect-dark.svg',
    'connect-light.svg'
  ];

  let totalBytes = 0;
  for (const f of primaryFiles) {
    const filePath = path.join(assetsDir, f);
    const stat = fs.statSync(filePath);
    totalBytes += stat.size;
    const kb = (stat.size / 1024).toFixed(1);
    const pass = stat.size <= 400 * 1024 ? 'PASS' : 'OVER BUDGET';
    console.log(`  - ${f.padEnd(20)} : ${kb.padStart(6)} KB [${pass}]`);
  }
  const totalKb = (totalBytes / 1024).toFixed(1);
  const totalPass = totalBytes <= 1.5 * 1024 * 1024 ? 'PASS' : 'OVER BUDGET';
  console.log(`------------------------------------------------`);
  console.log(`Total primary payload: ${totalKb} KB / 1500 KB [${totalPass}]`);
  console.log('Build complete.\n');
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
