import opentype from 'opentype.js';
import path from 'path';

const fonts = {};

export async function initFonts() {
  if (fonts.spaceGrotesk && fonts.jetBrainsMono) return;
  
  fonts.spaceGrotesk = await opentype.load(path.resolve('src/fonts/SpaceGrotesk.ttf'));
  fonts.jetBrainsMono = await opentype.load(path.resolve('src/fonts/JetBrainsMono.ttf'));
}

/**
 * Converts text into an SVG <path> string using vector geometry.
 * @param {string} text 
 * @param {'display'|'mono'} type 
 * @param {number} size 
 * @param {number} x 
 * @param {number} y 
 * @param {object} options { tracking: number, anchor: 'start'|'middle'|'end', fill: string }
 */
export function renderTextPath(text, type, size, x, y, options = {}) {
  const font = type === 'display' ? fonts.spaceGrotesk : fonts.jetBrainsMono;
  if (!font) throw new Error('Fonts not initialized. Call initFonts() first.');

  const tracking = options.tracking !== undefined ? options.tracking : (type === 'display' ? -0.02 : 0.08);
  const letterSpacing = size * tracking;
  const fill = options.fill || 'currentColor';
  const anchor = options.anchor || 'start';

  // Measure total width including tracking
  let totalWidth = 0;
  const glyphs = font.stringToGlyphs(text);
  for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i];
    const adv = glyph.advanceWidth * (size / font.unitsPerEm);
    totalWidth += adv;
    if (i < glyphs.length - 1) {
      totalWidth += letterSpacing;
    }
  }

  let startX = x;
  if (anchor === 'middle') {
    startX = x - totalWidth / 2;
  } else if (anchor === 'end') {
    startX = x - totalWidth;
  }

  let currentX = startX;
  const pathParts = [];

  for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i];
    const glyphPath = glyph.getPath(currentX, y, size);
    const d = glyphPath.toPathData(1);
    if (d && d.length > 0) {
      pathParts.push(d);
    }
    const adv = glyph.advanceWidth * (size / font.unitsPerEm);
    currentX += adv + letterSpacing;
  }

  const combinedD = pathParts.join(' ');
  return {
    d: combinedD,
    width: totalWidth,
    toSvg: (extraAttrs = '') => `<path d="${combinedD}" fill="${fill}" ${extraAttrs} />`
  };
}

