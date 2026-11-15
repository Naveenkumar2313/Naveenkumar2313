/**
 * Sanitizes text strings for safe injection into SVG XML.
 * @param {string} str 
 * @returns {string}
 */
export function escapeXml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
