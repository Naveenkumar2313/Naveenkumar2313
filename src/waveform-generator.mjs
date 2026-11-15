// Waveform generator with identical point count for SVG path morphing
const N = 40; // 40 cubic bezier segments
const X_START = 710;
const X_END = 1110;
const Y_MID = 240;
const AMP = 55;
const WIDTH = X_END - X_START;
const DX = WIDTH / N;

function getSineY(t) {
  // t in [0, 1]
  // 3 cycles
  return Y_MID - AMP * Math.sin(t * Math.PI * 6);
}

function getDistortedY(t) {
  // 3 cycles with 2nd & 3rd harmonic distortion + soft saturation
  const raw = Math.sin(t * Math.PI * 6) + 0.35 * Math.sin(t * Math.PI * 12 + 0.4) - 0.2 * Math.sin(t * Math.PI * 18);
  return Y_MID - AMP * Math.tanh(raw * 1.4);
}

function getClippedY(t) {
  // Clipped by comparator threshold (diode clipper / op-amp threshold)
  const raw = Math.sin(t * Math.PI * 6) * 1.8;
  const clipped = Math.max(-0.7, Math.min(0.7, raw));
  return Y_MID - AMP * (clipped / 0.7);
}

function getSquareY(t) {
  // Clean digital square wave with sharp transitions
  const s = Math.sin(t * Math.PI * 6);
  const val = Math.tanh(s * 15); // steep transition
  return Y_MID - AMP * val * 0.95;
}

function getBitsY(t) {
  // Binary stream: 1 0 1 1 0 1 0 0
  // 8 bit cells across the 3 cycles
  const bits = [1, 0, 1, 1, 0, 1, 0, 0];
  const bitIdx = Math.min(7, Math.floor(t * 8));
  const bitVal = bits[bitIdx];
  // Small clock pulse or level
  const target = bitVal === 1 ? -0.85 : 0.85;
  return Y_MID + AMP * target;
}

export function generateWaveformPath(sampleFn) {
  const points = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = X_START + t * WIDTH;
    const y = sampleFn(t);
    points.push({ x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) });
  }

  // Generate cubic bezier sequence
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i <= N; i++) {
    const pPrev = points[i - 1];
    const pCurr = points[i];
    // Simple cubic bezier control points
    const cp1x = Number((pPrev.x + DX * 0.4).toFixed(1));
    const cp1y = pPrev.y;
    const cp2x = Number((pCurr.x - DX * 0.4).toFixed(1));
    const cp2y = pCurr.y;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pCurr.x} ${pCurr.y}`;
  }
  return d;
}

export function getAllWaveforms() {
  return {
    sine: generateWaveformPath(getSineY),
    distorted: generateWaveformPath(getDistortedY),
    clipped: generateWaveformPath(getClippedY),
    square: generateWaveformPath(getSquareY),
    bits: generateWaveformPath(getBitsY)
  };
}
