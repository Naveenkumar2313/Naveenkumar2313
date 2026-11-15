import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

let cachedBase64 = null;

/**
 * Optimizes the cutout photo to a lightweight WebP data-URI under 120 KB.
 * @returns {Promise<string|null>}
 */
export async function getOptimizedCutoutWebP() {
  if (cachedBase64) return cachedBase64;

  const inputPath = path.resolve('inputs/naveen-cutout.png');
  if (!fs.existsSync(inputPath)) {
    return null;
  }

  try {
    const webpBuffer = await sharp(inputPath)
      .resize({ height: 560, fit: 'inside' })
      .webp({ quality: 85, effort: 6 })
      .toBuffer();

    console.log(`[Image Optimizer] Cutout optimized to ${(webpBuffer.length / 1024).toFixed(1)} KB (budget: <= 120 KB)`);
    cachedBase64 = `data:image/webp;base64,${webpBuffer.toString('base64')}`;
    return cachedBase64;
  } catch (err) {
    console.error('[Image Optimizer] Error processing photo:', err);
    return null;
  }
}

