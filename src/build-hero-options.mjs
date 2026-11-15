import fs from 'fs';
import path from 'path';
import { theme } from './theme.mjs';
import { initFonts } from './font-outliner.mjs';
import { buildHeroLayoutSvg } from './components/hero-options.mjs';

async function main() {
  const config = JSON.parse(fs.readFileSync(path.resolve('src/profile.config.json'), 'utf8'));
  const assetsDir = path.resolve('assets');

  await initFonts();

  // Option 1
  const opt1Dark = await buildHeroLayoutSvg('dark', config, theme.dark, 1);
  const opt1Light = await buildHeroLayoutSvg('light', config, theme.light, 1);
  fs.writeFileSync(path.join(assetsDir, 'hero-opt1-dark.svg'), opt1Dark);
  fs.writeFileSync(path.join(assetsDir, 'hero-opt1-light.svg'), opt1Light);

  // Option 2
  const opt2Dark = await buildHeroLayoutSvg('dark', config, theme.dark, 2);
  const opt2Light = await buildHeroLayoutSvg('light', config, theme.light, 2);
  fs.writeFileSync(path.join(assetsDir, 'hero-opt2-dark.svg'), opt2Dark);
  fs.writeFileSync(path.join(assetsDir, 'hero-opt2-light.svg'), opt2Light);

  console.log('Hero Option 1 & 2 assets generated successfully.');
}

main().catch(console.error);
